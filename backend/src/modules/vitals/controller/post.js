import { addData } from "../db/index.js";
import { ENV, POST_DATA_MESSAGE } from "../../../constant/index.js";
import { resolveFamilyMember } from "../../../helper/resolveFamilyMember.js";

const postController = async (req, res) => {
    try {
        const { bp, sugar, weight, notes, date } = req.body;
        const familyMemberId = req.body.familyMemberId || null;
        if (familyMemberId && !(await resolveFamilyMember(familyMemberId, req.user.id))) {
            return res.status(400).json({ status: false, message: "Invalid family member." });
        }

        const data = await addData({
            userId: req.user.id,
            familyMemberId,
            bp,
            sugar,
            weight,
            notes,
            date: date || Date.now()
        })

        return res.status(201).json({
            status: true,
            message: POST_DATA_MESSAGE,
            data: data
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
}

export default postController