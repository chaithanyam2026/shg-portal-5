import type { AttendanceStatus } from "./attendance-fine";

export type AttendanceRegisterBuilderInput = {
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
