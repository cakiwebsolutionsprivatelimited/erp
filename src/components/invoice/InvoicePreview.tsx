import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

export const InvoicePreview: React.FC = () => {
  return (
    <Card className="w-full max-w-3xl border shadow-lg bg-white text-slate-900">
      <CardHeader className="p-8">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">E</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Enterprise SaaS</h1>
            <p className="text-sm text-slate-500">123 Tech Street, Suite 500<br />San Francisco, CA 94103</p>
          </div>
          <div className="text-right space-y-1">
            <h2 className="text-3xl font-black uppercase text-slate-200">Invoice</h2>
            <p className="text-sm font-semibold">#INV-2024-001</p>
            <p className="text-sm text-slate-500">Issued: May 16, 2024</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-8 pt-0 space-y-8">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Billed To</p>
            <p className="font-bold">Acme Corporation</p>
            <p className="text-sm text-slate-500">Attn: Finance Department<br />456 Industry Way<br />New York, NY 10001</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Payment Details</p>
            <p className="font-bold">Wire Transfer</p>
            <p className="text-sm text-slate-500">SWIFT: ENTUSA33<br />Account: ****9876</p>
          </div>
        </div>

        <div className="border rounded-xl overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="text-slate-900">Description</TableHead>
                <TableHead className="text-center text-slate-900">Qty</TableHead>
                <TableHead className="text-right text-slate-900">Price</TableHead>
                <TableHead className="text-right text-slate-900">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Pro Subscription (Annual)</TableCell>
                <TableCell className="text-center">1</TableCell>
                <TableCell className="text-right">$499.00</TableCell>
                <TableCell className="text-right font-bold">$499.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Additional API Calls (per 10k)</TableCell>
                <TableCell className="text-center">5</TableCell>
                <TableCell className="text-right">$20.00</TableCell>
                <TableCell className="text-right font-bold">$100.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Priority Implementation Support</TableCell>
                <TableCell className="text-center">1</TableCell>
                <TableCell className="text-right">$250.00</TableCell>
                <TableCell className="text-right font-bold">$250.00</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end pt-4">
          <div className="w-full max-w-[200px] space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-medium">$849.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Tax (0%)</span>
              <span className="font-medium">$0.00</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between items-center">
              <span className="font-bold">Total Amount</span>
              <span className="text-xl font-black text-primary">$849.00</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t text-center space-y-2">
          <p className="text-sm font-bold">Thank you for your business!</p>
          <p className="text-xs text-slate-400">Questions? Email us at billing@enterprise-saas.com</p>
        </div>
      </CardContent>
    </Card>
  );
};
