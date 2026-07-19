import type {
    FinancialYearClosing,
} from "@/models/FinancialYear";

export interface OpeningBalanceSource {
    generatedAt: Date;

    closing: FinancialYearClosing;
}

export function buildOpeningBalanceSource(
    closing: FinancialYearClosing,
): OpeningBalanceSource {
    return {
        generatedAt: new Date(),

        closing,
    };
}