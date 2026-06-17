import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Copy, Eye, FileText, PlusCircle, Send, ShoppingCart, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable, EmptyState, formatINR, PageHeader, StatCard } from '@/tenant/components/TenantUI';
import { useTenantData } from '@/tenant/state/TenantDataProvider';
import type { SalesQuotationItem, SalesQuotationStatus } from '@/tenant/types';

const quotationStatuses: SalesQuotationStatus[] = ['Draft', 'Sent', 'Viewed', 'Accepted', 'Rejected', 'Expired', 'Converted to Order'];

const totals = (items: SalesQuotationItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice - item.discount, 0);
  const tax = items.reduce((sum, item) => {
    const taxable = item.quantity * item.unitPrice - item.discount;
    return sum + (taxable * item.gstRate) / 100;
  }, 0);
  return { subtotal, tax, total: subtotal + tax };
};

export const SalesDashboardPage: React.FC = () => {
  const { salesQuotations, salesOrders, salesSubscriptions } = useTenantData();
  const navigate = useNavigate();
  const pending = salesQuotations.filter((item) => ['Draft', 'Sent', 'Viewed'].includes(item.status));
  const accepted = salesQuotations.filter((item) => item.status === 'Accepted' || item.status === 'Converted to Order');
  const quotationValue = salesQuotations.reduce((sum, item) => sum + totals(item.items).total, 0);
  const recurring = salesSubscriptions.filter((item) => ['Active', 'Renewal Due'].includes(item.status)).reduce((sum, item) => sum + item.amount, 0);
  const expiring = salesSubscriptions.filter((item) => item.status === 'Renewal Due');

  return (
    <div>
      <PageHeader title="Sales Dashboard" description="Quotations, sales orders, subscriptions, and sales performance." action={<Button onClick={() => navigate('/sales/quotations/new')}><PlusCircle className="h-4 w-4" />Create quotation</Button>} />
      <section className="grid gap-4 md:grid-cols-4 xl:grid-cols-7">
        <StatCard label="Total quotations" value={String(salesQuotations.length)} icon={<FileText className="h-4 w-4" />} />
        <StatCard label="Pending" value={String(pending.length)} hint="Draft, sent, viewed" />
        <StatCard label="Accepted" value={String(accepted.length)} />
        <StatCard label="Sales orders" value={String(salesOrders.length)} icon={<ShoppingCart className="h-4 w-4" />} />
        <StatCard label="Monthly sales" value={formatINR(quotationValue)} icon={<TrendingUp className="h-4 w-4" />} />
        <StatCard label="Recurring revenue" value={formatINR(recurring)} />
        <StatCard label="Expiring subs" value={String(expiring.length)} />
      </section>
      <section className="mt-5 grid gap-5 xl:grid-cols-2">
        <SalesSummary title="Quotation conversion trend" items={countBy(salesQuotations.map((item) => item.status))} />
        <SalesSummary title="Sales by user" items={countBy(salesQuotations.map((item) => item.salesperson))} />
      </section>
      <section className="mt-5">
        <DataTable headers={['Quotation', 'Customer', 'Salesperson', 'Total', 'Status', 'Action']}>
          {salesQuotations.slice(0, 8).map((quotation) => (
            <tr key={quotation.id}>
              <td className="px-4 py-3 font-medium text-indigo-700"><Link to={`/sales/quotations/${quotation.id}`}>{quotation.number}</Link></td>
              <td className="px-4 py-3">{quotation.customerName}</td>
              <td className="px-4 py-3">{quotation.salesperson}</td>
              <td className="px-4 py-3 font-medium">{formatINR(totals(quotation.items).total)}</td>
              <td className="px-4 py-3"><SalesStatus status={quotation.status} /></td>
              <td className="px-4 py-3"><Button size="sm" variant="outline" onClick={() => navigate(`/sales/quotations/${quotation.id}`)}>Open</Button></td>
            </tr>
          ))}
        </DataTable>
      </section>
    </div>
  );
};

