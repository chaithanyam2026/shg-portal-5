import type {
  AttendanceStatus,
} from "@/features/meetings/domain/attendance-status";

export type AttendanceRegisterBuilderInput =
  {
    financialYearId: string;

    financialYearName: string;

    members: {
      memberId: string;

      memberCode: string;

      memberName: string;
    }[];

    meetings: {
      meetingId: string;

      meetingDate: Date;

      attendance: {
        memberId: string;

        status: AttendanceStatus;
      }[];
    }[];
  };