import { notFound } from "next/navigation";

import { getMember } from "@/features/members/services";

import MemberTabs from "@/features/members/ui/MemberTabs";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  try {
    const [member, attendanceFine] = await Promise.all([
      getMember(id),
      getAttendanceFineSummary(id),
    ]);

    return <MemberTabs member={member} attendanceFine={attendanceFine} />;
  } catch {
    notFound();
  }
}

function getAttendanceFineSummary(id: string): any {
  throw new Error("Function not implemented.");
}
