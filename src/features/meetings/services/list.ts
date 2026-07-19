import Meeting from "@/models/Meeting";

import connectMongo from "@/lib/db/mongodb";

import type { MeetingListFilter, MeetingListResult } from "../types";

export type MeetingSummary = {
  id: string;
  meetingDate: string;
  place: string;
  status: MeetingStatus;
  createdAt: string;
};

export async function listMeetings(filter: MeetingListFilter): Promise<MeetingListResult> {
  await connectMongo();

  const page = filter.page > 0 ? filter.page : 1;

  const pageSize = filter.pageSize > 0 ? filter.pageSize : 20;

  const query: Record<string, unknown> = {};

  if (filter.status) {
    query.status = filter.status;
  }

  if (filter.search?.trim()) {
    query.$or = [
      {
        place: {
          $regex: filter.search,
          $options: "i",
        },
      },
      {
        agenda: {
          $regex: filter.search,
          $options: "i",
        },
      },
    ];
  }

  const sort = filter.sort === "-meetingDate" ? { meetingDate: -1 } : { meetingDate: 1 };

  const [items, total] = await Promise.all([
    Meeting.find(query)
      .sort(sort)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean(),

    Meeting.countDocuments(query),
  ]);

  return {
    items: items.map((meeting) => ({
      id: meeting._id.toString(),
      meetingDate: meeting.meetingDate.toISOString(),
      place: meeting.place,
      status: meeting.status,
      createdAt: meeting.createdAt.toISOString(),
    })),

    total,
    page,
    pageSize,
  };
}
