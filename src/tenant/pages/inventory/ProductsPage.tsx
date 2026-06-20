import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, FilePlus2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader, SearchBar } from '@/tenant/components/TenantUI';
import { ProductTable } from '@/tenant/inventory/components/ProductTable';
import { useInventoryData } from '@/tenant/inventory/state/InventoryDataProvider';
import { getStockStatus } from '@/tenant/inventory/services/inventoryDemoService';
import type { StockStatus } from '@/tenant/inventory/types';

const ProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const inventory = useInventoryData();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState<'All' | StockStatus>('All');
  const categories = useMemo(() => ['All', ...Array.from(new Set(inventory.products.map((product) => product.category)))], [inventory.products]);

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase().trim();
    return inventory.products.filter((product) => {
      const searchMatch = !query || [product.name, product.sku, product.barcode, product.category, product.hsnCode].join(' ').toLowerCase().includes(query);
      const categoryMatch = category === 'All' || product.category === category;
      const statusMatch = status === 'All' || getStockStatus(product) === status;
      return searchMatch && categoryMatch && statusMatch;
    });
  }, [category, inventory.products, search, status]);

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage catalogue, SKU, barcode, GST, pricing, opening stock, reorder level, and status."
        action={<Button onClick={() => navigate('/inventory/products/new')}><FilePlus2 className="h-4 w-4" />Create Product</Button>}
      />

      <section className="mb-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 xl:grid-cols-[1fr_220px_220px_auto]">
          <SearchBar value={search} onChange={setSearch} placeholder="Search product, SKU, barcode, HSN..." />
          <Select label="Category" value={category} options={categories} onChange={setCategory} />
          <Select label="Stock status" value={status} options={['All', 'In Stock', 'Low Stock', 'Out of Stock']} onChange={(value) => setStatus(value as typeof status)} />
          <div className="flex items-end justify-end">
            <Button variant="outline"><Download className="h-3.5 w-3.5" />Export</Button>
          </div>
        </div>
        <p className="mt-3 text-sm text-slate-500">{filteredProducts.length} products</p>
      </section>

      <ProductTable products={filteredProducts} onEdit={(id) => navigate(`/inventory/products/${id}/edit`)} />
    </div>
  );
};

const Select: React.FC<{ label: string; value: string; options: string[]; onChange: (value: string) => void }> = ({ label, value, options, onChange }) => (
  <label className="grid gap-1">
    <span className="text-xs font-medium text-slate-500">{label}</span>
    <select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100">
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  </label>
);

export default ProductsPage;
