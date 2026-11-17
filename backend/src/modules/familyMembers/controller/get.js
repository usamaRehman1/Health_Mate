import { getFamilyMembers } from "../db/index.js";

const getController = async (req, res) => {
  try {
    const familyMembers = await getFamilyMembers(req.user.id);
    return res.status(200).json({
      status: true,
      count: familyMembers.length,
      data: familyMembers,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export default getController;
