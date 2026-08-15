export type MemberSummary = {
  _id: string;
  memberCode: string;
  name: string;
  phone: string;
  address: string;
  status: string;
  joinedDate?: string;
  deactivatedDate?: string;
  remarks: string;
};

export type MemberDetails = MemberSummary;

export type AccountProfile = {
  memberId: string;
  memberCode: string;
  name: string;
  phone: string;
  address: string;
};
