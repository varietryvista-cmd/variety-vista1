'use client';

import * as React from 'react';
import { MapPin, Truck, Check, RefreshCw, ShieldCheck } from 'lucide-react';

export default function PincodeChecker() {
  const [pincode, setPincode] = React.useState('');
  const [result, setResult] = React.useState<{
    city?: string;
    deliveryDate: string;
    codAvailable: boolean;
    isMetro: boolean;
  } | null>(null);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const saved = localStorage.getItem('vv_pincode');
    if (saved && saved.length === 6) {
      setPincode(saved);
      checkPincode(saved);
    }
  }, []);

  const checkPincode = (pin: string) => {
    if (!/^\d{6}$/.test(pin)) {
      setError('Please enter a valid 6-digit Indian PIN code.');
      setResult(null);
      return;
    }

    setError('');
    setLoading(true);

    setTimeout(() => {
      // Estimated delivery calculation (Metros vs Standard)
      const firstDigit = pin[0];
      const isMetro = ['4', '1', '5', '6', '7'].includes(firstDigit); // Mumbai (4), Delhi (1), BLR/HYD (5), Chennai/TN (6), WB (7)
      
      const deliveryDays = isMetro ? 2 : 4;
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + deliveryDays);
      
      const formattedDate = targetDate.toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });

      setResult({
        deliveryDate: formattedDate,
        codAvailable: true,
        isMetro,
      });

      localStorage.setItem('vv_pincode', pin);
      setLoading(false);
    }, 300);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkPincode(pincode);
  };

  return (
    <div className="border border-[rgba(10,10,10,0.08)] bg-[#FAFAF9] p-4 text-xs">
      <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#0A0A0A] mb-3">
        <MapPin className="w-3.5 h-3.5 text-[#B8913A]" />
        <span>Check Delivery & Serviceability</span>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          maxLength={6}
          value={pincode}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, '');
            setPincode(val);
            if (val.length === 6) checkPincode(val);
          }}
          placeholder="Enter 6-digit Pincode"
          className="flex-1 h-10 px-3 bg-white border border-[rgba(10,10,10,0.15)] text-[#0A0A0A] font-mono text-xs focus:outline-none focus:border-[#0A0A0A] placeholder:text-[#8B8680] placeholder:font-sans"
        />
        <button
          type="submit"
          disabled={loading || pincode.length !== 6}
          className="h-10 px-4 bg-[#0A0A0A] text-[#FAFAF9] font-bold uppercase tracking-wider text-[11px] hover:bg-[#B8913A] transition-colors disabled:opacity-40"
        >
          {loading ? 'Checking...' : 'Check'}
        </button>
      </form>

      {error && <p className="text-sale font-medium mt-2">{error}</p>}

      {result && (
        <div className="mt-3.5 pt-3.5 border-t border-[rgba(10,10,10,0.06)] space-y-2 text-[#0A0A0A]">
          <div className="flex items-start gap-2 text-[11px]">
            <Truck className="w-3.5 h-3.5 text-[#25D366] shrink-0 mt-0.5" />
            <span>
              Delivery by <strong>{result.deliveryDate}</strong> ({result.isMetro ? 'Express Metro 2-3 Days' : 'Standard 4-5 Days'})
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#8B8680]">
            <Check className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
            <span>Cash on Delivery (COD) Available</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#8B8680]">
            <RefreshCw className="w-3.5 h-3.5 text-[#B8913A] shrink-0" />
            <span>7-Day Free Doorstep Return & Size Exchange</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#8B8680]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0A0A0A] shrink-0" />
            <span>100% Genuine Kurabo & Candiani Selvedge Denim</span>
          </div>
        </div>
      )}
    </div>
  );
}
