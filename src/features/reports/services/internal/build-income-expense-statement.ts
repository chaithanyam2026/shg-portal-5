import { INCOME_CATEGORY, INCOME_CATEGORY_OPTIONS } from "@/features/meetings/domain/income";
import { BANK_TRANSACTION_TYPE } from "@/features/meetings/domain/bank-transaction";
import { EXPENSE_CATEGORY_OPTIONS } from "@/features/meetings/domain/expense";
import type { OpeningBalance } from "@/features/financial-year/domain/opening-balance";
import type {
  IncomeExpenseDetail,
  IncomeExpenseStatement,
  IncomeExpenseStatementItem,
} from "@/features/reports/domain/income-expense-statement";
import { clubIncomeExpenseDetails } from "@/features/reports/domain/club-income-expense-details";
import { isOpeningBalanceMigrationLoan } from "@/features/loans/domain/loan-constants";
import Loan from "@/models/Loan";
import Member from "@/models/Member";
import { Types } from "mongoose";

import { sumLoanIncomeForFinancialYear } from "./sum-loan-income-for-financial-year";

type StatementMeeting = {
  _id: {
    toString(): string;
  };
  meetingDate: Date;
  payments: {
    contribution: number;
    absentFine: number;
    specialLoanFine: number;
  }[];
  otherIncomes: {
    transactionDate: Date;
    category: string;
    amount: number;
    remarks: string;
  }[];
  expenses: {
    transactionDate: Date;
    category: string;
    amount: number;
    remarks: string;
  }[];
  bankTransactions: {
    transactionDate: Date;
    type: string;
    amount: number;
    remarks: string;
  }[];
};

function getIncomeCategoryLabel(category: string): string {
  return INCOME_CATEGORY_OPTIONS.find((option) => option.value === category)?.label ?? category;
}

function getExpenseCategoryLabel(category: string): string {
  return EXPENSE_CATEGORY_OPTIONS.find((option) => option.value === category)?.label ?? category;
}

function pushDetail(
  details: IncomeExpenseDetail[],
  detail: IncomeExpenseDetail,
): void {
  if (detail.amount <= 0) {
    return;
  }

  details.push(detail);
}

function sumDetails(details: IncomeExpenseDetail[]): number {
  return details.reduce((total, detail) => total + detail.amount, 0);
}

function buildItem(key: string, label: string, details: IncomeExpenseDetail[]): IncomeExpenseStatementItem {
  const clubbedDetails = clubIncomeExpenseDetails(details);

  return {
    key,
    label,
    amount: sumDetails(clubbedDetails),
    details: clubbedDetails,
  };
}

function buildOpeningStatementItems(
  openingBalances: OpeningBalance,
  startDate: Date,
): {
  excessCorpusDetails: IncomeExpenseDetail[];
  bankBalanceDetails: IncomeExpenseDetail[];
  cashInHandDetails: IncomeExpenseDetail[];
  investmentDetails: IncomeExpenseDetail[];
} {
  const excessCorpusDetails: IncomeExpenseDetail[] = [];
  const bankBalanceDetails: IncomeExpenseDetail[] = [];
  const cashInHandDetails: IncomeExpenseDetail[] = [];
  const investmentDetails: IncomeExpenseDetail[] = [];

  pushDetail(excessCorpusDetails, {
    date: startDate,
    description: "Excess Corpus",
    amount: openingBalances.excessCorpus,
  });

  pushDetail(bankBalanceDetails, {
    date: startDate,
    description: "Initial Bank Balance",
    amount: openingBalances.bankBalance,
  });

  pushDetail(cashInHandDetails, {
    date: startDate,
    description: "Initial Cash In Hand",
    amount: openingBalances.cashInHand,
  });

  pushDetail(investmentDetails, {
    date: startDate,
    description: "Initial Investments",
    amount: openingBalances.investments,
  });

  return { excessCorpusDetails, bankBalanceDetails, cashInHandDetails, investmentDetails };
}

type MemberOpening = {
  contribution: number;
  loan: number;
  specialLoan: number;
};

function buildOpeningMemberStatementItems(
  members: { opening: MemberOpening }[],
  startDate: Date,
): {
  contributionDetails: IncomeExpenseDetail[];
  loanDetails: IncomeExpenseDetail[];
  specialLoanDetails: IncomeExpenseDetail[];
} {
  const contributionDetails: IncomeExpenseDetail[] = [];
  const loanDetails: IncomeExpenseDetail[] = [];
  const specialLoanDetails: IncomeExpenseDetail[] = [];

  const totalContribution = members.reduce(
    (total, member) => total + (member.opening?.contribution ?? 0),
    0,
  );

  const totalLoan = members.reduce((total, member) => total + (member.opening?.loan ?? 0), 0);

  const totalSpecialLoan = members.reduce(
    (total, member) => total + (member.opening?.specialLoan ?? 0),
    0,
  );

  pushDetail(contributionDetails, {
    date: startDate,
    description: "Initial Contribution",
    amount: totalContribution,
  });

  pushDetail(loanDetails, {
    date: startDate,
    description: "Initial Loan",
    amount: totalLoan,
  });

  pushDetail(specialLoanDetails, {
    date: startDate,
    description: "Initial Special Loan",
    amount: totalSpecialLoan,
  });

  return { contributionDetails, loanDetails, specialLoanDetails };
}

