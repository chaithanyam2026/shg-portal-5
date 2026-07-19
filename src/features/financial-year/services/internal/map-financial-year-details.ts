import type { FinancialYearDetails } from "../../types";

import type {
    PopulatedExecutiveCommittee,
    PopulatedFinancialYearMember,
    PopulatedMember,
} from "./types";

import { mapCommitteeMember } from "./map-committee-member";
import { mapMember } from "./map-member";

type FinancialYearWithPopulatedMembers = {
    _id: { toString(): string };

    name: string;

    status: FinancialYearDetails["status"];

    startDate: Date;

    endDate: Date;

    remarks: string;

    members: PopulatedFinancialYearMember[];

    executiveCommittee: PopulatedExecutiveCommittee;

    openingBalances: {
        bankBalance: number;
        cashInHand: number;
        excessCorpus: number;
        investments: number;
        otherLoans: number;
    };
};

export function mapFinancialYearDetails(
    financialYear: FinancialYearWithPopulatedMembers,
): FinancialYearDetails {
    return {
        _id: financialYear._id.toString(),

        name: financialYear.name,

        status: financialYear.status,

        startDate: financialYear.startDate,

        endDate: financialYear.endDate,

        remarks: financialYear.remarks,

        members: financialYear.members.map(mapMember),

        executiveCommittee: {
            president: mapCommitteeMember(
                financialYear.executiveCommittee.president,
            ),

            vicePresident: mapCommitteeMember(
                financialYear.executiveCommittee.vicePresident,
            ),

            secretary: mapCommitteeMember(
                financialYear.executiveCommittee.secretary,
            ),

            jointSecretary: mapCommitteeMember(
                financialYear.executiveCommittee.jointSecretary,
            ),

            treasurer: mapCommitteeMember(
                financialYear.executiveCommittee.treasurer,
            ),
        },

        openingBalances: {
            bankBalance: financialYear.openingBalances.bankBalance,
            cashInHand: financialYear.openingBalances.cashInHand,
            excessCorpus: financialYear.openingBalances.excessCorpus,
            investments: financialYear.openingBalances.investments,
            otherLoans: financialYear.openingBalances.otherLoans,
        },
    };
}