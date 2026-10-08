import React, { useState } from 'react';
import { Search, AlertCircle, Clock, MapPin, Tag, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';
import { LostItemReport } from '../types';

interface StatusTrackerProps {
  reports: LostItemReport[];
  initialSearchId?: string;
  onSelectReportToTrack: (id: string) => void;
  onNavigateToForm: () => void;
}

export const StatusTracker: React.FC<StatusTrackerProps> = ({
  reports,
  initialSearchId = '',
  onSelectReportToTrack,
  onNavigateToForm,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearchId);
  const [activeReport, setActiveReport] = useState<LostItemReport | null>(() => {
    if (initialSearchId) {
      return reports.find((r) => r.id.toLowerCase() === initialSearchId.toLowerCase()) || null;
    }
    return reports[0] || null;
  });
  const [searchError, setSearchError] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setSearchError('Please enter a Reference ID (e.g. LTR-2026-84920) or email address.');
      return;
    }

    const matched = reports.find(
      (r) => r.id.toLowerCase() === term || r.email.toLowerCase() === term
    );

    if (matched) {
      setActiveReport(matched);
      onSelectReportToTrack(matched.id);
    } else {
      setSearchError(`No reports found matching "${searchTerm}". Please check your reference code.`);
    }
  };

  const selectReportDirectly = (r: LostItemReport) => {
    setActiveReport(r);
    setSearchTerm(r.id);
    setSearchError('');
    onSelectReportToTrack(r.id);
  };

  const getStatusDisplay = (status: LostItemReport['status']) => {
    switch (status) {
      case 'submitted':
        return {
          title: 'Lodged & Queued',
          desc: 'Your report is registered and awaiting physical inventory batch match.',
          color: 'text-slate-700 bg-slate-100 border-slate-200',
        };
      case 'under_review':
        return {
          title: 'Under Active Investigation',
          desc: 'Recovery personnel are inspecting facilities in your reported zone.',
          color: 'text-amber-800 bg-amber-50 border-amber-200',
        };
      case 'potential_match':
        return {
          title: 'Potential Physical Match Located',
          desc: 'An item matching your description has arrived at the Intake Desk.',
          color: 'text-blue-800 bg-blue-50 border-blue-200',
        };
      case 'ready_for_pickup':
        return {
          title: 'Verified & Ready for Handover',
          desc: 'Identity validated. Item is securely held at Central Desk Vault.',
          color: 'text-emerald-800 bg-emerald-50 border-emerald-200',
        };
      case 'resolved':
        return {
          title: 'Claim Resolved & Returned',
          desc: 'Item successfully reunited with owner.',
          color: 'text-slate-800 bg-slate-100 border-slate-200',
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="pb-8 border-b border-slate-200">
        <div className="text-xs font-semibold tracking-wider uppercase text-slate-500 mb-1.5 flex items-center gap-2">
          <span>Real-Time Lookup</span>
          <span aria-hidden="true">·</span>
          <span>Claim Verification Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          Track Your Lost Item Report
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-2xl text-balance">
          Enter your incident reference code (e.g. LTR-2026-84920) or email address to review current warehouse inspection status and claim instructions.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mt-8 max-w-2xl">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter Reference ID (e.g. LTR-2026-84920) or Email..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            Track Status
          </button>
        </form>

        {searchError && (
          <p className="mt-2 text-xs text-rose-600 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{searchError}</span>
          </p>
        )}

        {/* Quick Click Samples */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span>Recent claims on file:</span>
          {reports.slice(0, 4).map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => selectReportDirectly(r)}
              className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
            >
              {r.id}
            </button>
          ))}
        </div>
      </div>

      {/* Main Details View */}
      {activeReport ? (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Main Report Status & Details */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6 shadow-xs">
            {/* Status Header */}
            <div className="pb-6 border-b border-slate-100">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <span className="font-mono text-xs font-semibold text-slate-500 tabular-nums">
                  Reference: {activeReport.id}
                </span>
                <span className="text-xs text-slate-500 font-mono tabular-nums">
                  Filed: {new Date(activeReport.createdAt).toLocaleDateString()} at{' '}
                  {new Date(activeReport.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Incident Status:
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {getStatusDisplay(activeReport.status).title}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  {getStatusDisplay(activeReport.status).desc}
                </p>
              </div>
            </div>

            {/* Desk Staff Notes if available */}
            {activeReport.deskNotes && (
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                  <ShieldAlert className="w-4 h-4 text-blue-600" />
                  <span>Intake Desk Dispatch Notes</span>
                </div>
                <p className="mt-1.5 text-xs text-blue-950 leading-relaxed font-sans">
                  {activeReport.deskNotes}
                </p>
              </div>
            )}

            {/* Core Item Information */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Reported Item Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <span className="text-slate-500 block">Item Specification:</span>
                  <span className="font-bold text-slate-900 text-sm block">
                    {activeReport.itemTitle}
                  </span>
                  <span className="text-slate-600 block">{activeReport.itemType}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <span className="text-slate-500 block">Color & Finish:</span>
                  <span className="font-semibold text-slate-900 block">{activeReport.color}</span>
                  {activeReport.isUrgent && (
                    <span className="text-rose-600 font-semibold block text-[11px]">
                      Urgent Item (Essential contents)
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <span className="text-slate-500 block mb-1">Full Description:</span>
                <p className="text-slate-800 leading-relaxed">{activeReport.description}</p>
                {activeReport.identifyingFeatures && (
                  <div className="mt-2 pt-2 border-t border-slate-200/60">
                    <span className="text-slate-500 font-medium">Distinctive Marks: </span>
                    <span className="text-slate-900">{activeReport.identifyingFeatures}</span>
                  </div>
                )}
              </div>

              {activeReport.photoUrl && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <span className="text-slate-500 block mb-2">Claimant Photo Reference:</span>
                  <img
                    src={activeReport.photoUrl}
                    alt={activeReport.itemTitle}
                    className="w-40 h-40 object-cover rounded-lg border border-slate-200"
                  />
                </div>
              )}
            </div>

            {/* Loss Location & Timestamp */}
            <div className="space-y-4 pt-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Loss Incident Particulars
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block mb-1">Location Reported:</span>
                  <span className="font-semibold text-slate-900 block">{activeReport.location}</span>
                  {activeReport.locationDetails && (
                    <span className="text-slate-600 text-[11px] block mt-0.5">
                      {activeReport.locationDetails}
                    </span>
                  )}
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block mb-1">Date Lost:</span>
                  <span className="font-mono text-slate-900 font-semibold block tabular-nums">
                    {activeReport.lostDate}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block mb-1">Time Lost:</span>
                  <span className="font-mono text-slate-900 font-semibold block tabular-nums">
                    {activeReport.lostTime}
                  </span>
                </div>
              </div>
            </div>

            {/* Registered Contact */}
            <div className="space-y-2 pt-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Registered Contact
              </h2>
              <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3">
                <span className="font-medium text-slate-900">
                  {activeReport.firstName} {activeReport.lastName}
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="font-mono text-slate-700">{activeReport.email}</span>
                {activeReport.phone && (
                  <>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="font-mono text-slate-700">{activeReport.phone}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Actions & Pick up Guide */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 text-xs space-y-4 shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm">Need Help With This Claim?</h3>
              <p className="text-slate-600 leading-relaxed">
                If you have additional details (such as a device serial number, IMEI, or newly found photo), or if you already recovered the item independently, notify our desk team.
              </p>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex justify-between text-slate-500">
                  <span>Phone Inquiries:</span>
                  <span className="font-mono text-slate-900 font-semibold">+1 (800) 555-LOST</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Desk Desk Code:</span>
                  <span className="font-mono text-slate-900 font-semibold">{activeReport.id}</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-xs space-y-3">
              <h3 className="font-bold text-slate-900">Claim Handover Requirements</h3>
              <p className="text-slate-600">To claim an item at the Central Desk:</p>
              <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
                <li>Government or Student Photo ID</li>
                <li>Report Reference Code ({activeReport.id})</li>
                <li>Device unlock pass code or proof of purchase (for electronics)</li>
              </ul>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={onNavigateToForm}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-slate-700 transition-colors"
              >
                <span>Report another lost item</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-12 text-center py-16 bg-white border border-slate-200 rounded-xl p-8">
          <p className="text-sm font-semibold text-slate-800">No active report selected</p>
          <p className="text-xs text-slate-500 mt-1">
            Search with your reference code above or choose from recent registry entries.
          </p>
        </div>
      )}
    </div>
  );
};
