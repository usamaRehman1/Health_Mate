import { addFile } from "../db/index.js";
import { ENV, POST_DATA_MESSAGE } from "../../../constant/index.js";
import { resolveFamilyMember } from "../../../helper/resolveFamilyMember.js";

const postController = async (req, res) => {
    try {
        const familyMemberId = req.body.familyMemberId || null;
        if (familyMemberId && !(await resolveFamilyMember(familyMemberId, req.user.id))) {
            return res.status(400).json({ status: false, message: "Invalid family member." });
        }
        const file = await addFile({
            userId: req.user.id,
            familyMemberId,
            title: req.body.title,
            file: req.file
        });

        // const file = await addFile(req);

        return res.status(201).json({
            status: true,
            message: POST_DATA_MESSAGE,
            data: file
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

export default postController;