import React, { useState } from 'react';
import { X, Check, Copy, Tag, QrCode, Calendar, ShieldCheck } from 'lucide-react';
import { Promotion } from '../types';

interface PromoVoucherModalProps {
  promo: Promotion | null;
  onClose: () => void;
  onRedeemAtCounter?: (promoId: string) => void;
}

export const PromoVoucherModal: React.FC<PromoVoucherModalProps> = ({
  promo,
  onClose,
  onRedeemAtCounter,
}) => {
  const [copied, setCopied] = useState(false);
  const [redeemed, setRedeemed] = useState(false);

  if (!promo) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(promo.promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRedeem = () => {
    setRedeemed(true);
    onRedeemAtCounter?.(promo.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-600 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center">
            <Tag className="w-6 h-6 text-amber-700" />
          </div>
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-widest bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            {promo.badgeText}
          </span>
          <h3 className="text-xl font-bold text-stone-900 mt-2 font-display">
            {promo.title}
          </h3>
          <p className="text-xs text-stone-600 mt-1">
            Exclusive dining voucher for {promo.restaurantName}
          </p>
        </div>

        {/* Voucher Ticket Cutout Box */}
        <div className="relative bg-amber-50/70 border border-amber-300 rounded-xl p-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-bold text-amber-950 font-display">
              {promo.discountLabel}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-amber-800 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              <span>Valid to {promo.validUntil}</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-3 border border-amber-200 flex items-center justify-between mb-3">
            <div>
              <div className="text-[10px] text-stone-600 uppercase font-semibold">Voucher Code</div>
              <div className="font-mono text-base font-bold text-stone-900 tracking-wider">
                {promo.promoCode}
              </div>
            </div>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* QR Barcode Simulator */}
          <div className="flex items-center justify-center py-2 bg-white rounded-lg border border-dashed border-stone-300">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1 text-stone-700 font-mono text-xs">
                <QrCode className="w-4 h-4 text-stone-800" />
                <span>Present to server or scan at counter</span>
              </div>
              <div className="w-44 h-8 bg-[repeating-linear-gradient(90deg,#1c1917,#1c1917_3px,transparent_3px,transparent_6px,#1c1917_6px,#1c1917_8px,transparent_8px,transparent_10px)] mx-auto opacity-80" />
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="mb-6 text-[11px] text-stone-600 leading-relaxed bg-stone-50 p-3 rounded-lg border border-stone-100">
          <div className="font-semibold text-stone-800 mb-0.5">Voucher Conditions:</div>
          {promo.terms}
        </div>

        {/* Action Button */}
        {redeemed ? (
          <div className="w-full py-3 bg-emerald-50 border border-emerald-300 rounded-xl text-center text-xs font-bold text-emerald-800 flex items-center justify-center gap-2">
            <Check className="w-4 h-4 text-emerald-700" />
            <span>Voucher Redeemed in Dining Wallet!</span>
          </div>
        ) : (
          <button
            onClick={handleRedeem}
            className="w-full py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Save to My Dining Wallet</span>
          </button>
        )}
      </div>
    </div>
  );
};
