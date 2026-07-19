export async function populateFinancialYear(
    financialYear: FinancialYearHydratedDocument,
) {
    return financialYear.populate([
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
}