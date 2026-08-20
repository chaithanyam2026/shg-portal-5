export type ChittyPaymentRecord = {
  memberId: string;
  memberCode: string;
  memberName: string;
  cash: number;
  gpay: number;
  gpayChecked: boolean;
  missingCount: number;
  remarks: string;
};

export type ChittyPaymentTotals = {
  cash: number;
  gpay: number;
  gpayChecked: number;
  missingCount: number;
};

export type ChittyPaymentSheet = {
  date: string;
  dateOptions: string[];
  locked: boolean;
  canEditAll: boolean;
  canEditPast: boolean;
  currentMemberId: string | null;
  records: ChittyPaymentRecord[];
  totals: ChittyPaymentTotals;
};
