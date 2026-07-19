import connectMongo from "@/lib/db/mongodb";

import Loan from "@/models/Loan";

/* import {
  RecordLoanCollectionInput,
  RecordLoanCollectionSchema,
} from "../validation"; */

export type RecordLoanCollectionInput = {
  collectionDate: Date;
  principalAmount: number;
  interestAmount: number;
  penaltyAmount?: number;
  remarks?: string;
};

export async function recordLoanCollection(loanId: string, input: RecordLoanCollectionInput) {
  await connectMongo();

  const data = input;

  const loan = await Loan.findById(loanId);

  if (!loan) {
    throw new Error("Loan not found.");
  }

  const principal = data.principalAmount ?? 0;

  const interest = data.interestAmount ?? 0;

  const penalty = data.penaltyAmount ?? 0;

  loan.outstandingPrincipal = Math.max(
    0,
    (loan.outstandingPrincipal ?? loan.principalAmount ?? 0) - principal,
  );

  loan.outstandingInterest = Math.max(0, (loan.outstandingInterest ?? 0) - interest);

  loan.totalCollected = (loan.totalCollected ?? 0) + principal + interest + penalty;

  loan.lastCollectionDate = data.collectionDate;

  await loan.save();

  return loan.toObject();
}
