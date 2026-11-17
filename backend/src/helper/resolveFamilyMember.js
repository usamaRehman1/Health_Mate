import mongoose from "mongoose";
import { FamilyMemberModel } from "../modules/familyMembers/model/index.js";

const resolveFamilyMember = async (familyMemberId, userId) => {
  if (!familyMemberId) {
    return null;
  }

  if (!mongoose.Types.ObjectId.isValid(familyMemberId)) {
    return false;
  }

  return FamilyMemberModel.findOne({ _id: familyMemberId, userId });
};

export { resolveFamilyMember };