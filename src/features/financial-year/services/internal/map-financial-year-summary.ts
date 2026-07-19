import type { FinancialYearSummary } from "../../types";

type FinancialYearSummarySource = {
    _id: {
        toString(): string;
    };

    name: string;

    status: FinancialYearSummary["status"];

    startDate: Date;

    endDate: Date;
};

export function mapFinancialYearSummary(
    financialYear: FinancialYearSummarySource,
): FinancialYearSummary {
    return {
        _id: financialYear._id.toString(),

        name: financialYear.name,

        status: financialYear.status,

        startDate: financialYear.startDate,

        endDate: financialYear.endDate,
    };
}