export const SalesQuotationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { salesQuotations, changeSalesQuotationStatus, duplicateSalesQuotation, convertQuotationToSalesOrder } = useTenantData();
  return (
    <div>
      <PageHeader title="Quotations" description="Create, preview, duplicate, send, accept/reject, and convert quotations." action={<Button onClick={() => navigate('/sales/quotations/new')}><PlusCircle className="h-4 w-4" />Create quotation</Button>} />
      <DataTable headers={['Quotation', 'Customer', 'Date', 'Expiry', 'Salesperson', 'Amount', 'Tax', 'Total', 'Status', 'Actions']}>
        {salesQuotations.map((quotation) => {
          const amount = totals(quotation.items);
          return (
            <tr key={quotation.id}>
              <td className="px-4 py-3 font-medium text-indigo-700"><Link to={`/sales/quotations/${quotation.id}`}>{quotation.number}</Link></td>
              <td className="px-4 py-3">{quotation.customerName}</td>
              <td className="px-4 py-3">{quotation.date}</td>
              <td className="px-4 py-3">{quotation.expiryDate}</td>
              <td className="px-4 py-3">{quotation.salesperson}</td>
              <td className="px-4 py-3">{formatINR(amount.subtotal)}</td>
              <td className="px-4 py-3">{formatINR(amount.tax)}</td>
              <td className="px-4 py-3 font-semibold">{formatINR(amount.total)}</td>
              <td className="px-4 py-3"><SalesStatus status={quotation.status} /></td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  <Button size="icon-sm" variant="outline" onClick={() => navigate(`/sales/quotations/${quotation.id}`)}><Eye className="h-3.5 w-3.5" /></Button>
                  <Button size="icon-sm" variant="outline" onClick={() => duplicateSalesQuotation(quotation.id)}><Copy className="h-3.5 w-3.5" /></Button>
                  <Button size="icon-sm" variant="outline" onClick={() => changeSalesQuotationStatus(quotation.id, 'Sent')}><Send className="h-3.5 w-3.5" /></Button>
                  <Button size="sm" variant="outline" onClick={() => changeSalesQuotationStatus(quotation.id, 'Accepted')}>Accept</Button>
                  <Button size="sm" variant="outline" onClick={() => changeSalesQuotationStatus(quotation.id, 'Rejected')}>Reject</Button>
                  <Button size="sm" onClick={() => convertQuotationToSalesOrder(quotation.id)}>Convert</Button>
                </div>
              </td>
            </tr>
          );
        })}
      </DataTable>
    </div>
  );
};

