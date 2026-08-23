export type DailyReportStatus = 'open' | 'completed' | 'closed' | 'archived';

/**
 * Master record for the complete daily bakery quality report.
 * One report per calendar day, shared between shifts.
 */
export interface DailyQualityReport {
  id: string;
  reportDate: string;
  status: DailyReportStatus;
  createdBy?: string;
  createdAt?: string;
  closedAt?: string;
  sectionsCompleted?: number;
  totalSections?: number;
}

export interface DailyReportEntryMeta {
  dailyReportId: string;
  shift: 'morning' | 'evening';
  enteredBy: string;
  enteredAt: string;
}
