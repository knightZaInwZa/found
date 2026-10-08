import React from 'react';
import { Shield, Clock, AlertTriangle, FileCheck, CheckCircle2 } from 'lucide-react';

interface GuidelinesViewProps {
  onNavigateToForm: () => void;
}

export const GuidelinesView: React.FC<GuidelinesViewProps> = ({ onNavigateToForm }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Header */}
      <div className="pb-8 border-b border-slate-200">
        <div className="text-xs font-semibold tracking-wider uppercase text-slate-500 mb-1.5 flex items-center gap-2">
          <span>Official Policies</span>
          <span aria-hidden="true">·</span>
          <span>Property Custody Standards</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Lost & Found Desk Guidelines
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-2xl text-balance">
          Read our chain-of-custody protocols, holding timelines, claimant verification requirements, and handling of sensitive belongings.
        </p>
      </div>

      <div className="mt-8 space-y-8">
        {/* Retention Periods */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7 shadow-xs">
          <div className="flex items-center gap-2.5 mb-4">
            <Clock className="w-5 h-5 text-slate-700" />
            <h2 className="text-base font-bold text-slate-900">Holding & Retention Timelines</h2>
          </div>
          <p className="text-xs text-slate-600 mb-4">
            Items turned in are inventoried and retained according to their category before being transferred to state surplus or authorized recycling:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-900 block mb-1">High-Value Electronics & Wallets</span>
              <span className="text-blue-700 font-mono font-semibold block text-sm">90 Days</span>
              <p className="text-slate-500 mt-1">Kept in high-security biometric safe. Phone/laptop locks inspected with owner.</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-900 block mb-1">Passports, IDs & Government Cards</span>
              <span className="text-blue-700 font-mono font-semibold block text-sm">30 Days</span>
              <p className="text-slate-500 mt-1">Transferred directly to issuing embassy or Department of Motor Vehicles if unclaimed.</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-semibold text-slate-900 block mb-1">Apparel, Books & General Gear</span>
              <span className="text-blue-700 font-mono font-semibold block text-sm">60 Days</span>
              <p className="text-slate-500 mt-1">Donated to verified local community non-profit organizations if unclaimed.</p>
            </div>
          </div>
        </div>

        {/* Verification Requirements */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7 shadow-xs">
          <div className="flex items-center gap-2.5 mb-4">
            <FileCheck className="w-5 h-5 text-slate-700" />
            <h2 className="text-base font-bold text-slate-900">Proof of Ownership Requirements</h2>
          </div>
          <p className="text-xs text-slate-600 mb-4">
            To prevent fraud and protect user privacy, claimant identity must be positively established:
          </p>

          <div className="space-y-3 text-xs text-slate-700">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Smartphones & Tablets:</strong> Claimant must provide the unlock passcode, describe specific wallpaper, or trigger a Find My ring command in the presence of an officer.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Wallets & Purses:</strong> Government photo ID matching the name on payment cards or licenses inside the wallet.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Keys:</strong> Detailed knowledge of keys on the ring (number of keys, brands, specific fobs) or test unlock of the vehicle in the parking facility.
              </div>
            </div>
          </div>
        </div>

        {/* Prohibited Items */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7 shadow-xs">
          <div className="flex items-center gap-2.5 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-slate-900">Items Not Accepted by Custody</h2>
          </div>
          <p className="text-xs text-slate-600 mb-3">
            For hygiene and health safety, the following items are immediately disposed of and cannot be logged:
          </p>
          <ul className="text-xs text-slate-600 list-disc list-inside space-y-1">
            <li>Opened perishable foodstuffs and beverages</li>
            <li>Soiled or unhygienic clothing garments</li>
            <li>Underwear, socks, or personal hygiene products</li>
            <li>Damaged chemicals or unsealed liquid containers</li>
          </ul>
        </div>

        {/* Action */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onNavigateToForm}
            className="px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            Return to Lost Item Report Form
          </button>
        </div>
      </div>
    </div>
  );
};