export const SalesQuotationFormPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { customers, users, salesProducts, salesQuotations, createSalesQuotation, updateSalesQuotation } = useTenantData();
  const existing = salesQuotations.find((item) => item.id === id);
  const firstProduct = salesProducts[0];
  const [form, setForm] = useState({
    customerId: existing?.customerId || customers[0]?.id || '',
    customerName: existing?.customerName || customers[0]?.company || '',
    date: existing?.date || '2026-06-17',
    expiryDate: existing?.expiryDate || '2026-06-30',
    salesperson: existing?.salesperson || users[1]?.name || 'Anita Das',
    terms: existing?.terms || '50% advance, balance on delivery. Quote valid until expiry date.',
    notes: existing?.notes || '',
    status: existing?.status || 'Draft' as SalesQuotationStatus,
  });
  const [items, setItems] = useState<SalesQuotationItem[]>(existing?.items || [{
    id: `SQI-${Date.now()}`,
    productId: firstProduct?.id || '',
    productName: firstProduct?.name || '',
    quantity: 1,
    unitPrice: firstProduct?.price || 0,
    discount: 0,
    gstRate: firstProduct?.gstRate || 18,
  }]);
  const amount = totals(items);

  const setProduct = (index: number, productId: string) => {
    const product = salesProducts.find((item) => item.id === productId);
    setItems((current) => current.map((item, itemIndex) => itemIndex === index && product ? { ...item, productId, productName: product.name, unitPrice: product.price, gstRate: product.gstRate } : item));
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const payload = { ...form, items };
    if (existing) {
      updateSalesQuotation(existing.id, payload);
      navigate(`/sales/quotations/${existing.id}`);
      return;
    }
    const newId = createSalesQuotation(payload);
    navigate(`/sales/quotations/${newId}`);
  };

  return (
    <div>
      <PageHeader title={existing ? 'Edit Quotation' : 'Create Quotation'} description="GST totals calculate locally from quotation line items." />
      <form onSubmit={submit} className="space-y-5">
        <Panel title="Customer details">
          <Select label="Customer" value={form.customerId} options={customers.map((customer) => [customer.id, customer.company])} onChange={(value) => {
            const customer = customers.find((item) => item.id === value);
            setForm((current) => ({ ...current, customerId: value, customerName: customer?.company || current.customerName }));
          }} />
          <Field label="Quotation date" value={form.date} type="date" onChange={(value) => setForm((current) => ({ ...current, date: value }))} />
          <Field label="Expiry date" value={form.expiryDate} type="date" onChange={(value) => setForm((current) => ({ ...current, expiryDate: value }))} />
          <Select label="Salesperson" value={form.salesperson} options={users.map((user) => [user.name, user.name])} onChange={(value) => setForm((current) => ({ ...current, salesperson: value }))} />
        </Panel>

        <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-semibold text-slate-950">Quotation items</h2>
            <Button type="button" variant="outline" size="sm" onClick={() => setItems((current) => [...current, { ...items[0], id: `SQI-${Date.now()}`, quantity: 1, discount: 0 }])}>Add item</Button>
          </div>
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={item.id} className="grid gap-3 rounded-md border border-slate-100 bg-slate-50 p-3 xl:grid-cols-[1.4fr_repeat(5,1fr)]">
                <Select label="Product/service" value={item.productId} options={salesProducts.map((product) => [product.id, product.name])} onChange={(value) => setProduct(index, value)} />
                <Field label="Quantity" value={String(item.quantity)} type="number" onChange={(value) => setItems((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, quantity: Number(value) } : row))} />
                <Field label="Unit price" value={String(item.unitPrice)} type="number" onChange={(value) => setItems((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, unitPrice: Number(value) } : row))} />
                <Field label="Discount" value={String(item.discount)} type="number" onChange={(value) => setItems((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, discount: Number(value) } : row))} />
                <Field label="GST %" value={String(item.gstRate)} type="number" onChange={(value) => setItems((current) => current.map((row, rowIndex) => rowIndex === index ? { ...row, gstRate: Number(value) } : row))} />
                <div className="text-sm">
                  <span className="text-xs font-medium text-slate-500">Line total</span>
                  <p className="mt-2 font-semibold text-slate-950">{formatINR(totals([item]).total)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-3 text-sm md:grid-cols-3">
            <Total label="Subtotal" value={amount.subtotal} />
            <Total label="Tax amount" value={amount.tax} />
            <Total label="Grand total" value={amount.total} strong />
          </div>
        </section>

        <Panel title="Terms, notes and attachments">
          <TextArea label="Terms and conditions" value={form.terms} onChange={(value) => setForm((current) => ({ ...current, terms: value }))} />
          <TextArea label="Notes" value={form.notes} onChange={(value) => setForm((current) => ({ ...current, notes: value }))} />
          <div className="rounded-md border border-dashed border-slate-300 p-4 text-sm text-slate-500">Attachments placeholder</div>
        </Panel>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate('/sales/quotations')}>Cancel</Button>
          <Button type="submit">{existing ? 'Save quotation' : 'Create quotation'}</Button>
        </div>
      </form>
    </div>
  );
};

export const SalesQuotationPreviewPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { company, salesQuotations, changeSalesQuotationStatus, convertQuotationToSalesOrder } = useTenantData();
  const quotation = salesQuotations.find((item) => item.id === id);
  if (!quotation) return <EmptyState title="Quotation not found" description="Create a quotation to preview it here." />;
  const amount = totals(quotation.items);
  return (
    <div>
      <PageHeader title={quotation.number} description={`${quotation.customerName} · ${quotation.status}`} action={<div className="flex gap-2"><Button variant="outline" onClick={() => navigate(`/sales/quotations/${quotation.id}/edit`)}>Edit</Button><Button onClick={() => convertQuotationToSalesOrder(quotation.id)}>Convert to order</Button></div>} />
      <section className="mx-auto max-w-4xl rounded-md border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-start justify-between gap-6 border-b pb-6">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">{company.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{company.city}, {company.state} · GST {company.gstNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Quotation</p>
            <p className="text-xl font-semibold text-slate-950">{quotation.number}</p>
            <SalesStatus status={quotation.status} />
          </div>
        </div>
        <div className="grid gap-4 py-6 md:grid-cols-2">
          <Info label="Customer" value={quotation.customerName} />
          <Info label="Salesperson" value={quotation.salesperson} />
          <Info label="Date" value={quotation.date} />
          <Info label="Expiry" value={quotation.expiryDate} />
        </div>
        <DataTable headers={['Item', 'Qty', 'Rate', 'Discount', 'GST', 'Total']}>
          {quotation.items.map((item) => <tr key={item.id}><td className="px-4 py-3">{item.productName}</td><td className="px-4 py-3">{item.quantity}</td><td className="px-4 py-3">{formatINR(item.unitPrice)}</td><td className="px-4 py-3">{formatINR(item.discount)}</td><td className="px-4 py-3">{item.gstRate}%</td><td className="px-4 py-3 font-semibold">{formatINR(totals([item]).total)}</td></tr>)}
        </DataTable>
        <div className="ml-auto mt-5 max-w-sm space-y-2">
          <Total label="Subtotal" value={amount.subtotal} />
          <Total label="Tax" value={amount.tax} />
          <Total label="Grand total" value={amount.total} strong />
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {quotationStatuses.map((status) => <Button key={status} size="sm" variant="outline" onClick={() => changeSalesQuotationStatus(quotation.id, status)}>{status}</Button>)}
        </div>
      </section>
    </div>
  );
};

