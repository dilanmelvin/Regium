import type { LaborRules, LeavePolicy, LeaveType } from "../types/index.js";
import { round } from "../utils/index.js";

export interface LeaveAccrualOptions {
  rules: LaborRules;
  /** Months of service. */
  monthsOfService: number;
}

export interface LeaveAccrualResult {
  type: LeaveType;
  /** Accrued days for the period. */
  accruedDays: number;
  /** Eligibility status. */
  eligible: boolean;
}

/** Compute leave accrual for each defined policy. */
export function computeLeaveAccrual(opts: LeaveAccrualOptions): LeaveAccrualResult[] {
  const months = opts.monthsOfService;
  return (opts.rules.leavePolicies ?? []).map((p): LeaveAccrualResult => {
    const eligible = months * 30 >= (p.eligibilityDays ?? 0);
    const annualDays = p.minDaysPerYear;
    const accrued = eligible ? round((annualDays * months) / 12, 2) : 0;
    return { type: p.type, accruedDays: accrued, eligible };
  });
}

export interface NoticeOptions {
  rules: LaborRules;
  /** Months of service. */
  monthsOfService: number;
}

/** Compute statutory notice period in days for a given tenure. */
export function statutoryNoticeDays(opts: NoticeOptions): number {
  return opts.rules.termination.minNoticeDays;
}

/** Check whether a weekly schedule complies with statutory caps. */
export function isWeeklyScheduleCompliant(rules: LaborRules, hoursPerWeek: number): boolean {
  return hoursPerWeek <= (rules.maxWeeklyHours ?? 48);
}

/** Get a leave policy by type. */
export function getLeavePolicy(rules: LaborRules, type: LeaveType): LeavePolicy | undefined {
  return (rules.leavePolicies ?? []).find((p) => p.type === type);
}

export type { LaborRules, LeavePolicy };