export async function buildIncomeExpenseStatement(
  financialYearId: string,
  meetings: StatementMeeting[],
  openingBalances?: OpeningBalance,
  startDate?: Date,
  members: { opening: MemberOpening }[] = [],
): Promise<IncomeExpenseStatement> {
  const meetingIds = new Set(meetings.map((meeting) => meeting._id.toString()));

  const absentFineDetails: IncomeExpenseDetail[] = [];
  const contributionDetails: IncomeExpenseDetail[] = [];
  const paymentLoanFineDetails: IncomeExpenseDetail[] = [];
  const bankInterestDetails: IncomeExpenseDetail[] = [];
  const meetingIncomeDetailsByCategory = new Map<string, IncomeExpenseDetail[]>();
  const expenseDetailsByCategory = new Map<string, IncomeExpenseDetail[]>();
  const loanDisbursementDetails: IncomeExpenseDetail[] = [];

  for (const meeting of meetings) {
    const meetingId = meeting._id.toString();
    const meetingLabel = meeting.meetingDate.toLocaleDateString("en-IN");

    let meetingContribution = 0;
    let meetingAbsentFine = 0;
    let meetingSpecialLoanFine = 0;

    for (const payment of meeting.payments) {
      meetingContribution += payment.contribution;
      meetingAbsentFine += payment.absentFine;
      meetingSpecialLoanFine += payment.specialLoanFine;
    }

    pushDetail(contributionDetails, {
      date: meeting.meetingDate,
      description: `Meeting ${meetingLabel} — Contribution`,
      amount: meetingContribution,
      meetingId,
    });

    pushDetail(absentFineDetails, {
      date: meeting.meetingDate,
      description: `Meeting ${meetingLabel} — Absent fine`,
      amount: meetingAbsentFine,
      meetingId,
    });

    pushDetail(paymentLoanFineDetails, {
      date: meeting.meetingDate,
      description: `Meeting ${meetingLabel} — Special loan fine`,
      amount: meetingSpecialLoanFine,
      meetingId,
    });

    for (const income of meeting.otherIncomes) {
      if (income.amount <= 0) {
        continue;
      }

      const description = income.remarks
        ? `${getIncomeCategoryLabel(income.category)} — ${income.remarks}`
        : getIncomeCategoryLabel(income.category);

      const detail: IncomeExpenseDetail = {
        date: income.transactionDate,
        description: `Meeting ${meetingLabel} — ${description}`,
        amount: income.amount,
        meetingId,
      };

      if (income.category === INCOME_CATEGORY.BANK_INTEREST) {
        pushDetail(bankInterestDetails, detail);
        continue;
      }

      const categoryDetails = meetingIncomeDetailsByCategory.get(income.category) ?? [];
      categoryDetails.push(detail);
      meetingIncomeDetailsByCategory.set(income.category, categoryDetails);
    }

    for (const transaction of meeting.bankTransactions) {
      if (transaction.type !== BANK_TRANSACTION_TYPE.INTEREST || transaction.amount <= 0) {
        continue;
      }

      pushDetail(bankInterestDetails, {
        date: transaction.transactionDate,
        description: transaction.remarks
          ? `Meeting ${meetingLabel} — Bank interest — ${transaction.remarks}`
          : `Meeting ${meetingLabel} — Bank interest`,
        amount: transaction.amount,
        meetingId,
      });
    }

    for (const expense of meeting.expenses) {
      if (expense.amount <= 0) {
        continue;
      }

      const categoryDetails = expenseDetailsByCategory.get(expense.category) ?? [];

      categoryDetails.push({
        date: expense.transactionDate,
        description: expense.remarks
          ? `Meeting ${meetingLabel} — ${getExpenseCategoryLabel(expense.category)} — ${expense.remarks}`
          : `Meeting ${meetingLabel} — ${getExpenseCategoryLabel(expense.category)}`,
        amount: expense.amount,
        meetingId,
      });

      expenseDetailsByCategory.set(expense.category, categoryDetails);
    }
  }

  const loanIncome = await sumLoanIncomeForFinancialYear(financialYearId, meetingIds);

  const disbursementLoans = (
    await Loan.find({
      financialYearId: new Types.ObjectId(financialYearId),
    })
      .select({
        loanNumber: 1,
        memberId: 1,
        disbursedAmount: 1,
        disbursedDate: 1,
        meetingId: 1,
        remarks: 1,
      })
      .lean()
      .exec()
  ).filter((loan) => !isOpeningBalanceMigrationLoan(loan.remarks ?? ""));

  if (disbursementLoans.length > 0) {
    const memberIds = [...new Set(disbursementLoans.map((loan) => loan.memberId.toString()))];

    const members = await Member.find({
      _id: {
        $in: memberIds.map((memberId) => new Types.ObjectId(memberId)),
      },
    })
      .select({
        memberCode: 1,
        name: 1,
      })
      .lean()
      .exec();

    const memberById = new Map(members.map((member) => [member._id.toString(), member]));

    for (const loan of disbursementLoans) {
      if (loan.meetingId && !meetingIds.has(loan.meetingId.toString())) {
        continue;
      }

      const member = memberById.get(loan.memberId.toString());

      pushDetail(loanDisbursementDetails, {
        date: loan.disbursedDate,
        description: member
          ? `Loan ${loan.loanNumber} — ${member.memberCode} ${member.name}`
          : `Loan ${loan.loanNumber}`,
        amount: loan.disbursedAmount,
        meetingId: loan.meetingId?.toString(),
      });
    }
  }

  const loanFineDetails = [...paymentLoanFineDetails, ...loanIncome.fineDetails];

  const openingItems =
    openingBalances && startDate
      ? buildOpeningStatementItems(openingBalances, startDate)
      : {
        excessCorpusDetails: [],
        bankBalanceDetails: [],
        cashInHandDetails: [],
        investmentDetails: [],
      };

  const openingMemberItems =
    startDate && members.length > 0
      ? buildOpeningMemberStatementItems(members, startDate)
      : {
        contributionDetails: [],
        loanDetails: [],
        specialLoanDetails: [],
      };

  const incomeItems: IncomeExpenseStatementItem[] = [
    buildItem("OPENING_EXCESS_CORPUS", "Excess Corpus", openingItems.excessCorpusDetails),
    buildItem(
      "OPENING_CONTRIBUTION",
      "Initial Contribution",
      openingMemberItems.contributionDetails,
    ),
    buildItem("CONTRIBUTION", "Contribution", contributionDetails),
    buildItem("ABSENT_FINE", "Absent Fine", absentFineDetails),
    buildItem("LOAN_FINE", "Loan Fine", loanFineDetails),
    buildItem("LOAN_INTEREST", "Loan Interest", loanIncome.interestDetails),
    buildItem("BANK_INTEREST", "Bank Interest", bankInterestDetails),
  ];

  for (const option of INCOME_CATEGORY_OPTIONS) {
    if (option.value === INCOME_CATEGORY.BANK_INTEREST) {
      continue;
    }

    const details = meetingIncomeDetailsByCategory.get(option.value) ?? [];

    if (details.length === 0) {
      continue;
    }

    incomeItems.push(buildItem(option.value, option.label, details));
  }

  for (const [category, details] of meetingIncomeDetailsByCategory.entries()) {
    if (INCOME_CATEGORY_OPTIONS.some((option) => option.value === category)) {
      continue;
    }

    incomeItems.push(buildItem(category, getIncomeCategoryLabel(category), details));
  }

  const expenseItems: IncomeExpenseStatementItem[] = [
    buildItem("OPENING_BANK_BALANCE", "Bank Balance", openingItems.bankBalanceDetails),
    buildItem("OPENING_INVESTMENTS", "Investments", openingItems.investmentDetails),
    buildItem("OPENING_CASH_IN_HAND", "Cash In Hand", openingItems.cashInHandDetails),
    buildItem("OPENING_LOAN", "Initial Loan", openingMemberItems.loanDetails),
    buildItem("OPENING_SPECIAL_LOAN", "Initial Special Loan", openingMemberItems.specialLoanDetails),
    buildItem("LOAN_DISBURSEMENT", "Loan Disbursement", loanDisbursementDetails),
  ];

  for (const option of EXPENSE_CATEGORY_OPTIONS) {
    const details = expenseDetailsByCategory.get(option.value) ?? [];

    if (details.length === 0) {
      continue;
    }

    expenseItems.push(buildItem(option.value, option.label, details));
  }

  for (const [category, details] of expenseDetailsByCategory.entries()) {
    if (EXPENSE_CATEGORY_OPTIONS.some((option) => option.value === category)) {
      continue;
    }

    expenseItems.push(buildItem(category, getExpenseCategoryLabel(category), details));
  }

  const incomeTotal = incomeItems.reduce((total, item) => total + item.amount, 0);
  const expenseTotal = expenseItems.reduce((total, item) => total + item.amount, 0);

  return {
    income: {
      items: incomeItems.filter((item) => item.amount > 0),
      total: incomeTotal,
    },
    expense: {
      items: expenseItems.filter((item) => item.amount > 0),
      total: expenseTotal,
    },
  };
}
