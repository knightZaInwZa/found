import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Check,
  Printer,
  ArrowRight,
  PlusCircle,
  Clock,
  MapPin,
  Mail,
  User,
  Tag,
  Share2,
} from 'lucide-react';
import { LostItemReport } from '../types';

interface ReportConfirmationProps {
  report: LostItemReport;
  onTrackReport: (id: string) => void;
  onNewReport: () => void;
}

export const ReportConfirmation: React.FC<ReportConfirmationProps> = ({
  report,
  onTrackReport,
  onNewReport,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(report.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Success banner card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs print:border-none print:shadow-none">
        {/* Banner Top */}
        <div className="bg-slate-900 text-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                  Report Successfully Registered
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
                  Reference: {report.id}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-700" />}
                <span>{copied ? 'Copied' : 'Copy Tracking ID'}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap cursor-pointer print:hidden"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Status Progression Bar */}
          <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/70">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
              Current Claim Lifecycle
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  ✓
                </span>
                <div>
                  <span className="font-semibold text-slate-900 block">1. Lodged</span>
                  <span className="text-[11px] text-slate-500 font-mono tabular-nums">
                    {new Date(report.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
                  2
                </span>
                <div>
                  <span className="font-semibold text-blue-900 block">2. In Inventory Sweep</span>
                  <span className="text-[11px] text-blue-700">Cross-referencing active intakes</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-slate-400">
                <span className="w-5 h-5 rounded-full border border-slate-300 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <span className="font-medium text-slate-600 block">3. Verification Match</span>
                  <span className="text-[11px]">Staff notification dispatch</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-slate-400">
                <span className="w-5 h-5 rounded-full border border-slate-300 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  4
                </span>
                <div>
                  <span className="font-medium text-slate-600 block">4. Ready for Handover</span>
                  <span className="text-[11px]">Pickup at Central Desk</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields Summary Breakdown */}
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-200">
              Submitted Incident Record
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              {/* Reporter Information */}
              <div className="space-y-3.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Claimant Details</span>
                </div>

                <div className="bg-slate-50/50 rounded-lg p-3.5 border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">First Name:</span>
                    <span className="font-semibold text-slate-900">{report.firstName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Last Name:</span>
                    <span className="font-semibold text-slate-900">{report.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Email Address:</span>
                    <span className="font-mono text-slate-900">{report.email}</span>
                  </div>
                  {report.phone && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Phone:</span>
                      <span className="font-mono text-slate-900">{report.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Timing & Location */}
              <div className="space-y-3.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Incident Location & Timing</span>
                </div>

                <div className="bg-slate-50/50 rounded-lg p-3.5 border border-slate-200 space-y-2 text-xs">
                  <div>
                    <span className="text-slate-500 block mb-0.5">Location Where Lost:</span>
                    <span className="font-semibold text-slate-900 block">{report.location}</span>
                    {report.locationDetails && (
                      <span className="text-slate-600 block mt-0.5">{report.locationDetails}</span>
                    )}
                  </div>
                  <div className="pt-2 border-t border-slate-200/60 flex justify-between">
                    <span className="text-slate-500">Date Lost:</span>
                    <span className="font-mono tabular-nums text-slate-900 font-semibold">{report.lostDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Approximate Time:</span>
                    <span className="font-mono tabular-nums text-slate-900 font-semibold">{report.lostTime}</span>
                  </div>
                </div>
              </div>

              {/* Item Details */}
              <div className="md:col-span-2 space-y-3.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  <span>Item Description & Attributes</span>
                </div>

                <div className="bg-slate-50/50 rounded-lg p-4 border border-slate-200 space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="text-slate-500 block">Type of Item:</span>
                      <span className="font-semibold text-slate-900">{report.itemType}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Specific Model / Name:</span>
                      <span className="font-semibold text-slate-900">{report.itemTitle}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Color / Finish:</span>
                      <span className="font-semibold text-slate-900">{report.color}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-500 block mb-1">Detailed Description:</span>
                    <p className="text-slate-800 leading-relaxed bg-white p-3 rounded border border-slate-200">
                      {report.description}
                    </p>
                  </div>

                  {report.identifyingFeatures && (
                    <div>
                      <span className="text-slate-500 block mb-0.5">Identifying Marks / Serial:</span>
                      <span className="text-slate-900 font-medium">{report.identifyingFeatures}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-4 pt-2 text-[11px] text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">Urgency:</span>
                      <span className={`font-semibold ${report.isUrgent ? 'text-rose-600' : 'text-slate-700'}`}>
                        {report.isUrgent ? 'High Urgency (Critical contents)' : 'Standard'}
                      </span>
                    </div>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">Gratitude / Reward:</span>
                      <span className="font-semibold text-slate-700">
                        {report.hasReward ? `Yes (${report.rewardAmount || 'Offered'})` : 'None'}
                      </span>
                    </div>
                  </div>

                  {report.photoUrl && (
                    <div className="pt-2">
                      <span className="text-slate-500 block mb-1.5">Attached Visual Reference:</span>
                      <img
                        src={report.photoUrl}
                        alt="Submitted reference"
                        className="w-32 h-32 object-cover rounded-lg border border-slate-200"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
            <button
              type="button"
              onClick={onNewReport}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-slate-500" />
              <span>Submit Another Report</span>
            </button>

            <button
              type="button"
              onClick={() => onTrackReport(report.id)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <span>Track Incident in Live System</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
