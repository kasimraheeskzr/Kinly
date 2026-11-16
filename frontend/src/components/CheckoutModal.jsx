import React, { useState } from 'react';
import { 
  X, 
  Check, 
  CreditCard, 
  Lock, 
  Sparkles, 
  ShieldCheck, 
  Loader2,
  CheckCircle2,
  Tag,
  Download
} from 'lucide-react';

export default function CheckoutModal({ isOpen, onClose, onCompletePayment, currentPlan }) {
  const [selectedPlan, setSelectedPlan] = useState('Kinly Family Plus');
  const [billingCycle, setBillingCycle] = useState('Monthly'); // 'Monthly' or 'Annual'
  const [paymentType, setPaymentType] = useState('card'); // 'card', 'apple', 'paypal'
  
  // Card Inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('Sarah Miller');
  
  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);

  if (!isOpen) return null;

  // Pricing calculations
  const basePrice = selectedPlan === 'Kinly Complete All-in-One'
    ? (billingCycle === 'Monthly' ? 19.99 : 179.00)
    : (billingCycle === 'Monthly' ? 9.99 : 89.00);

  const discountAmount = Number(((basePrice * discountPercent) / 100).toFixed(2));
  const finalPrice = Number((basePrice - discountAmount).toFixed(2));

  // Format Card Number (XXXX XXXX XXXX XXXX)
  const handleCardNumberChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').substring(0, 16);
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 2) {
      val = val.substring(0, 2) + '/' + val.substring(2);
    }
    setCardExpiry(val);
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'KINLY20' || code === 'FAMILY20') {
      setDiscountPercent(20);
      setCouponMessage('20% Family Discount applied!');
    } else if (code === 'SAVE50') {
      setDiscountPercent(50);
      setCouponMessage('50% Special Holiday Discount applied!');
    } else {
      setDiscountPercent(0);
      setCouponMessage('Invalid coupon code. Try KINLY20');
    }
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate real payment gateway delay (1.5s)
    await new Promise(r => setTimeout(r, 1400));

    const orderData = {
      planName: selectedPlan,
      billingCycle,
      amount: finalPrice,
      paymentMethod: {
        brand: paymentType === 'apple' ? 'Apple Pay' : paymentType === 'paypal' ? 'PayPal' : 'Visa',
        last4: cardNumber.replace(/\s/g, '').slice(-4) || '4242',
        expiry: cardExpiry || '12/28'
      }
    };

    const res = await onCompletePayment(orderData);
    setIsProcessing(false);
    setIsSuccess(true);
    setLastOrder(res?.order || {
      id: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      amount: finalPrice,
      plan: `${selectedPlan} (${billingCycle})`
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[28px] max-w-xl w-full border border-[#E7EBE5] shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-[#E7EBE5] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#EDF4EE] flex items-center justify-center text-[#39765C]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#21352D]">
                {isSuccess ? 'Payment Successful!' : 'Secure Family Subscription Checkout'}
              </h3>
              <p className="text-xs text-[#748078]">256-bit encrypted end-to-end checkout</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-[#748078] hover:text-[#21352D] hover:bg-[#F6F7F5] rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {isSuccess ? (
            /* Success confirmation screen */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#EDF3E8] text-[#71874D] flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-xl font-extrabold text-[#21352D]">
                  Welcome to {selectedPlan}!
                </h4>
                <p className="text-xs text-[#748078] mt-1">
                  Your payment of <strong className="text-[#39765C]">${finalPrice}</strong> has been confirmed.
                </p>
              </div>

              <div className="p-4 bg-[#F6F7F5] rounded-2xl border border-[#E7EBE5] text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#748078]">Order ID:</span>
                  <span className="font-mono font-bold text-[#21352D]">{lastOrder?.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#748078]">Plan:</span>
                  <span className="font-semibold text-[#21352D]">{selectedPlan} ({billingCycle})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#748078]">Status:</span>
                  <span className="font-bold text-[#71874D]">Active & Ready</span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-[#39765C] hover:bg-[#2e614c] text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmitPayment} className="space-y-6">
              
              {/* Step 1: Select Plan */}
              <div>
                <label className="block text-xs font-bold text-[#748078] uppercase tracking-wider mb-2">
                  1. Choose Plan & Billing Interval
                </label>
                
                {/* Interval Toggle */}
                <div className="flex items-center justify-center bg-[#EDEFE9] p-1 rounded-xl mb-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('Monthly')}
                    className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                      billingCycle === 'Monthly' ? 'bg-white text-[#21352D] shadow-xs' : 'text-[#748078]'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('Annual')}
                    className={`flex-1 py-1.5 rounded-lg font-bold transition-all flex items-center justify-center space-x-1.5 ${
                      billingCycle === 'Annual' ? 'bg-white text-[#21352D] shadow-xs' : 'text-[#748078]'
                    }`}
                  >
                    <span>Annual</span>
                    <span className="text-[10px] bg-[#EDF4EE] text-[#39765C] px-1.5 py-0.2 rounded-md">Save 25%</span>
                  </button>
                </div>

                {/* Plan Options */}
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setSelectedPlan('Kinly Family Plus')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      selectedPlan === 'Kinly Family Plus'
                        ? 'border-[#39765C] bg-[#EDF4EE]/50 ring-2 ring-[#39765C]/20'
                        : 'border-[#E7EBE5] bg-white hover:bg-[#F6F7F5]'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-[#21352D]">Family Plus</span>
                      <input 
                        type="radio" 
                        name="plan" 
                        checked={selectedPlan === 'Kinly Family Plus'} 
                        onChange={() => setSelectedPlan('Kinly Family Plus')}
                        className="text-[#39765C] focus:ring-[#39765C]"
                      />
                    </div>
                    <p className="text-lg font-extrabold text-[#21352D] mt-2">
                      {billingCycle === 'Monthly' ? '$9.99' : '$89.00'}
                      <span className="text-[10px] font-normal text-[#748078]">/{billingCycle === 'Monthly' ? 'mo' : 'yr'}</span>
                    </p>
                  </div>

                  <div
                    onClick={() => setSelectedPlan('Kinly Complete All-in-One')}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      selectedPlan === 'Kinly Complete All-in-One'
                        ? 'border-[#39765C] bg-[#EDF4EE]/50 ring-2 ring-[#39765C]/20'
                        : 'border-[#E7EBE5] bg-white hover:bg-[#F6F7F5]'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-[#21352D]">All-in-One Complete</span>
                      <input 
                        type="radio" 
                        name="plan" 
                        checked={selectedPlan === 'Kinly Complete All-in-One'} 
                        onChange={() => setSelectedPlan('Kinly Complete All-in-One')}
                        className="text-[#39765C] focus:ring-[#39765C]"
                      />
                    </div>
                    <p className="text-lg font-extrabold text-[#21352D] mt-2">
                      {billingCycle === 'Monthly' ? '$19.99' : '$179.00'}
                      <span className="text-[10px] font-normal text-[#748078]">/{billingCycle === 'Monthly' ? 'mo' : 'yr'}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2: Payment Method */}
              <div>
                <label className="block text-xs font-bold text-[#748078] uppercase tracking-wider mb-2">
                  2. Payment Method
                </label>

                {/* Method selector */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setPaymentType('card')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                      paymentType === 'card' 
                        ? 'border-[#39765C] bg-[#EDF4EE] text-[#39765C]' 
                        : 'border-[#E7EBE5] text-[#748078] hover:bg-[#F6F7F5]'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Credit Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentType('apple')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                      paymentType === 'apple' 
                        ? 'border-[#39765C] bg-[#EDF4EE] text-[#39765C]' 
                        : 'border-[#E7EBE5] text-[#748078] hover:bg-[#F6F7F5]'
                    }`}
                  >
                    <span>Apple Pay</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentType('paypal')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                      paymentType === 'paypal' 
                        ? 'border-[#39765C] bg-[#EDF4EE] text-[#39765C]' 
                        : 'border-[#E7EBE5] text-[#748078] hover:bg-[#F6F7F5]'
                    }`}
                  >
                    <span>PayPal</span>
                  </button>
                </div>

                {/* Card Fields */}
                {paymentType === 'card' && (
                  <div className="space-y-3 bg-[#F6F7F5] p-4 rounded-2xl border border-[#E7EBE5]">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#748078] mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        required
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Sarah Miller"
                        className="w-full px-3 py-2 text-xs bg-white border border-[#E7EBE5] rounded-xl outline-none focus:border-[#39765C] text-[#21352D]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-[#748078] mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="4242 4242 4242 4242"
                        className="w-full px-3 py-2 text-xs font-mono bg-white border border-[#E7EBE5] rounded-xl outline-none focus:border-[#39765C] text-[#21352D]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#748078] mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          required
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 text-xs font-mono bg-white border border-[#E7EBE5] rounded-xl outline-none focus:border-[#39765C] text-[#21352D]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#748078] mb-1">
                          Security CVC
                        </label>
                        <input
                          type="password"
                          required
                          maxLength={4}
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                          placeholder="•••"
                          className="w-full px-3 py-2 text-xs font-mono bg-white border border-[#E7EBE5] rounded-xl outline-none focus:border-[#39765C] text-[#21352D]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 3: Coupon Code */}
              <div>
                <label className="block text-xs font-bold text-[#748078] uppercase tracking-wider mb-2">
                  3. Promo / Family Coupon Code
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#748078]" />
                    <input
                      type="text"
                      placeholder="e.g. KINLY20"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs font-mono uppercase bg-[#F6F7F5] border border-[#E7EBE5] rounded-xl outline-none focus:border-[#39765C] text-[#21352D]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-[#F6F7F5] hover:bg-[#E7EBE5] text-[#21352D] font-bold text-xs rounded-xl border border-[#E7EBE5] transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponMessage && (
                  <p className={`text-[11px] mt-1 font-semibold ${discountPercent > 0 ? 'text-[#71874D]' : 'text-[#BD725E]'}`}>
                    {couponMessage}
                  </p>
                )}
              </div>

              {/* Step 4: Summary Breakdown */}
              <div className="p-4 bg-[#EDF4EE]/60 rounded-2xl border border-[#D5E4D8] space-y-2 text-xs">
                <div className="flex justify-between text-[#748078]">
                  <span>Subtotal ({billingCycle}):</span>
                  <span>${basePrice.toFixed(2)}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-[#71874D] font-bold">
                    <span>Discount ({discountPercent}% off):</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#748078]">
                  <span>Estimated Tax:</span>
                  <span>$0.00</span>
                </div>
                <div className="pt-2 border-t border-[#D5E4D8] flex justify-between items-baseline font-bold text-sm text-[#21352D]">
                  <span>Total Due Today:</span>
                  <span className="text-lg text-[#39765C] font-extrabold">${finalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 bg-[#39765C] hover:bg-[#2e614c] text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-75"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Processing Secure Payment...</span>
                  </>
                ) : (
                  <span>Confirm & Activate Subscription (${finalPrice})</span>
                )}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
