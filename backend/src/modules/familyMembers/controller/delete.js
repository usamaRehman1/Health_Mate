import { DELETE_DATA_MESSAGE, INVALID_ID } from "../../../constant/index.js";
import { deleteFamilyMember } from "../db/index.js";

const deleteController = async (req, res) => {
  try {
    const deletedMember = await deleteFamilyMember(req.params.id, req.user.id);
    if (!deletedMember) {
      return res.status(404).json({ status: false, message: INVALID_ID });
    }

    return res.status(200).json({
      status: true,
      message: DELETE_DATA_MESSAGE,
      data: deletedMember,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

export default deleteController;
