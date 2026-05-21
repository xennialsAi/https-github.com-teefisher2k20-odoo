import React, { useState, useRef } from 'react';
import { FileText, Coins, Landmark, Calendar, Printer, ShieldCheck, CheckCircle } from 'lucide-react';
import { AccountInvoice, ResPartner, ProductProduct } from '../types';
import { cn, formatCurrency, formatDate } from '../utils';

interface InvoicesAppProps {
  invoices: AccountInvoice[];
  partners: ResPartner[];
  products: ProductProduct[];
  setInvoices: React.Dispatch<React.SetStateAction<AccountInvoice[]>>;
}

export default function InvoicesApp({ invoices, partners, products, setInvoices }: InvoicesAppProps) {
  const [activeInvoice, setActiveInvoice] = useState<AccountInvoice | null>(null);
  const [showPdf, setShowPdf] = useState<AccountInvoice | null>(null);

  // Workflow Action: Register Payment (Draft/Posted -> Paid)
  const handleRegisterPayment = (invoice: AccountInvoice) => {
    const updated: AccountInvoice = { ...invoice, payment_state: 'paid', state: 'posted' };
    setInvoices((prev) => prev.map((inv) => (inv.id === invoice.id ? updated : inv)));
    if (activeInvoice?.id === invoice.id) {
      setActiveInvoice(updated);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0B0D10] overflow-hidden" id="odoo-invoices-subsystem">
      {/* Invoice Actions Header */}
      <div className="bg-[#111419] p-4 border-b border-[#252A33] flex justify-between items-center shrink-0">
        <div>
          <div className="text-xs text-[#8E95A3] font-semibold tracking-wider uppercase font-mono">Invoicing Ledger</div>
          <h2 className="text-lg font-bold text-white uppercase tracking-wide">Customer Invoices</h2>
        </div>
        <div className="flex items-center gap-3 bg-[#1C2129] px-4 py-2 rounded-lg border border-[#252A33]">
          <Coins className="h-4 w-4 text-indigo-400" />
          <span className="text-xs font-semibold text-[#8E95A3]">Accounts Receivable:</span>
          <span className="text-sm font-black text-indigo-400 font-mono">
            {formatCurrency(
              invoices
                .filter((inv) => inv.payment_state !== 'paid')
                .reduce((sum, inv) => sum + inv.amount_total, 0)
            )}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 flex gap-4">
        {/* Invoices List Table */}
        <div className="flex-1 bg-[#14171D] rounded-xl border border-[#252A33] overflow-hidden flex flex-col">
          <div className="p-3 bg-[#111419] border-b border-[#252A33] flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-[#8E95A3] tracking-widest font-mono">Accounting Book</span>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Paid ledger: {invoices.filter((inv) => inv.payment_state === 'paid').length} / {invoices.length}
            </span>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#252A33] text-[10px] font-bold uppercase text-[#8E95A3] bg-[#111419]/50">
                <th className="p-3 font-mono">Invoice Number</th>
                <th className="p-3">Invoice Date</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Total Due</th>
                <th className="p-3">Payment Status</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-[#252A33]">
              {invoices.map((inv) => {
                const partner = partners.find((p) => p.id === inv.partner_id);
                return (
                  <tr
                    key={inv.id}
                    onClick={() => setActiveInvoice(inv)}
                    className={cn(
                      "hover:bg-[#1C2129]/60 cursor-pointer transition-colors duration-150",
                      activeInvoice?.id === inv.id ? "bg-[#161920] font-semibold border-l-4 border-l-indigo-500" : ""
                    )}
                  >
                    <td className="p-3 text-indigo-400 font-bold font-mono">{inv.name}</td>
                    <td className="p-3 text-[#8E95A3]">{formatDate(inv.invoice_date)}</td>
                    <td className="p-3 text-white font-medium">{partner?.name || 'Walk-in Partner'}</td>
                    <td className="p-3 text-white font-semibold font-mono">{formatCurrency(inv.amount_total)}</td>
                    <td className="p-3">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border",
                          inv.payment_state === 'paid'
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        )}
                      >
                        {inv.payment_state === 'paid' ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Selected Invoice Details Sidebar */}
        {activeInvoice && (
          <div className="w-96 bg-[#14171D] rounded-xl border border-[#252A33] flex flex-col overflow-hidden">
            <div className="p-4 bg-[#111419] border-b border-[#252A33]">
              <span className="text-[10px] font-bold text-[#8E95A3] uppercase tracking-widest block font-mono">
                Invoice Ledger Sheet
              </span>
              <div className="flex justify-between items-center mt-1">
                <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-indigo-400" />
                  {activeInvoice.name}
                </h3>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded text-[10px] uppercase font-bold border",
                    activeInvoice.payment_state === 'paid' 
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                      : "bg-red-500/10 text-red-400 border-red-500/20"
                  )}
                >
                  {activeInvoice.payment_state === 'paid' ? 'Paid' : 'Unpaid'}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Partner Overview */}
              <div>
                <label className="text-[9px] font-bold text-[#8E95A3] uppercase font-mono tracking-wider">Customer Billing</label>
                <div className="text-xs text-white font-extrabold mt-1">
                  {partners.find((p) => p.id === activeInvoice.partner_id)?.name || 'Direct Billing Customer'}
                </div>
              </div>

              {/* Invoice Lines */}
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-[#8E95A3] uppercase font-mono tracking-wider">Billed Items ({activeInvoice.invoice_line.length})</label>
                <div className="border border-[#252A33] rounded-lg divide-y divide-[#252A33] overflow-hidden">
                  {activeInvoice.invoice_line.map((line) => {
                    const prod = products.find((p) => p.id === line.product_id);
                    return (
                      <div key={line.id} className="p-2.5 flex justify-between items-center bg-[#111419]/30">
                        <div>
                          <div className="text-xs font-semibold text-white truncate max-w-[150px]">{prod?.name || 'Deleted Product'}</div>
                          <div className="text-[10px] text-[#8E95A3] font-mono mt-0.5">
                            {line.product_uom_qty} x {formatCurrency(line.price_unit)}
                          </div>
                        </div>
                        <div className="text-xs font-bold text-white font-mono">{formatCurrency(line.price_subtotal)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Subtotals */}
              <div className="space-y-1.5 pt-3 border-t border-[#252A33] text-xs">
                <div className="flex justify-between text-[#8E95A3]">
                  <span>Subtotal Amount:</span>
                  <span className="font-mono">{formatCurrency(activeInvoice.amount_untaxed)}</span>
                </div>
                <div className="flex justify-between text-[#8E95A3]">
                  <span>VAT Estimate (15%):</span>
                  <span className="font-mono">{formatCurrency(activeInvoice.amount_tax)}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-sm pt-1 border-t border-dashed border-[#252A33]">
                  <span>Balance Due:</span>
                  <span className="text-indigo-400 font-mono">{formatCurrency(activeInvoice.amount_total)}</span>
                </div>
              </div>

              {/* Status Checks */}
              {activeInvoice.payment_state === 'paid' && (
                <div className="p-3 bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold rounded border border-emerald-500/20 flex gap-2">
                  <ShieldCheck className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                  <span>Paid fully on {formatDate(activeInvoice.invoice_date)}. Thank you for utilizing Odoo Community Billing.</span>
                </div>
              )}
            </div>

            {/* Invoicing Workflow control buttons */}
            <div className="p-3 bg-[#111419] border-t border-[#252A33] flex gap-2">
              {activeInvoice.payment_state !== 'paid' ? (
                <button
                  onClick={() => handleRegisterPayment(activeInvoice)}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-indigo-700 transition"
                >
                  <Coins className="h-3.5 w-3.5" />
                  Register Payment
                </button>
              ) : (
                <button
                  onClick={() => setShowPdf(activeInvoice)}
                  className="flex-1 bg-[#252A33] border border-[#252A33] text-white py-2 rounded text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#2D333E] transition"
                >
                  <Printer className="h-3.5 w-3.5 text-indigo-400" />
                  Print Receipt
                </button>
              )}
              <button
                onClick={() => setActiveInvoice(null)}
                className="bg-[#252A33] text-[#E0E2E6] px-4 py-2 rounded text-xs hover:bg-[#2D333E] font-bold"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DETAILED HIGH-FIDELITY INVOICE PDF DIALOG */}
      {showPdf && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6 overflow-y-auto backdrop-blur-sm">
          <div className="bg-[#14171D] rounded-xl shadow-2xl w-full max-w-2xl flex flex-col border border-[#252A33]">
            {/* Header controls toolbar */}
            <div className="p-3 bg-[#111419] border-b border-[#252A33] flex justify-between items-center text-white">
              <span className="text-[10px] font-bold tracking-widest text-[#8E95A3] font-mono uppercase">
                Odoo Invoice Print Engine
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const printSection = document.getElementById('print-area-invoice');
                    if (printSection) {
                      const printContent = printSection.innerHTML;
                      const originalContent = document.body.innerHTML;
                      document.body.innerHTML = printContent;
                      window.print();
                      window.location.reload(); // Quick restore of state
                    }
                  }}
                  className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 font-bold text-xs rounded transition"
                >
                  <Printer className="h-3 w-3" />
                  Generate Invoice PDF
                </button>
                <button
                  onClick={() => setShowPdf(null)}
                  className="bg-[#252A33] hover:bg-[#2D333E] text-[#E0E2E6] px-3 py-1.5 text-xs rounded font-bold transition border border-[#252A33]"
                >
                  ✕ Close Viewer
                </button>
              </div>
            </div>

            {/* Document sheet area */}
            <div className="p-8 bg-[#0B0D10] max-h-[75vh] overflow-y-auto" id="print-area-invoice">
              <div className="border border-[#252A33] rounded-lg p-6 bg-[#14171D] text-white shadow-lg space-y-6">
                {/* Letterhead */}
                <div className="flex justify-between items-start border-b border-[#252A33] pb-5">
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-[#E0E2E6] text-base tracking-wider uppercase">Your Company Inc.</h4>
                    <p className="text-[10px] text-[#8E95A3] font-mono leading-none">250 Executive Parkway</p>
                    <p className="text-[10px] text-[#8E95A3] font-mono leading-none">San Francisco, CA 94105</p>
                    <p className="text-[10px] text-[#8E95A3] font-mono leading-none">United States</p>
                  </div>
                  <div className="text-right">
                    <h3 className="text-lg font-bold text-indigo-400 font-mono tracking-tight">{showPdf.name}</h3>
                    <p className="text-[9px] text-zinc-400 font-mono uppercase mt-1">Invoice Payment Receipt</p>
                  </div>
                </div>

                {/* Bill to metadata */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-[#8E95A3] block font-mono">Invoice Date:</span>
                    <span className="font-semibold text-white">{formatDate(showPdf.invoice_date)}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase font-bold text-[#8E95A3] block font-mono">Bill To Partner:</span>
                    <span className="font-bold text-white">
                      {partners.find((p) => p.id === showPdf.partner_id)?.name || 'Direct Billing User'}
                    </span>
                    <p className="text-[10px] text-[#8E95A3] mt-0.5 font-semibold">
                      {partners.find((p) => p.id === showPdf.partner_id)?.city}, {partners.find((p) => p.id === showPdf.partner_id)?.country}
                    </p>
                  </div>
                </div>

                {/* Lines Ledger */}
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#252A33] text-[9px] uppercase text-[#8E95A3] font-bold bg-[#111419]/50">
                      <th className="p-2.5">Description</th>
                      <th className="p-2.5 text-center">Qty</th>
                      <th className="p-2.5 text-right flex justify-end">Unit Price</th>
                      <th className="p-2.5 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#252A33] p-1">
                    {showPdf.invoice_line.map((line) => {
                      const prod = products.find((p) => p.id === line.product_id);
                      return (
                        <tr key={line.id} className="text-[#E0E2E6]">
                          <td className="p-2.5 font-medium">{prod?.name || 'Deleted Product asset'}</td>
                          <td className="p-2.5 text-center font-mono">{line.product_uom_qty}</td>
                          <td className="p-2.5 text-right font-mono flex justify-end">{formatCurrency(line.price_unit)}</td>
                          <td className="p-2.5 text-right font-bold text-white font-mono">
                            {formatCurrency(line.price_subtotal)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Summary calculation */}
                <div className="flex justify-end pt-3 border-t border-[#252A33]">
                  <div className="w-64 space-y-1.5 text-xs">
                    <div className="flex justify-between text-[#8E95A3]">
                      <span>Subtotal Amount:</span>
                      <span className="font-mono text-white">{formatCurrency(showPdf.amount_untaxed)}</span>
                    </div>
                    <div className="flex justify-between text-[#8E95A3]">
                      <span>Total VAT Tax (15%):</span>
                      <span className="font-mono text-white">{formatCurrency(showPdf.amount_tax)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-white border-t border-[#252A33] pt-1.5">
                      <span>Total Amount Paid:</span>
                      <span className="text-indigo-400 font-mono">{formatCurrency(showPdf.amount_total)}</span>
                    </div>
                  </div>
                </div>

                {/* Sign-off & signature line */}
                <div className="border-t border-dashed border-[#252A33] pt-5 flex justify-between items-center text-xs">
                  <div className="text-[9px] text-[#8E95A3] font-mono">
                    <p>UTC Timestamp: 2026-05-21 19:46:53</p>
                    <p>Payment Mode: Handled via Bank Wire / ERP Registry</p>
                  </div>
                  <div className="text-center">
                    <div className="h-8 border-b border-[#252A33] w-32 mx-auto" />
                    <p className="text-[9px] uppercase font-bold text-[#8E95A3] mt-1 font-mono">Authorized Mitchell Admin</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
