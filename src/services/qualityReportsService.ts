import { supabaseSync } from './supabaseSync';

/**
 * Daily quality reports service - Bakery department scope.
 * Report data only. Non-conformity records are handled separately.
 */
export interface QualityReport {
  id?: string;
  report_number?: string;
  date: string;
  section: string;
  inspector: string; // Quality Engineer
  shift: string;
  status: 'draft' | 'submitted' | 'approved';
}

export const qualityReportsService = {
  async create(report: QualityReport) {
    return supabaseSync.create('quality_reports', {
      ...report,
      section: 'bakery',
    });
  },

  async list() {
    return supabaseSync.list('quality_reports');
  },
};
