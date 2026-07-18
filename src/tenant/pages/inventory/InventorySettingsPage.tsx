import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable, PageHeader } from '@/tenant/components/TenantUI';
import { useInventoryData } from '@/tenant/inventory/state/InventoryDataProvider';

const InventorySettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const inventory = useInventoryData();

  return (
    <div>
      <PageHeader
        title="Inventory Settings"
        description="Demo configuration for units, categories, valuation, stock rules, and reset controls."
        action={(
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => navigate('/inventory/insights')}><Sparkles className="h-3.5 w-3.5" />Insights & Admin</Button>
            <Button variant="outline" onClick={inventory.resetInventoryData}><RotateCcw className="h-3.5 w-3.5" />Reset Demo Data</Button>
          </div>
        )}
      />

      <section className="grid gap-4 xl:grid-cols-6">
        <SettingsCard title="Stock valuation" value="Moving average" hint="Demo reports use purchase price for current stock value." />
        <SettingsCard title="Default warehouse" value={inventory.warehouses[0]?.name || 'Main Warehouse'} hint="Purchase receipts land here in the local demo." />
        <SettingsCard title="Reorder policy" value="Manual review" hint="Low stock badges trigger when current stock reaches reorder level." />
        <SettingsCard title="Integrations" value={`${inventory.integrations.length} previews`} hint="Static connector readiness and sync status." />
        <SettingsCard title="Automation rules" value={`${inventory.automationRules.length} rules`} hint="Seeded local workflow previews only." />
        <SettingsCard title="Templates" value={`${inventory.documentTemplates.length} layouts`} hint="Purchase, challan, label, and inventory document previews." />
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <div>
          <h2 className="mb-3 font-semibold text-slate-950">Units</h2>
          <DataTable headers={['Unit', 'Usage']}>
            {[
              ['Piece', 'Hardware and devices'],
              ['Pack', 'Labels and consumables'],
              ['Roll', 'Paper and sticker rolls'],
              ['Kit', 'Bundled implementation packs'],
              ['Year', 'Software licences'],
            ].map(([unit, usage]) => (
              <tr key={unit}>
                <td className="px-4 py-3 font-medium text-slate-950">{unit}</td>
                <td className="px-4 py-3 text-slate-600">{usage}</td>
              </tr>
            ))}
          </DataTable>
        </div>
        <div>
          <h2 className="mb-3 font-semibold text-slate-950">Categories</h2>
          <DataTable headers={['Category', 'Products']}>
            {Array.from(new Set(inventory.products.map((product) => product.category))).map((category) => (
              <tr key={category}>
                <td className="px-4 py-3 font-medium text-slate-950">{category}</td>
                <td className="px-4 py-3 text-slate-600">{inventory.products.filter((product) => product.category === category).length}</td>
              </tr>
            ))}
          </DataTable>
        </div>
      </section>
    </div>
  );
};

const SettingsCard: React.FC<{ title: string; value: string; hint: string }> = ({ title, value, hint }) => (
  <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
    <p className="text-sm text-slate-500">{title}</p>
    <p className="mt-2 text-lg font-semibold text-slate-950">{value}</p>
    <p className="mt-2 text-xs text-slate-500">{hint}</p>
  </div>
);

export default InventorySettingsPage;
