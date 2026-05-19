import React, { useState, useEffect } from "react"
import { PageContainer, SectionHeader } from "@/components/common/PageLayout"
import { cn } from "@/utils"
import { useAppSelector, useAppDispatch } from "@/store"
import { resetSearchQuery } from "@/store/features/searchSlice"
import { notify } from "@/services/notificationService"
import { 
  MOCK_INVENTORY, 
  InventoryCompactItem, 
  InventoryProductCard, 
  InventoryStockRow, 
  type InventoryItem 
} from "@/components/inventory"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Boxes, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign, 
  QrCode, 
  FileSpreadsheet, 
  Warehouse, 
  ListTodo, 
  LayoutGrid, 
  ListOrdered,
  Plus,
  RefreshCw,
  Truck,
  ArrowLeftRight
} from "lucide-react"

export default function InventoryPage() {
  const dispatch = useAppDispatch()
  
  // Real-time local state simulated from MOCK dataset
  const [inventory, setInventory] = useState<InventoryItem[]>(MOCK_INVENTORY)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [inspectedItemId, setInspectedItemId] = useState<string>("PROD002") // default inspect low stock
  const [activeFilter, setActiveFilter] = useState<"all" | "in_stock" | "low_stock" | "out_of_stock">("all")
  const [isLoading, setIsLoading] = useState(false)

  // Read search query from Redux global slice
  const searchQuery = useAppSelector((state) => state.search.query)

  // Auto reset search bar on navigate unmount
  useEffect(() => {
    return () => {
      dispatch(resetSearchQuery())
    }
  }, [dispatch])

  // Get active item for inspector side panel
  const inspectedItem = inventory.find(i => i.id === inspectedItemId) || inventory[0]

  // Dynamic KPI Calculators
  const totalStockCount = inventory.reduce((sum, item) => sum + item.quantity, 0)
  const lowStockCount = inventory.filter(item => item.status === "low_stock").length
  const outOfStockCount = inventory.filter(item => item.status === "out_of_stock").length
  const capitalValuation = inventory.reduce((sum, item) => sum + (item.quantity * item.price.purchase), 0)

  // Search & Tab filtering logic
  const filteredInventory = inventory.filter(item => {
    // 1. Search Query filter
    const query = searchQuery.toLowerCase().trim()
    const matchesSearch = !query || (
      item.name.toLowerCase().includes(query) ||
      item.sku.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.warehouseLocation.toLowerCase().includes(query) ||
      item.barcode.includes(query)
    )

    // 2. Tab filter
    if (activeFilter === "all") return matchesSearch
    return matchesSearch && item.status === activeFilter
  })

  // Checkbox handlers
  const handleSelectOne = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, itemId])
    } else {
      setSelectedIds(prev => prev.filter(id => id !== itemId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredInventory.map(i => i.id))
    } else {
      setSelectedIds([])
    }
  }

  // Simulating Inventory Actions
  const handleInventoryAction = (actionType: string, item: InventoryItem) => {
    setInspectedItemId(item.id) // Inspect the clicked item

    switch (actionType) {
      case "inspect":
        notify.info("Inspect Mode", `Loaded detailed parameters for ${item.name}.`)
        break;

      case "restock":
        setIsLoading(true)
        setTimeout(() => {
          setInventory(prev => prev.map(prod => {
            if (prod.id === item.id) {
              const newQty = prod.quantity + 50
              // Recalculate status dynamically
              const newStatus = newQty === 0 ? "out_of_stock" : newQty <= prod.minQuantity ? "low_stock" : "in_stock"
              return {
                ...prod,
                quantity: newQty,
                status: newStatus,
                stockHistory: [...prod.stockHistory.slice(1), newQty]
              }
            }
            return prod
          }))
          setIsLoading(false)
          notify.success(
            "Product Restocked", 
            `Successfully credited +50 units to ${item.name}. Current stock: ${item.quantity + 50}.`
          )
        }, 600)
        break;

      case "transfer":
        setIsLoading(true)
        setTimeout(() => {
          const aisles = ["Aisle 1, Bin A-02", "Aisle 2, Bin C-09", "Aisle 3, Bin D-12", "Aisle 4, Bin B-05", "Aisle 5, Bin E-01"]
          const randomAisle = aisles[Math.floor(Math.random() * aisles.length)]
          setInventory(prev => prev.map(prod => {
            if (prod.id === item.id) {
              return { ...prod, warehouseLocation: randomAisle }
            }
            return prod
          }))
          setIsLoading(false)
          notify.success(
            "Logistics Transfer", 
            `Rerouted ${item.name} warehouse location to ${randomAisle} successfully.`
          )
        }, 500)
        break;

      case "edit":
        notify.info("Feature Simulation", `Opening product config modal for SKU: ${item.sku}.`)
        break;

      case "audit":
        notify.success("Audit Requested", `Initiated stock count audit schedule for ${item.name}.`)
        break;

      case "write_off":
        setInventory(prev => prev.map(prod => {
          if (prod.id === item.id) {
            return { ...prod, quantity: 0, status: "out_of_stock" }
          }
          return prod
        }))
        notify.warning("Stock Written Off", `Decremented quantity for ${item.name} to 0. Stock status is now Out of Stock.`)
        break;

      default:
        break;
    }
  }

  // Bulk Actions
  const handleBulkTransfer = () => {
    if (selectedIds.length === 0) return
    setIsLoading(true)
    setTimeout(() => {
      setInventory(prev => prev.map(prod => {
        if (selectedIds.includes(prod.id)) {
          return { ...prod, warehouseLocation: "Aisle 4, Shelf T-Bulk" }
        }
        return prod
      }))
      setSelectedIds([])
      setIsLoading(false)
      notify.success("Bulk Transfer Complete", "Transferred selected items to Bulk Zone 4 successfully.")
    }, 800)
  }

  return (
    <PageContainer>
      {/* Top Section Header */}
      <SectionHeader
        title="Inventory & Logistics"
        description="Monitor multi-warehouse inventory levels, track batch stock parameters, and adjust selling margins."
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => notify.info("Export PDF", "Downloading Excel stock ledger report.")} className="shadow-xs cursor-pointer">
              <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-500" />
              Stock Ledger
            </Button>
            <Button onClick={() => notify.success("Add Product", "Opening 'Add New Product' portal modal simulation.")} className="cursor-pointer">
              <Plus className="mr-2 h-4 w-4" />
              Add New Product
            </Button>
          </div>
        }
      />

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {/* KPI 1: Valuation */}
        <div className="bg-card border rounded-3xl p-5 shadow-2xs flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Capital Valuation</span>
            <h3 className="text-2xl font-extrabold text-foreground tracking-tight">${capitalValuation.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
            <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-0.5">
              <TrendingUp size={12} /> Active Stock Net Value
            </span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
            <DollarSign size={22} />
          </div>
        </div>

        {/* KPI 2: Total Quantity */}
        <div className="bg-card border rounded-3xl p-5 shadow-2xs flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total Stock Count</span>
            <h3 className="text-2xl font-extrabold text-foreground tracking-tight">{totalStockCount.toLocaleString()} <span className="text-xs text-muted-foreground font-semibold">pcs</span></h3>
            <span className="text-[10px] text-muted-foreground font-semibold">Across all aisles</span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
            <Boxes size={22} />
          </div>
        </div>

        {/* KPI 3: Low Stock Warnings */}
        <div className="bg-card border rounded-3xl p-5 shadow-2xs flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Low Stock Warnings</span>
            <h3 className="text-2xl font-extrabold text-amber-500 tracking-tight">{lowStockCount} Items</h3>
            <span className="text-[10px] text-amber-500/80 font-semibold flex items-center gap-0.5 animate-pulse">
              <AlertTriangle size={12} /> Reorder thresholds reached
            </span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
            <AlertTriangle size={22} />
          </div>
        </div>

        {/* KPI 4: Out of Stock Alerts */}
        <div className="bg-card border rounded-3xl p-5 shadow-2xs flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Out of Stock Alerts</span>
            <h3 className="text-2xl font-extrabold text-rose-500 tracking-tight">{outOfStockCount} Items</h3>
            <span className="text-[10px] text-rose-500/80 font-semibold flex items-center gap-0.5">
              Critical supply deficit
            </span>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
            <Warehouse size={22} />
          </div>
        </div>
      </div>

      {/* Main Core Layout: Sidebar Alert Feed + Central View Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        
        {/* Left Side: Sidebar Alert Feed (InventoryCompactItem) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card border rounded-3xl p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Critical Reorder Alert Feed</h3>
              <Badge className="bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 font-bold border-transparent">
                Live Stock Feed
              </Badge>
            </div>
            
            <p className="text-xs text-muted-foreground leading-relaxed font-semibold">
              Products that have depleted past minimum threshold. Click to inspect logistics.
            </p>
            
            <Separator className="bg-muted" />

            {/* Sidebar list items filtering low and out of stock */}
            <div className="space-y-2.5">
              {inventory.filter(i => i.status !== "in_stock").map(item => (
                <InventoryCompactItem
                  key={item.id}
                  item={item}
                  isLoading={isLoading}
                  onAction={handleInventoryAction}
                />
              ))}
            </div>
          </div>

          {/* Profile Inspector View Card (Product Inspector Details Panel) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Product Inspection Panel</span>
              <Badge className="bg-indigo-500/10 text-indigo-500 border-transparent hover:bg-indigo-500/20 font-bold">
                Aisle Inspector
              </Badge>
            </div>

            {/* Detailed product inspection layout card */}
            <div className="bg-card border rounded-3xl p-5 shadow-2xs space-y-4">
              <div className="flex items-center gap-3">
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center font-bold text-sm text-foreground", inspectedItem.thumbnail)}>
                  {inspectedItem.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider block font-mono">{inspectedItem.sku}</span>
                  <h4 className="text-sm font-bold text-foreground truncate">{inspectedItem.name}</h4>
                </div>
              </div>

              <Separator className="bg-muted" />

              {/* Price Details Breakdown */}
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-muted-foreground">
                <div className="bg-muted/40 p-2.5 rounded-xl">
                  <span className="text-[8px] uppercase tracking-wider text-muted-foreground/80 block font-bold">Purchase Price</span>
                  <span className="text-sm font-extrabold text-foreground mt-0.5 block">${inspectedItem.price.purchase.toFixed(2)}</span>
                </div>
                <div className="bg-muted/40 p-2.5 rounded-xl">
                  <span className="text-[8px] uppercase tracking-wider text-muted-foreground/80 block font-bold">Selling Price</span>
                  <span className="text-sm font-extrabold text-primary mt-0.5 block">${inspectedItem.price.selling.toFixed(2)}</span>
                </div>
              </div>

              {/* Stock Trend Mini Graph Mock */}
              <div className="space-y-1">
                <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider block">Stock Levels (6 Mo Trend)</span>
                <div className="h-10 w-full flex items-end gap-1 px-1 bg-muted/10 border border-dashed rounded-xl pt-2 pb-0.5">
                  {inspectedItem.stockHistory.map((val, idx) => {
                    const maxVal = Math.max(...inspectedItem.stockHistory) || 100;
                    const heightPercent = Math.max(10, Math.round((val / maxVal) * 100));
                    return (
                      <div 
                        key={idx}
                        className={cn(
                          "flex-1 rounded-t-sm transition-all duration-300",
                          inspectedItem.status === "in_stock" ? "bg-emerald-500/50 hover:bg-emerald-500" :
                          inspectedItem.status === "low_stock" ? "bg-amber-500/50 hover:bg-amber-500" :
                          "bg-rose-500/50 hover:bg-rose-500"
                        )}
                        style={{ height: `${heightPercent}%` }}
                        title={`Month ${idx + 1}: ${val} units`}
                      />
                    )
                  })}
                </div>
              </div>

              {/* Contact Supplier Details */}
              <div className="bg-muted/30 rounded-2xl p-3 space-y-2">
                <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-wider block">Assigned Supplier</span>
                <div className="text-xs font-semibold">
                  <span className="text-foreground font-bold block">{inspectedItem.supplier.name}</span>
                  <span className="text-muted-foreground block text-[11px] mt-0.5">{inspectedItem.supplier.email}</span>
                  <span className="text-muted-foreground block text-[11px] font-mono">{inspectedItem.supplier.phone}</span>
                </div>
              </div>

              {/* Simulators */}
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleInventoryAction("restock", inspectedItem)}
                  className="flex-1 text-xs font-bold gap-1 rounded-xl h-9 cursor-pointer"
                >
                  <RefreshCw size={12} className={cn(isLoading && "animate-spin")} />
                  Simulate Restock
                </Button>
                <Button 
                  onClick={() => handleInventoryAction("transfer", inspectedItem)}
                  variant="outline"
                  className="flex-1 text-xs font-bold gap-1 rounded-xl h-9 border-muted-foreground/20 cursor-pointer"
                >
                  <ArrowLeftRight size={12} />
                  Simulate Route
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Central View Tab Catalog lists */}
        <div className="lg:col-span-8 space-y-6">
          <Tabs defaultValue="catalog" className="w-full">
            
            {/* Toolbar section: Tabs, Search indicators, Filter badges */}
            <div className="bg-card border rounded-3xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
              
              <TabsList className="bg-muted/50 border rounded-2xl h-10 p-1 w-fit">
                <TabsTrigger value="catalog" className="rounded-xl px-3 py-1.5 text-xs font-semibold tracking-wide flex items-center gap-2 cursor-pointer">
                  <LayoutGrid className="h-4 w-4" />
                  Product Grid Catalog
                </TabsTrigger>
                <TabsTrigger value="stock" className="rounded-xl px-3 py-1.5 text-xs font-semibold tracking-wide flex items-center gap-2 cursor-pointer">
                  <ListOrdered className="h-4 w-4" />
                  Warehouse Stock Rows
                </TabsTrigger>
              </TabsList>

              {/* Status Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {(["all", "in_stock", "low_stock", "out_of_stock"] as const).map(filter => (
                  <button
                    key={filter}
                    onClick={() => {
                      setActiveFilter(filter)
                      setSelectedIds([])
                    }}
                    className={cn(
                      "text-[10px] uppercase font-bold tracking-wider py-1 px-2.5 rounded-full border transition-all cursor-pointer",
                      activeFilter === filter 
                        ? "bg-primary text-primary-foreground border-primary" 
                        : "bg-muted/40 text-muted-foreground border-transparent hover:bg-muted"
                    )}
                  >
                    {filter.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* TAB CONTENT 1: GRID CATALOG VIEW (InventoryProductCard Grid) */}
            <TabsContent value="catalog" className="mt-4 animate-in fade-in-50 duration-200">
              {filteredInventory.length === 0 ? (
                <div className="text-center py-20 border border-dashed rounded-3xl bg-muted/10">
                  <Boxes className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                  <h4 className="text-sm font-bold">No Products Found</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {searchQuery ? "No catalog matches your search filter query." : "There are currently no products registered in this catalog."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4">
                  {filteredInventory.map(item => (
                    <InventoryProductCard
                      key={item.id}
                      item={item}
                      isLoading={isLoading}
                      onAction={handleInventoryAction}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            {/* TAB CONTENT 2: WAREHOUSE ROW LIST (InventoryStockRow List) */}
            <TabsContent value="stock" className="mt-4 animate-in fade-in-50 duration-200 space-y-4">
              
              {/* Bulk Actions Header */}
              {selectedIds.length > 0 && (
                <div className="bg-muted/30 border border-dashed p-3 rounded-2xl flex items-center justify-between gap-4 animate-in slide-in-from-top-2">
                  <span className="text-xs font-bold text-muted-foreground pr-2 flex items-center gap-1.5">
                    <ListTodo className="h-4 w-4 text-primary" />
                    <strong>{selectedIds.length}</strong> items selected
                  </span>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleBulkTransfer}
                      size="sm" 
                      variant="outline"
                      className="text-xs font-bold h-8 rounded-xl cursor-pointer"
                    >
                      <Truck className="h-3.5 w-3.5 mr-1" />
                      Bulk Route
                    </Button>
                    <Button 
                      onClick={() => {
                        setSelectedIds([])
                        notify.info("Checklist Cleared", "Cleared selection roster.")
                      }}
                      size="sm" 
                      variant="ghost"
                      className="text-xs font-bold h-8 rounded-xl cursor-pointer text-muted-foreground hover:text-foreground"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              )}

              {/* Rows List */}
              <div className="space-y-3">
                {filteredInventory.length === 0 ? (
                  <div className="text-center py-20 border border-dashed rounded-3xl bg-muted/10">
                    <Boxes className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                    <h4 className="text-sm font-bold">No Products Found</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {searchQuery ? "No catalog matches your search filter query." : "There are currently no products registered in this catalog."}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Header Select Roster */}
                    <div className="flex items-center px-4 py-1 text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                      <input 
                        type="checkbox"
                        checked={selectedIds.length === filteredInventory.length && filteredInventory.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer shrink-0 mr-4"
                      />
                      <span>Select All Roster Items</span>
                    </div>

                    {filteredInventory.map(item => (
                      <InventoryStockRow
                        key={item.id}
                        item={item}
                        isSelected={selectedIds.includes(item.id)}
                        onSelectChange={(checked) => handleSelectOne(item.id, checked)}
                        isLoading={isLoading}
                        onAction={handleInventoryAction}
                      />
                    ))}
                  </>
                )}
              </div>
            </TabsContent>

          </Tabs>

        </div>

      </div>
    </PageContainer>
  )
}
