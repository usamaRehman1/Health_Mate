import { getAllFiles } from "../db/index.js";
import { ENV, GET_DATA_SUCESSFULLY } from "../../../constant/index.js";
import { resolveFamilyMember } from "../../../helper/resolveFamilyMember.js";

const getController = async (req, res) => {
    try {
        const familyMemberId = req.query.familyMemberId || null;
        if (familyMemberId && !(await resolveFamilyMember(familyMemberId, req.user.id))) {
            return res.status(400).json({ status: false, message: "Invalid family member." });
        }
        const files = await getAllFiles(req.user.id, familyMemberId);

        return res.status(200).json({
            status: true,
            count: files.length,
            message: GET_DATA_SUCESSFULLY,
            data: files
        });

    } catch (error) {

        return res.status(500).json({
            status: false,
            message: error.message
        });

    }
};

export default getController;