export const SalesOrdersPage: React.FC = () => {
  const { salesOrders } = useTenantData();
  return <ModuleTable title="Sales Orders" description="Orders converted from quotations." headers={['Order', 'Customer', 'Quotation', 'Order date', 'Delivery', 'Amount', 'Status']} rows={salesOrders.map((order) => [order.orderNumber, order.customerName, order.quotationNumber, order.orderDate, order.deliveryDate, formatINR(order.amount), order.status])} />;
};

export const SalesProductsPage: React.FC = () => {
  const { salesProducts } = useTenantData();
  return <ModuleTable title="Products/Services" description="Sellable products and services used in quotations." headers={['Name', 'Type', 'SKU', 'Category', 'Unit', 'Price', 'GST', 'Status']} rows={salesProducts.map((product) => [product.name, product.type, product.sku || '-', product.category, product.unit, formatINR(product.price), `${product.gstRate}%`, product.status])} />;
};

export const SalesSubscriptionsPage: React.FC = () => {
  const { customers, salesSubscriptions, createSalesSubscription } = useTenantData();
  return (
    <div>
      <PageHeader title="Subscriptions" description="Recurring plans, renewal dates, billing cycles, and local demo creation." action={<Button onClick={() => createSalesSubscription({ customerName: customers[0]?.company || 'Demo Customer', planName: 'Monthly Support Plan', startDate: '2026-06-17', renewalDate: '2026-07-17', billingCycle: 'Monthly', amount: 12000, status: 'Trial' })}>Create subscription demo</Button>} />
      <DataTable headers={['Subscription', 'Customer', 'Plan/service', 'Start', 'Renewal', 'Cycle', 'Amount', 'Status']}>
        {salesSubscriptions.map((item) => <tr key={item.id}><td className="px-4 py-3 font-medium">{item.subscriptionNumber}</td><td className="px-4 py-3">{item.customerName}</td><td className="px-4 py-3">{item.planName}</td><td className="px-4 py-3">{item.startDate}</td><td className="px-4 py-3">{item.renewalDate}</td><td className="px-4 py-3">{item.billingCycle}</td><td className="px-4 py-3">{formatINR(item.amount)}</td><td className="px-4 py-3"><Badge>{item.status}</Badge></td></tr>)}
      </DataTable>
      <div className="mt-5 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="font-semibold text-slate-950">Subscription detail tabs placeholder</h2>
        <p className="mt-2 text-sm text-slate-500">Overview, billing schedule, invoices placeholder, customer notes, and activity timeline will expand here.</p>
      </div>
    </div>
  );
};

export const SalesReportsPage: React.FC = () => {
  const { salesQuotations, salesOrders, salesSubscriptions } = useTenantData();
  return (
    <div>
      <PageHeader title="Sales Reports" description="Quotation conversion, orders, renewals, salesperson, and product/service sales." />
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Quotation conversion" value={`${Math.round((salesQuotations.filter((item) => item.status === 'Accepted' || item.status === 'Converted to Order').length / Math.max(1, salesQuotations.length)) * 100)}%`} />
        <StatCard label="Sales order value" value={formatINR(salesOrders.reduce((sum, item) => sum + item.amount, 0))} />
        <StatCard label="Renewal value" value={formatINR(salesSubscriptions.reduce((sum, item) => sum + item.amount, 0))} />
      </section>
      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <SalesSummary title="Salesperson performance" items={countBy(salesQuotations.map((item) => item.salesperson))} />
        <SalesSummary title="Quotation statuses" items={countBy(salesQuotations.map((item) => item.status))} />
      </div>
    </div>
  );
};

