import { ENV, DELETE_DATA_MESSAGE, INVALID_ID } from "../../../constant/index.js";
import { deleteFile } from "../db/index.js";

const deleteController = async (req, res) => {
    try {
        const file = await deleteFile(req.params.id, req.user.id);
        if (!file) {
            return res.status(404).json({ status: false, message: INVALID_ID });
        }
        return res.status(200).json({ status: true, message: DELETE_DATA_MESSAGE });
    } catch (error) {
        return res.status(500).json({ status: false, message: error.message });
    }
}

export default deleteController