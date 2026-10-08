/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LostItemForm } from './components/LostItemForm';
import { ReportConfirmation } from './components/ReportConfirmation';
import { StatusTracker } from './components/StatusTracker';
import { RecentReportsList } from './components/RecentReportsList';
import { GuidelinesView } from './components/GuidelinesView';
import { LostItemReport } from './types';
import { SAMPLE_REPORTS } from './mockData';

const STORAGE_KEY = 'lost_item_reports_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'report' | 'track' | 'browse' | 'guidelines'>('report');
  const [reports, setReports] = useState<LostItemReport[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore parse errors
    }
    return SAMPLE_REPORTS;
  });

  const [submittedReport, setSubmittedReport] = useState<LostItemReport | null>(null);
  const [trackingReportId, setTrackingReportId] = useState<string>('');

  // Persist reports to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    } catch {
      // Storage quota or privacy sandbox
    }
  }, [reports]);

  const handleSubmitSuccess = (newReport: LostItemReport) => {
    setReports((prev) => [newReport, ...prev]);
    setSubmittedReport(newReport);
    setTrackingReportId(newReport.id);
  };

  const handleTrackReport = (id: string) => {
    setTrackingReportId(id);
    setSubmittedReport(null);
    setActiveTab('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewReport = () => {
    setSubmittedReport(null);
    setActiveTab('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectFromList = (id: string) => {
    setTrackingReportId(id);
    setActiveTab('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'report') {
            setSubmittedReport(null);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        reportCount={reports.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {submittedReport && activeTab === 'report' ? (
          <ReportConfirmation
            report={submittedReport}
            onTrackReport={handleTrackReport}
            onNewReport={handleNewReport}
          />
        ) : activeTab === 'report' ? (
          <LostItemForm onSubmitSuccess={handleSubmitSuccess} />
        ) : activeTab === 'track' ? (
          <StatusTracker
            reports={reports}
            initialSearchId={trackingReportId}
            onSelectReportToTrack={(id) => setTrackingReportId(id)}
            onNavigateToForm={handleNewReport}
          />
        ) : activeTab === 'browse' ? (
          <RecentReportsList
            reports={reports}
            onSelectReport={handleSelectFromList}
            onNavigateToForm={handleNewReport}
          />
        ) : (
          <GuidelinesView onNavigateToForm={handleNewReport} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span className="font-semibold text-slate-700">Lost Item Registry & Central Desk</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>Ground Floor, Hall of Administration, Room 104</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => {
                setActiveTab('guidelines');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-slate-800 transition-colors cursor-pointer"
            >
              Custody Protocols
            </button>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Help Desk: +1 (800) 555-LOST</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
