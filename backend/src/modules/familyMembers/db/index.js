import { FamilyMemberModel } from "../model/index.js";

const addFamilyMember = async (data) => FamilyMemberModel.create(data);
const getFamilyMembers = async (userId) => FamilyMemberModel.find({ userId }).sort({ createdAt: -1 });
const deleteFamilyMember = async (id, userId) => FamilyMemberModel.findOneAndDelete({ _id: id, userId });

export { addFamilyMember, getFamilyMembers, deleteFamilyMember };