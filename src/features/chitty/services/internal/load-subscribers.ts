import { Types } from "mongoose";

import { toDateInputValue } from "@/lib/utils/date";
import ChittyUser from "@/models/ChittyUser";
import Member from "@/models/Member";

export type ChittySubscriber = {
  chittyUserId: string;
  userName: string;
  phone: string;
  agentMemberId: string;
  agentMemberName: string;
  active: boolean;
  winDate: string | null;
};

export async function loadChittySubscribers(chittyId: string): Promise<ChittySubscriber[]> {
  const users = await ChittyUser.find({ chittyId: new Types.ObjectId(chittyId) }).lean();
  const memberIds = [...new Set(users.map((user) => user.agentMemberId.toString()))];
  const members = await Member.find({ _id: { $in: memberIds } })
    .select("name")
    .lean();
  const memberNames = new Map(members.map((member) => [member._id.toString(), member.name]));

  return users
    .map((user) => ({
      chittyUserId: user._id.toString(),
      userName: user.name,
      phone: user.phone,
      agentMemberId: user.agentMemberId.toString(),
      agentMemberName: memberNames.get(user.agentMemberId.toString()) ?? "Unknown member",
      active: user.active,
      winDate: user.winDate ? toDateInputValue(user.winDate) : null,
    }))
    .sort((left, right) => {
      const agent = left.agentMemberName.localeCompare(right.agentMemberName);
      return agent === 0 ? left.userName.localeCompare(right.userName) : agent;
    });
}
