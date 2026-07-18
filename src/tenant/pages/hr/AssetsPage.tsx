import React, { useMemo, useState } from 'react';
import { Laptop, PackageCheck, RotateCcw, UserPlus, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable, PageHeader, SearchBar, StatCard } from '@/tenant/components/TenantUI';
import { useHrAccess } from '@/tenant/hr/HrAccess';
import { useHrData } from '@/tenant/hr/HrDataProvider';
import { HrStatusBadge } from '@/tenant/hr/HrStatusBadge';
import type { AssetCondition, AssetStatus, Employee } from '@/tenant/hr/types';

const assetStatuses: AssetStatus[] = ['Available', 'Assigned', 'In Repair', 'Retired'];
const returnConditions: AssetCondition[] = ['Good', 'Needs Repair', 'Damaged'];
const selectClass = 'flex h-9 w-full min-w-36 rounded-sm border border-slate-200 bg-white px-2 py-1 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100';

const AssetsPage: React.FC = () => {
  const hr = useHrData();
  const access = useHrAccess();
  const canManageAssets = ['Business Owner', 'HR Admin'].includes(access.activeRole);
  const [query, setQuery] = useState('');
  const [assignOpen, setAssignOpen] = useState(false);
  const visibleAssets = useMemo(() => hr.assets.filter((asset) => `${asset.assetTag} ${asset.name} ${asset.category} ${asset.assignedToName || ''} ${asset.location}`.toLowerCase().includes(query.toLowerCase())), [hr.assets, query]);
  const availableAssets = hr.assets.filter((asset) => asset.status === 'Available');
  const assignedAssets = hr.assets.filter((asset) => asset.status === 'Assigned');
  const returnDue = hr.assets.filter((asset) => asset.returnStatus === 'Return Due');
  const repairQueue = hr.assets.filter((asset) => asset.status === 'In Repair');

  return (
    <div>
      <PageHeader
        title="Assets"
        description="Employee asset inventory, assignment, return clearance, repair status, and static activity history."
        action={canManageAssets ? <Button onClick={() => setAssignOpen(true)}><UserPlus className="h-4 w-4" />Assign asset</Button> : undefined}
      />
      <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total assets" value={String(hr.assets.length)} icon={<Laptop className="h-4 w-4" />} />
        <StatCard label="Assigned" value={String(assignedAssets.length)} icon={<PackageCheck className="h-4 w-4" />} />
        <StatCard label="Return due" value={String(returnDue.length)} icon={<RotateCcw className="h-4 w-4" />} />
        <StatCard label="Repair queue" value={String(repairQueue.length)} icon={<Wrench className="h-4 w-4" />} />
      </section>

      <Tabs defaultValue="inventory">
        <TabsList className="max-w-full justify-start overflow-x-auto">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="returns">Returns & Clearance</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="mt-4">
          <div className="mb-4 max-w-md"><SearchBar value={query} onChange={setQuery} placeholder="Search assets, tags, employees, or locations" /></div>
          <DataTable headers={['Asset tag', 'Asset', 'Category', 'Serial', 'Status', 'Condition', 'Assigned to', 'Location', 'Action']}>
            {visibleAssets.map((asset) => (
              <tr key={asset.id}>
                <td className="px-4 py-3 font-medium text-indigo-700">{asset.assetTag}</td>
                <td className="px-4 py-3 font-medium text-slate-950">{asset.name}</td>
                <td className="px-4 py-3 text-slate-600">{asset.category}</td>
                <td className="px-4 py-3 text-slate-600">{asset.serialNumber}</td>
                <td className="px-4 py-3"><AssetStatusSelect value={asset.status} disabled={!canManageAssets} onChange={(status) => hr.updateAssetStatus(asset.id, status)} /></td>
                <td className="px-4 py-3 text-slate-600">{asset.condition}</td>
                <td className="px-4 py-3 text-slate-600">{asset.assignedToName || 'Unassigned'}</td>
                <td className="px-4 py-3 text-slate-600">{asset.location}</td>
                <td className="px-4 py-3">
                  {asset.status === 'Assigned' && canManageAssets ? (
                    <div className="flex gap-1"><Button size="sm" variant="outline" onClick={() => hr.markAssetReturned(asset.id, 'Good')}>Return</Button><Button size="sm" variant="outline" onClick={() => hr.markAssetReturned(asset.id, 'Needs Repair')}>Repair</Button></div>
                  ) : (
                    <span className="text-xs text-slate-500">{asset.status === 'Available' ? 'Ready' : asset.status === 'Assigned' ? 'View assignment' : 'Tracked'}</span>
                  )}
                </td>
              </tr>
            ))}
          </DataTable>
        </TabsContent>

        <TabsContent value="assignments" className="mt-4">
          <DataTable headers={['Employee', 'Asset', 'Tag', 'Assigned date', 'Expected return', 'Return status', 'Notes']}>
            {assignedAssets.map((asset) => (
              <tr key={asset.id}>
                <td className="px-4 py-3 font-medium text-slate-950">{asset.assignedToName}</td>
                <td className="px-4 py-3 text-slate-600">{asset.name}</td>
                <td className="px-4 py-3 font-medium text-indigo-700">{asset.assetTag}</td>
                <td className="px-4 py-3 text-slate-600">{asset.assignedDate || '-'}</td>
                <td className="px-4 py-3 text-slate-600">{asset.expectedReturnDate || '-'}</td>
                <td className="px-4 py-3"><HrStatusBadge status={asset.returnStatus} /></td>
                <td className="max-w-80 px-4 py-3 text-slate-600">{asset.notes}</td>
              </tr>
            ))}
          </DataTable>
        </TabsContent>

        <TabsContent value="returns" className="mt-4 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <DataTable headers={['Employee', 'Asset', 'Due date', 'Condition', 'Action']}>
            {returnDue.map((asset) => (
              <tr key={asset.id}>
                <td className="px-4 py-3 font-medium text-slate-950">{asset.assignedToName}</td>
                <td className="px-4 py-3 text-slate-600">{asset.name} | {asset.assetTag}</td>
                <td className="px-4 py-3 text-slate-600">{asset.expectedReturnDate || '-'}</td>
                <td className="px-4 py-3 text-slate-600">{asset.condition}</td>
                <td className="px-4 py-3">
                  {canManageAssets ? <ReturnButtons assetId={asset.id} onReturn={hr.markAssetReturned} /> : <span className="text-xs text-slate-500">View only</span>}
                </td>
              </tr>
            ))}
            {!returnDue.length && <EmptyTableRow columns={5} label="No assets are currently due for return." />}
          </DataTable>
          <section className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="font-semibold text-slate-950">Offboarding asset clearance</h2>
            <div className="mt-4 space-y-2">
              {hr.offboardingItems.filter((item) => item.title.toLowerCase().includes('asset') || item.title.toLowerCase().includes('laptop') || item.title.toLowerCase().includes('id card')).map((item) => (
                <div key={item.id} className="rounded-sm border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                  <div className="flex items-center justify-between gap-3"><span className="font-medium text-slate-800">{item.employeeName}</span><HrStatusBadge status={item.status} /></div>
                  <p className="mt-1 text-slate-600">{item.title} | due {item.dueDate}</p>
                </div>
              ))}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="activity" className="mt-4">
          <DataTable headers={['Date', 'Asset', 'Employee/store', 'Action', 'Owner', 'Notes']}>
            {hr.assetActivities.map((activity) => (
              <tr key={activity.id}>
                <td className="px-4 py-3 text-slate-600">{activity.date}</td>
                <td className="px-4 py-3 font-medium text-indigo-700">{activity.assetTag}</td>
                <td className="px-4 py-3 text-slate-600">{activity.employeeName}</td>
                <td className="px-4 py-3 font-medium text-slate-950">{activity.action}</td>
                <td className="px-4 py-3 text-slate-600">{activity.owner}</td>
                <td className="max-w-96 px-4 py-3 text-slate-600">{activity.notes}</td>
              </tr>
            ))}
          </DataTable>
        </TabsContent>
      </Tabs>

      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assign asset</DialogTitle>
            <DialogDescription>Assign an available demo asset to an employee profile.</DialogDescription>
          </DialogHeader>
          <AssignAssetForm assets={availableAssets} employees={hr.employees} onSubmit={(assetId, employeeId) => { hr.assignAsset(assetId, employeeId); setAssignOpen(false); }} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

const AssignAssetForm: React.FC<{ assets: ReturnType<typeof useHrData>['assets']; employees: Employee[]; onSubmit: (assetId: string, employeeId: string) => void }> = ({ assets, employees, onSubmit }) => {
  const [assetId, setAssetId] = useState(assets[0]?.id || '');
  const [employeeId, setEmployeeId] = useState(employees[0]?.id || '');
  return (
    <form className="grid gap-4 sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); onSubmit(assetId, employeeId); }}>
      <Field label="Available asset"><select required className={selectClass} value={assetId} onChange={(event) => setAssetId(event.target.value)}>{assets.map((asset) => <option key={asset.id} value={asset.id}>{asset.assetTag} | {asset.name}</option>)}</select></Field>
      <Field label="Employee"><select required className={selectClass} value={employeeId} onChange={(event) => setEmployeeId(event.target.value)}>{employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name}</option>)}</select></Field>
      <div className="flex justify-end sm:col-span-2"><Button type="submit" disabled={!assetId || !employeeId}>Assign asset</Button></div>
    </form>
  );
};

const ReturnButtons: React.FC<{ assetId: string; onReturn: (assetId: string, condition: AssetCondition) => void }> = ({ assetId, onReturn }) => (
  <div className="flex flex-wrap gap-1">
    {returnConditions.map((condition) => <Button key={condition} size="sm" variant="outline" onClick={() => onReturn(assetId, condition)}>{condition}</Button>)}
  </div>
);

const AssetStatusSelect: React.FC<{ value: AssetStatus; disabled: boolean; onChange: (status: AssetStatus) => void }> = ({ value, disabled, onChange }) => <select className={selectClass} value={value} disabled={disabled} onChange={(event) => onChange(event.target.value as AssetStatus)}>{assetStatuses.map((status) => <option key={status}>{status}</option>)}</select>;
const Field: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({ label, children, className }) => <Label className={`block ${className || ''}`}><span className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</span>{children}</Label>;
const EmptyTableRow: React.FC<{ columns: number; label: string }> = ({ columns, label }) => <tr><td colSpan={columns} className="px-4 py-8 text-center text-sm text-slate-500">{label}</td></tr>;

export default AssetsPage;
