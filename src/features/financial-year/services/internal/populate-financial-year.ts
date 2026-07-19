import type { FinancialYearHydratedDocument } from "@/models/FinancialYear";

import type {
    PopulatedExecutiveCommittee,
    PopulatedFinancialYearMember,
} from "./types";

type PopulatedFinancialYearDocument = Omit<
    FinancialYearHydratedDocument,
    "members" | "executiveCommittee"
> & {
    members: PopulatedFinancialYearMember[];

    executiveCommittee: PopulatedExecutiveCommittee;
};

export async function populateFinancialYear(
    financialYear: FinancialYearHydratedDocument,
): Promise<PopulatedFinancialYearDocument> {
    const populated = await financialYear.populate([
        {
            path: "members.memberId",
            select: "memberCode name",
        },
        {
            path: "executiveCommittee.president",
            select: "memberCode name",
        },
        {
            path: "executiveCommittee.vicePresident",
            select: "memberCode name",
        },
        {
            path: "executiveCommittee.secretary",
            select: "memberCode name",
        },
        {
            path: "executiveCommittee.jointSecretary",
            select: "memberCode name",
        },
        {
            path: "executiveCommittee.treasurer",
            select: "memberCode name",
        },
    ]);

    return populated as unknown as PopulatedFinancialYearDocument;
}
