import { VALIDATION_CODE, VALIDATION_SEVERITY, type ValidationCode } from "./summary";

export type MeetingCloseValidation = {
  code: ValidationCode;
  title: string;
  severity: (typeof VALIDATION_SEVERITY)[keyof typeof VALIDATION_SEVERITY];
  message: string;
};

export function getMeetingCloseValidations(input: {
  expectedMemberCount: number;
  attendanceCount: number;
  paymentCount: number;
}): MeetingCloseValidation[] {
  const attendanceComplete =
    input.attendanceCount > 0 && input.attendanceCount === input.expectedMemberCount;
  const paymentsComplete =
    input.paymentCount > 0 && input.paymentCount === input.expectedMemberCount;

  const validations: MeetingCloseValidation[] = [
    {
      code: VALIDATION_CODE.ATTENDANCE,
      title: "Attendance",
      severity: attendanceComplete ? VALIDATION_SEVERITY.SUCCESS : VALIDATION_SEVERITY.ERROR,
      message: attendanceComplete
        ? "Attendance saved."
        : "Save attendance for all members before closing the meeting.",
    },
    {
      code: VALIDATION_CODE.PAYMENTS,
      title: "Payments",
      severity: paymentsComplete ? VALIDATION_SEVERITY.SUCCESS : VALIDATION_SEVERITY.ERROR,
      message: paymentsComplete
        ? "Payments saved."
        : "Save payments for all members before closing the meeting.",
    },
    {
      code: VALIDATION_CODE.BANK,
      title: "Bank Transactions",
      severity: VALIDATION_SEVERITY.SUCCESS,
      message: "Bank transactions are optional. Save any added rows before closing.",
    },
    {
      code: VALIDATION_CODE.INCOME,
      title: "Other Income",
      severity: VALIDATION_SEVERITY.SUCCESS,
      message: "Other income is optional. Save any added rows before closing.",
    },
    {
      code: VALIDATION_CODE.EXPENSES,
      title: "Expenses",
      severity: VALIDATION_SEVERITY.SUCCESS,
      message: "Expenses are optional. Save any added rows before closing.",
    },
  ];

  const canClose = validations.every(
    (validation) => validation.severity !== VALIDATION_SEVERITY.ERROR,
  );

  validations.push({
    code: VALIDATION_CODE.READY_TO_CLOSE,
    title: "Meeting",
    severity: canClose ? VALIDATION_SEVERITY.SUCCESS : VALIDATION_SEVERITY.ERROR,
    message: canClose
      ? "Meeting is ready to close."
      : "Meeting cannot be closed until attendance and payments are saved.",
  });

  return validations;
}

export function getMeetingCloseBlockers(input: {
  expectedMemberCount: number;
  attendanceCount: number;
  paymentCount: number;
}): string[] {
  return getMeetingCloseValidations(input)
    .filter(
      (validation) =>
        validation.severity === VALIDATION_SEVERITY.ERROR &&
        validation.code !== VALIDATION_CODE.READY_TO_CLOSE,
    )
    .map((validation) => validation.message);
}
