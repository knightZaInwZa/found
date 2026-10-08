import React, { useState } from 'react';
import { Search, MapPin, Clock, Tag, PlusCircle, ArrowRight, Filter } from 'lucide-react';
import { LostItemReport, ItemCategory } from '../types';
import { ITEM_CATEGORIES } from '../mockData';

interface RecentReportsListProps {
  reports: LostItemReport[];
  onSelectReport: (id: string) => void;
  onNavigateToForm: () => void;
}

export const RecentReportsList: React.FC<RecentReportsListProps> = ({
  reports,
  onSelectReport,
  onNavigateToForm,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      searchTerm.trim() === '' ||
      r.itemTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || r.itemType === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-8 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold tracking-wider uppercase text-slate-500 mb-1.5 flex items-center gap-2">
            <span>Public Incident Log</span>
            <span aria-hidden="true">·</span>
            <span>Intake Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Recent Lost Item Reports
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-2xl text-balance">
            Real-time feed of logged missing belongings across facilities. If you found any of these items, please contact the Central Desk or drop them off at security.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToForm}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs cursor-pointer shrink-0"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Report Your Lost Item</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="mt-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by item name, location, or reference ID..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
            />
          </div>

          {/* Category Dropdown */}
          <div className="sm:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 text-slate-700"
            >
              <option value="All">All Categories</option>
              {ITEM_CATEGORIES.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category quick buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'All'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            All Items ({reports.length})
          </button>
          {ITEM_CATEGORIES.slice(0, 5).map((cat) => (
            <button
              key={cat.name}
              type="button"
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3 py-1.5 rounded-md font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.name
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Table/Grid */}
      <div className="mt-6">
        {filteredReports.length > 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden shadow-xs">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                onClick={() => onSelectReport(report.id)}
                className="p-5 sm:p-6 hover:bg-slate-50/80 transition-colors cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1 min-w-0">
                  {/* Metadata line adhering to Zero-Pill rule: clean unboxed text with subtle typographic separators */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-mono font-medium text-slate-700 tabular-nums">
                      {report.id}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-medium text-slate-800">{report.itemType}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">Lost {report.lostDate} at {report.lostTime}</span>
                    {report.isUrgent && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-rose-600 font-semibold">Priority Incident</span>
                      </>
                    )}
                    {report.hasReward && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-emerald-700 font-medium">Reward Offered</span>
                      </>
                    )}
                  </div>

                  {/* Title & Preview */}
                  <div>
                    <h2 className="text-base font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {report.itemTitle}
                    </h2>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                      {report.description}
                    </p>
                  </div>

                  {/* Location snippet */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{report.location}</span>
                    {report.locationDetails && (
                      <span className="text-slate-400 hidden sm:inline">
                        — {report.locationDetails}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right side: Status text & detail CTA */}
                <div className="flex items-center gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-right text-xs">
                    <span className="block font-semibold text-slate-900">
                      {report.status === 'potential_match'
                        ? 'Match Under Review'
                        : report.status === 'ready_for_pickup'
                        ? 'Ready for Handover'
                        : 'Active Sweep'}
                    </span>
                    <span className="block text-[11px] text-slate-400 font-mono">
                      Filed by {report.firstName} {report.lastName[0]}.
                    </span>
                  </div>

                  <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-slate-900 group-hover:text-white flex items-center justify-center text-slate-500 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-xl p-8">
            <p className="text-sm font-semibold text-slate-800">No matching reports found</p>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search terms or view all categories.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="mt-4 px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
