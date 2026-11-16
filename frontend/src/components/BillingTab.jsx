import React from 'react';
import { 
  CreditCard, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Download, 
  Calendar,
  AlertCircle,
  ArrowUpRight
} from 'lucide-react';

export default function BillingTab({ subscription, orders, onOpenCheckout }) {
  const plans = [
    {
      id: 'free',
      name: 'Free Trial',
      price: '$0',
      period: '14 days',
      description: 'Basic screen time limits for 1 device',
      features: ['1 Device Supervised', 'Standard Screen Time Limits', 'Daily Summary Report'],
      isCurrent: false,
      cta: 'Free Tier'
    },
    {
      id: 'plus',
      name: 'Kinly Family Plus',
      price: '$9.99',
      period: 'per month',
      description: 'Full digital wellness protection for the entire household',
      features: [
        'Unlimited Devices & Children',
        'Real-time Phone Companion Sync',
        'AI Web & Content Filtering',
        'Instant Pause Internet & Bedtime',
        'GPS Location Safe-Zone Alerts'
      ],
      popular: true,
      isCurrent: subscription?.currentPlan === 'Kinly Family Plus',
      cta: subscription?.currentPlan === 'Kinly Family Plus' ? 'Current Plan' : 'Select Plan'
    },
    {
      id: 'complete',
      name: 'Kinly Complete All-in-One',
      price: '$19.99',
      period: 'per month',
      description: 'For growing families needing pediatric wellness consultations',
      features: [
        'Everything in Family Plus',
        '1-on-1 Allied Pediatric Consultations',
        'Cyberbullying & Mental Health Alerts',
        'Dedicated 24/7 Family Concierge'
      ],
      isCurrent: subscription?.currentPlan === 'Kinly Complete All-in-One',
      cta: subscription?.currentPlan === 'Kinly Complete All-in-One' ? 'Current Plan' : 'Upgrade to Complete'
    }
  ];

  const handleDownloadInvoice = (order) => {
    // Generate a clean text / receipt file download
    const receiptContent = `=====================================================
                    KINLY FAMILY INC.
             Official Subscription Tax Invoice
=====================================================
Invoice Number: ${order.invoiceNumber}
Order Reference: ${order.id}
Date: ${order.date}
Billed To: Sarah Miller (The Miller Family)
Payment Status: ${order.status.toUpperCase()}
Payment Method: ${order.paymentMethod}

Item Description                             Amount
-----------------------------------------------------
${order.plan.padEnd(45)} $${order.amount.toFixed(2)}
Sales Tax (0.00%)                            $0.00
-----------------------------------------------------
TOTAL AMOUNT PAID:                           $${order.amount.toFixed(2)} USD

Thank you for trusting Kinly to protect your family!
Support: help@kinly.family | kinly.family
=====================================================`;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${order.invoiceNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Current Subscription Card */}
      <div className="bg-white border border-[#E7EBE5] rounded-[22px] p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-[#EDF4EE] flex items-center justify-center text-[#39765C] shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-[#21352D]">
                  {subscription?.currentPlan || 'Kinly Family Plus'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EDF3E8] text-[#71874D]">
                  {subscription?.status || 'Active'}
                </span>
              </div>
              <p className="text-xs text-[#748078] mt-1">
                Billed {subscription?.billingCycle || 'Monthly'} (${subscription?.amount || 9.99}/mo) • Next billing date: <strong>{subscription?.renewalDate || 'Dec 15, 2026'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenCheckout}
              className="px-4 py-2.5 bg-[#39765C] hover:bg-[#2e614c] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              Change / Upgrade Plan
            </button>
          </div>
        </div>

        {/* Payment Method Details */}
        <div className="mt-6 pt-4 border-t border-[#F0F2EE] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <div className="px-3 py-1.5 bg-[#F6F7F5] rounded-lg border border-[#E7EBE5] flex items-center space-x-2 font-mono font-bold text-[#21352D]">
              <CreditCard className="w-4 h-4 text-[#39765C]" />
              <span>{subscription?.paymentMethod?.brand || 'Visa'} •••• {subscription?.paymentMethod?.last4 || '4242'}</span>
            </div>
            <span className="text-[#748078]">Expires {subscription?.paymentMethod?.expiry || '08/28'}</span>
          </div>

          <button 
            onClick={onOpenCheckout}
            className="text-[#39765C] font-semibold hover:underline"
          >
            Update Payment Method
          </button>
        </div>
      </div>

      {/* Plans Comparison */}
      <div>
        <h3 className="text-base font-bold text-[#21352D] mb-4">Choose Your Family Plan</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`
                bg-white rounded-[22px] p-6 border flex flex-col justify-between transition-all relative
                ${p.popular 
                  ? 'border-[#39765C] shadow-md ring-2 ring-[#39765C]/20' 
                  : 'border-[#E7EBE5] shadow-xs'
                }
              `}
            >
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#39765C] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                  Most Popular
                </span>
              )}

              <div>
                <h4 className="text-base font-bold text-[#21352D] mb-1">{p.name}</h4>
                <p className="text-xs text-[#748078] mb-4 min-h-[32px]">{p.description}</p>
                <div className="flex items-baseline space-x-1 mb-6">
                  <span className="text-3xl font-extrabold text-[#21352D]">{p.price}</span>
                  <span className="text-xs text-[#748078]">/{p.period}</span>
                </div>

                <ul className="space-y-2.5 text-xs mb-6">
                  {p.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center space-x-2.5">
                      <Check className="w-4 h-4 text-[#39765C] shrink-0" />
                      <span className="text-[#21352D] font-medium">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                disabled={p.isCurrent}
                onClick={onOpenCheckout}
                className={`
                  w-full py-2.5 rounded-xl text-xs font-bold transition-all
                  ${p.isCurrent 
                    ? 'bg-[#EDF4EE] text-[#39765C] cursor-default' 
                    : p.popular
                      ? 'bg-[#39765C] hover:bg-[#2e614c] text-white shadow-xs'
                      : 'bg-white hover:bg-[#F6F7F5] border border-[#E7EBE5] text-[#21352D]'
                  }
                `}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Past Invoices & Orders */}
      <div className="bg-white border border-[#E7EBE5] rounded-[22px] p-6 shadow-xs">
        <h3 className="text-base font-bold text-[#21352D] mb-1">Billing Invoices & Order History</h3>
        <p className="text-xs text-[#748078] mb-4">Official receipts for family subscriptions</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E7EBE5] text-[#748078] font-semibold">
                <th className="pb-3">Invoice Number</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Plan</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F2EE]">
              {orders?.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#F6F7F5] transition-colors">
                  <td className="py-3 font-mono font-medium text-[#21352D]">{ord.invoiceNumber}</td>
                  <td className="py-3 text-[#748078]">{ord.date}</td>
                  <td className="py-3 font-medium text-[#21352D]">{ord.plan}</td>
                  <td className="py-3 font-bold text-[#21352D]">${ord.amount.toFixed(2)}</td>
                  <td className="py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EDF3E8] text-[#71874D]">
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleDownloadInvoice(ord)}
                      className="inline-flex items-center space-x-1 text-[#39765C] hover:text-[#2e614c] font-semibold"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
