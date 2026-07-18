import React, { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable, formatINR, PageHeader, SearchBar, StatCard } from '@/tenant/components/TenantUI';
import { InventoryStatusBadge } from '@/tenant/inventory/components/InventoryStatusBadge';
import { useInventoryData } from '@/tenant/inventory/state/InventoryDataProvider';

type CatalogView = 'Item Groups' | 'Composite Items' | 'Price Lists';

const catalogViews: CatalogView[] = ['Item Groups', 'Composite Items', 'Price Lists'];

const InventoryCatalogPage: React.FC = () => {
  const inventory = useInventoryData();
  const [view, setView] = useState<CatalogView>('Item Groups');
  const [search, setSearch] = useState('');
  const query = search.toLowerCase().trim();

  const filteredGroups = useMemo(() => inventory.itemGroups.filter((group) =>
    !query || [group.name, group.defaultUnit, group.attributes.join(' ')].join(' ').toLowerCase().includes(query)
  ), [inventory.itemGroups, query]);

  const filteredCompositeItems = useMemo(() => inventory.compositeItems.filter((item) =>
    !query || [item.name, item.sku, item.components.map((component) => component.productName).join(' ')].join(' ').toLowerCase().includes(query)
  ), [inventory.compositeItems, query]);

  const filteredPriceLists = useMemo(() => inventory.priceLists.filter((priceList) =>
    !query || [priceList.name, priceList.type, priceList.appliesTo, priceList.adjustmentType].join(' ').toLowerCase().includes(query)
  ), [inventory.priceLists, query]);

  const trackedProducts = inventory.products.filter((product) => product.trackingType && product.trackingType !== 'None');

  return (
    <div>
      <PageHeader
        title="Catalog Setup"
        description="Organize item groups, composite products, and price lists for the inventory catalogue."
        action={<Button variant="outline">New catalog record</Button>}
      />

      <section className="mb-5 grid gap-4 md:grid-cols-4">
        <StatCard label="Item groups" value={String(inventory.itemGroups.length)} hint="Variant families" />
        <StatCard label="Composite items" value={String(inventory.compositeItems.length)} hint="Sellable bundles" />
        <StatCard label="Price lists" value={String(inventory.priceLists.length)} hint="Customer/vendor/region rates" />
        <StatCard label="Tracked SKUs" value={String(trackedProducts.length)} hint="Serial or batch enabled" />
      </section>

      <section className="mb-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div className="grid gap-3 md:grid-cols-[1fr_auto] xl:flex-1">
            <SearchBar value={search} onChange={setSearch} placeholder="Search groups, bundles, price lists..." />
            <Button variant="outline">Export</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {catalogViews.map((item) => (
              <Button key={item} variant={view === item ? 'default' : 'outline'} size="sm" onClick={() => setView(item)}>{item}</Button>
            ))}
          </div>
        </div>
      </section>

      {view === 'Item Groups' && (
        <DataTable headers={['Item group', 'Attributes', 'Default unit', 'GST', 'Variants', 'Active items', 'Status']}>
          {filteredGroups.map((group) => (
            <tr key={group.id}>
              <td className="px-4 py-3">
                <p className="font-medium text-slate-950">{group.name}</p>
                <p className="text-xs text-slate-500">{group.id}</p>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {group.attributes.map((attribute) => <Badge key={attribute} variant="outline">{attribute}</Badge>)}
                </div>
              </td>
              <td className="px-4 py-3 text-slate-600">{group.defaultUnit}</td>
              <td className="px-4 py-3 text-slate-600">{group.gstRate}%</td>
              <td className="px-4 py-3 font-medium text-slate-950">{group.variants}</td>
              <td className="px-4 py-3 font-medium text-slate-950">{group.activeItems}</td>
              <td className="px-4 py-3"><InventoryStatusBadge status={group.status} /></td>
            </tr>
          ))}
        </DataTable>
      )}

      {view === 'Composite Items' && (
        <DataTable headers={['Composite item', 'Components', 'Available', 'Cost', 'Sale price', 'Margin', 'Status']}>
          {filteredCompositeItems.map((item) => {
            const margin = item.salePrice - item.costPrice;
            return (
              <tr key={item.id}>
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-950">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.sku}</p>
                </td>
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    {item.components.map((component) => (
                      <p key={`${item.id}-${component.productId}`} className="text-xs text-slate-600">
                        {component.quantity} {component.unit} x {component.productName}
                      </p>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 font-medium text-slate-950">{item.currentStock}</td>
                <td className="px-4 py-3 text-slate-600">{formatINR(item.costPrice)}</td>
                <td className="px-4 py-3 font-medium text-slate-950">{formatINR(item.salePrice)}</td>
                <td className="px-4 py-3"><Badge className="bg-emerald-50 text-emerald-700">{formatINR(margin)}</Badge></td>
                <td className="px-4 py-3"><InventoryStatusBadge status={item.status} /></td>
              </tr>
            );
          })}
        </DataTable>
      )}

      {view === 'Price Lists' && (
        <DataTable headers={['Price list', 'Type', 'Adjustment', 'Currency', 'Applies to', 'Status']}>
          {filteredPriceLists.map((priceList) => (
            <tr key={priceList.id}>
              <td className="px-4 py-3">
                <p className="font-medium text-slate-950">{priceList.name}</p>
                <p className="text-xs text-slate-500">{priceList.id}</p>
              </td>
              <td className="px-4 py-3"><Badge variant="outline">{priceList.type}</Badge></td>
              <td className="px-4 py-3 text-slate-600">{formatAdjustment(priceList.adjustmentType, priceList.adjustmentValue)}</td>
              <td className="px-4 py-3 text-slate-600">{priceList.currency}</td>
              <td className="px-4 py-3 text-slate-600">{priceList.appliesTo}</td>
              <td className="px-4 py-3"><InventoryStatusBadge status={priceList.status} /></td>
            </tr>
          ))}
        </DataTable>
      )}
    </div>
  );
};

const formatAdjustment = (type: string, value: number) => {
  if (type === 'Fixed') return 'Fixed item rates';
  return `${value}% ${type.toLowerCase()}`;
};

export default InventoryCatalogPage;
