import { addFamilyMember } from "../db/index.js";

const postController = async (req, res) => {
  try {
    const { name, relation } = req.body;
    if (typeof name !== "string" || !name.trim() || typeof relation !== "string" || !relation.trim()) {
      return res.status(400).json({
        status: false,
        message: "Name and relation are required.",
      });
    }

    const familyMember = await addFamilyMember({
      userId: req.user.id,
      name: name.trim(),
      relation: relation.trim(),
    });

    return res.status(201).json({
      status: true,
      message: "Family member added successfully.",
      data: familyMember,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export default postController;