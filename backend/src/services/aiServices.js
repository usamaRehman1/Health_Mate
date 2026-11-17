import Groq from "groq-sdk";
import { ENV } from "../constant/index.js";

// Initialize Groq
const groq = new Groq({
    apiKey: ENV.GROQ_API_KEY,
});

export const analyzeMedicalReportWithAI = async (cloudinaryUrl) => {
    try {
        // console.log("AI anaylysis started:", cloudinaryUrl)
        if (!cloudinaryUrl) {
            throw new Error("Medical report URL is required.");
        }

        const chatCompletion = await groq.chat.completions.create({
            // Current Groq multimodal vision model
            model: "qwen/qwen3.8-27b",

            messages: [
                {
                    role: "system",
                    content: `
            You are a medical report explanation assistant.

            Your responsibility is to explain medical reports
            accurately in simple, patient-friendly language.

            IMPORTANT RULES:
            - Never invent missing medical values.
            - Never provide a confirmed diagnosis.
            - Use reference ranges provided in the report.
            - Clearly identify unreadable information.
            - Do not prescribe medication.
            - Recommend consulting a qualified doctor.
            - Distinguish potential concerns from confirmed conditions.
          `,
                },
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: `
                Carefully analyze this medical report.

                Return the following information:

                1. Report Overview
                2. Overall Health Summary
                3. Extracted Medical Parameters
                4. Abnormal Values (High, Low, Borderline)
                5. Reference Ranges and Units
                6. Simple Explanation of Abnormal Findings
                7. Possible Health Concerns
                8. Lifestyle and Dietary Suggestions
                9. Recommended Medical Follow-up
                10. Questions to Ask Your Doctor

                For every extracted parameter include:
                - Test name
                - Measured value
                - Unit
                - Reference range
                - Status (Normal, High, Low, Borderline, or Unknown)

                If a value or reference range is missing,
                return null instead of guessing.

                If the image is unclear or unreadable,
                mention it clearly.

                Return your response in valid JSON using this structure:

                {
                  "summary": "",
                  "overallStatus": "",
                  "parameters": [
                    {
                      "testName": "",
                      "value": null,
                      "unit": "",
                      "referenceRange": "",
                      "status": "",
                      "explanation": ""
                    }
                  ],
                  "abnormalFindings": [],
                  "possibleConcerns": [],
                  "recommendations": [],
                  "doctorQuestions": [],
                  "unreadableSections": [],
                  "disclaimer": "This analysis is for informational purposes only and not a substitute for professional medical advice."
                }

                Return JSON only. Do not include Markdown code fences.
              `,
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: cloudinaryUrl,
                            },
                        },
                    ],
                },
            ],

            temperature: 0.2,
            max_completion_tokens: 4096,
        });

        const aiResponse = chatCompletion.choices[0]?.message?.content;

        // console.log("AI response:", aiResponse)

        if (!aiResponse) {
            throw new Error("AI returned an empty response.");
        }

        // Parse structured JSON response
        const cleanedResponse = aiResponse
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/, "")
            .trim();

        const analysis = JSON.parse(cleanedResponse);

        return analysis;

    } catch (error) {
        console.error("Groq AI Analysis Error:", error);

        throw new Error(
            `Groq AI Processing Failed: ${error.message}`
        );
    }
};