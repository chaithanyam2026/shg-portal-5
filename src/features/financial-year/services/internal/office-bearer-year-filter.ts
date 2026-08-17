import { Types } from "mongoose";

export function officeBearerYearFilter(memberObjectId: Types.ObjectId) {
  return {
    $or: [
      { "executiveCommittee.president": memberObjectId },
      { "executiveCommittee.secretary": memberObjectId },
      { "executiveCommittee.treasurer": memberObjectId },
    ],
  };
}