export const SalesSettingsPage: React.FC = () => (
  <div>
    <PageHeader title="Sales Settings" description="Demo settings for quotation numbering, GST defaults, terms, and subscription billing cycles." />
    <section className="grid gap-4 md:grid-cols-2">
      {['Quotation prefix: QT-2026', 'Default GST: 18%', 'Default terms: 50% advance', 'Subscription cycles: Monthly, Quarterly, Yearly'].map((item) => <div key={item} className="rounded-md border border-slate-200 bg-white p-4 shadow-sm text-sm text-slate-700">{item}</div>)}
    </section>
  </div>
);

const ModuleTable: React.FC<{ title: string; description: string; headers: string[]; rows: string[][] }> = ({ title, description, headers, rows }) => (
  <div>
    <PageHeader title={title} description={description} />
    <DataTable headers={headers}>{rows.map((row, index) => <tr key={index}>{row.map((cell, cellIndex) => <td key={cellIndex} className="px-4 py-3 text-slate-700">{cell}</td>)}</tr>)}</DataTable>
  </div>
);

const Panel: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"><h2 className="mb-4 font-semibold text-slate-950">{title}</h2><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{children}</div></section>;

const Field: React.FC<{ label: string; value: string; onChange: (value: string) => void; type?: string }> = ({ label, value, onChange, type = 'text' }) => <label className="grid gap-1.5"><span className="text-sm font-medium text-slate-700">{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" /></label>;

const TextArea: React.FC<{ label: string; value: string; onChange: (value: string) => void }> = ({ label, value, onChange }) => <label className="grid gap-1.5 xl:col-span-2"><span className="text-sm font-medium text-slate-700">{label}</span><textarea value={value} onChange={(event) => onChange(event.target.value)} className="min-h-24 rounded-md border border-slate-200 p-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" /></label>;

const Select: React.FC<{ label: string; value: string; options: Array<[string, string]>; onChange: (value: string) => void }> = ({ label, value, options, onChange }) => <label className="grid gap-1.5"><span className="text-sm font-medium text-slate-700">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 rounded-md border border-slate-200 px-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100">{options.map(([optionValue, labelText]) => <option key={optionValue} value={optionValue}>{labelText}</option>)}</select></label>;

const Total: React.FC<{ label: string; value: number; strong?: boolean }> = ({ label, value, strong }) => <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2"><span className="text-slate-500">{label}</span><span className={strong ? 'text-lg font-semibold text-slate-950' : 'font-medium text-slate-800'}>{formatINR(value)}</span></div>;

const Info: React.FC<{ label: string; value: string }> = ({ label, value }) => <div className="rounded-md border border-slate-100 bg-slate-50 p-3"><p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p><p className="mt-1 text-sm font-medium text-slate-900">{value}</p></div>;

const SalesStatus: React.FC<{ status: SalesQuotationStatus }> = ({ status }) => <Badge className={status === 'Accepted' || status === 'Converted to Order' ? 'bg-emerald-50 text-emerald-700' : status === 'Rejected' || status === 'Expired' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}>{status}</Badge>;

const countBy = (items: string[]) => Object.entries(items.reduce<Record<string, number>>((acc, item) => { acc[item] = (acc[item] || 0) + 1; return acc; }, {})).sort((a, b) => b[1] - a[1]);

const SalesSummary: React.FC<{ title: string; items: Array<[string, number]> }> = ({ title, items }) => {
  const max = Math.max(...items.map((item) => item[1]), 1);
  return <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm"><h2 className="font-semibold text-slate-950">{title}</h2><div className="mt-4 space-y-3">{items.map(([label, count]) => <div key={label}><div className="flex items-center justify-between text-sm"><span className="font-medium text-slate-700">{label}</span><span className="text-slate-500">{count}</span></div><div className="mt-1 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-indigo-600" style={{ width: `${(count / max) * 100}%` }} /></div></div>)}</div></div>;
};
