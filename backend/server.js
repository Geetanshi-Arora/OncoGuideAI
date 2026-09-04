require("dotenv").config();

const readPDF = require("./utils/pdfReader");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");

const app = express();

const { GoogleGenAI } = require("@google/genai");

const analysisStore = {};

const PORT = 3000;

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SUPABASE_BUCKET =
    process.env.SUPABASE_BUCKET || "onco-reports";

// =====================================
// MIDDLEWARE
// =====================================

app.use(cors());
app.use(express.json());

// =====================================
// SUPABASE CONFIGURATION CHECK
// =====================================

if (
    !process.env.SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
) {
    console.warn(
        "WARNING: Supabase environment variables are missing."
    );
}

// =====================================
// MULTER TEMPORARY STORAGE
// =====================================

const tempUploadDir = path.join(__dirname, "temp-uploads");

if (!fs.existsSync(tempUploadDir)) {
    fs.mkdirSync(tempUploadDir, {
        recursive: true
    });
}

console.log(
    "Temporary upload directory:",
    tempUploadDir
);

const upload = multer({
    dest: tempUploadDir
});

// =====================================
// HOME
// =====================================

app.get("/", (req, res) => {

    res.send("OncoGuide AI Backend is Running");

});

// =====================================
// UPLOAD REPORTS
// =====================================

app.post("/api/upload", upload.any(), async (req, res) => {

    try {

        console.log("\n==============================");
        console.log("UPLOAD REQUEST RECEIVED");
        console.log("==============================");

        // Check files
        if (!req.files || req.files.length === 0) {

            console.log("No files received.");

            return res.status(400).json({
                success: false,
                error: "No files were uploaded."
            });

        }

        console.log(
            "Number of files:",
            req.files.length
        );

        // =====================================
        // VERIFY UPLOADED FILES
        // =====================================

        for (const file of req.files) {

            console.log("--------------------------------");
            console.log(
                "Original name:",
                file.originalname
            );
            console.log(
                "Filename:",
                file.filename
            );
            console.log(
                "Path:",
                file.path
            );
            console.log(
                "Size:",
                file.size
            );
            console.log(
                "Mimetype:",
                file.mimetype
            );
            console.log("--------------------------------");

            if (!fs.existsSync(file.path)) {

                console.error(
                    "Uploaded file does not exist:",
                    file.path
                );

                return res.status(500).json({
                    success: false,
                    error:
                        `Uploaded file was not saved: ${file.originalname}`
                });

            }

            if (file.size === 0) {

                console.error(
                    "Uploaded file is empty:",
                    file.path
                );

                return res.status(400).json({
                    success: false,
                    error:
                        `Uploaded file is empty: ${file.originalname}`
                });

            }

        }

        // =====================================
        // CREATE ANALYSIS ID
        // =====================================

        const analysisId = Date.now().toString();

        analysisStore[analysisId] = {

            status: "processing",

            analysis: null

        };

        // Send response immediately
        res.json({

            success: true,

            analysisId: analysisId

        });

        // =====================================
        // READ PDF FILES
        // =====================================

        let allReportsText = "";

        const uploadedReportPaths = [];

        for (const file of req.files) {

            try {

                console.log("--------------------------------");
                console.log(
                    "Processing:",
                    file.originalname
                );
                console.log(
                    "Temporary path:",
                    file.path
                );
                console.log(
                    "Size:",
                    file.size
                );
                console.log(
                    "Mimetype:",
                    file.mimetype
                );
                console.log("--------------------------------");

                // =====================================
                // UPLOAD PDF TO SUPABASE STORAGE
                // =====================================

                const fileBuffer =
                    fs.readFileSync(file.path);

                const safeFileName =
                    path
                        .basename(file.originalname)
                        .replace(
                            /[^a-zA-Z0-9._-]/g,
                            "_"
                        );

                const storagePath =
                    `${analysisId}/${Date.now()}-${safeFileName}`;

                console.log(
                    "Uploading to Supabase:",
                    storagePath
                );

                const {
                    data: uploadData,
                    error: uploadError
                } =
                    await supabase.storage
                        .from(SUPABASE_BUCKET)
                        .upload(
                            storagePath,
                            fileBuffer,
                            {
                                contentType:
                                    file.mimetype ||
                                    "application/pdf",

                                upsert: false
                            }
                        );

                if (uploadError) {

                    console.error(
                        "SUPABASE UPLOAD ERROR:",
                        uploadError
                    );

                    throw new Error(
                        `Failed to upload ${file.originalname} to Supabase: ${uploadError.message}`
                    );
                }

                console.log(
                    "Supabase upload successful:",
                    uploadData.path
                );

                uploadedReportPaths.push(
                    uploadData.path
                );

                // =====================================
                // READ PDF FROM TEMPORARY FILE
                // =====================================

                console.log(
                    `Reading PDF: ${file.originalname}`
                );

                const text =
                    await readPDF(file.path);

                console.log(
                    `PDF processed: ${file.originalname}`
                );

                allReportsText +=
                    `${file.originalname}\n${text}\n\n`;

            } catch (error) {

                console.error(
                    "PDF / SUPABASE PROCESSING ERROR:",
                    error
                );

                analysisStore[analysisId] = {

                    status: "failed",

                    error:
                        `Could not process ${file.originalname}: ${error.message}`

                };

                return;

            } finally {

                // =====================================
                // DELETE TEMPORARY LOCAL FILE
                // =====================================

                try {

                    if (fs.existsSync(file.path)) {

                        fs.unlinkSync(file.path);

                        console.log(
                            "Temporary file deleted:",
                            file.path
                        );

                    }

                } catch (cleanupError) {

                    console.error(
                        "TEMP FILE CLEANUP ERROR:",
                        cleanupError
                    );

                }

            }

        }

        analysisStore[analysisId].uploadedFiles =
            uploadedReportPaths;

        // =====================================
        // CHECK EXTRACTED TEXT
        // =====================================

        if (!allReportsText.trim()) {

            console.error(
                "No text extracted from reports."
            );

            analysisStore[analysisId] = {

                status: "failed",

                error:
                    "No readable text could be extracted from the uploaded reports."

            };

            return;

        }

        console.log(
            "Total extracted text length:",
            allReportsText.length
        );

        // =====================================
        // GEMINI ANALYSIS
        // =====================================

        let response;

        const maxAttempts = 5;

        for (
            let attempt = 1;
            attempt <= maxAttempts;
            attempt++
        ) {

            try {

                console.log(
                    `Gemini Attempt ${attempt}...`
                );

                response =
                    await ai.models.generateContent({

                        // KEEPING YOUR WORKING GITHUB MODEL
                        model:
                            "models/gemini-3.1-flash-lite",

                        contents: `

You are an Oncology Clinical Decision Support Assistant.

Analyze the uploaded reports.

Return ONLY valid JSON.

{
  "patientSummary": "",
  "cancerType": "",
  "cancerStage": "",
  "tnmStage": "",
  "tumorSize": "",
  "importantFindings": [],
  "biomarkers": {
    "ER": "",
    "PR": "",
    "HER2": "",
    "Ki67": "",
    "histologicalGrade": "",
    "others": []
  },
  "treatmentPathway": [
    {
      "step": "",
      "reason": ""
    }
  ],
  "recommendedDrugs": [
    {
      "drugName": "",
      "drugClass": "",
      "purpose": "",
      "reason": "",
      "route": "",
      "commonSideEffects": []
    }
  ],
  "estimatedTreatmentDuration": {
    "surgeryRecovery": "",
    "chemotherapy": "",
    "radiationTherapy": "",
    "immunotherapy": "",
    "hormonalTherapy": ""
  },
  "prognosticFactors": {
    "favorable": [],
    "unfavorable": []
  },
  "additionalNotes": "",
  "confidenceLevel": ""
}

Rules:

1. Extract patient information ONLY from the uploaded reports.

2. Never invent findings that are not present in the reports.

3. If cancer type, stage or biomarkers are missing, write "Not Available".

4. For treatmentPathway, recommendedDrugs and estimatedTreatmentDuration, use standard evidence-based oncology guidelines based on the extracted diagnosis, stage and biomarkers.

5. Every treatment step must include a reason.

6. Every recommended drug must include its purpose, reason, route and common side effects.

7. Estimated treatment duration should be approximate and based on standard clinical practice.

8. Mention in the duration note that treatment duration may vary depending on the patient's condition and the treating oncologist's decision.

9. If there is insufficient information to recommend treatment, write "Not Enough Information".

10. Return ONLY valid JSON. No markdown. No explanations.

11. For recommendedDrugs, return the COMPLETE standard treatment regimen based on the diagnosed cancer, stage and biomarkers.

12. Include ALL chemotherapy drugs in the regimen as separate objects.

13. If targeted therapy, hormonal therapy or immunotherapy is indicated, include ALL of those drugs as separate objects.

14. Do NOT return only one representative drug or summarize the regimen.

Patient Reports:

${allReportsText}

`

                    });

                console.log(
                    "Gemini Success"
                );

                break;

            } catch (error) {

                console.log(
                    `Attempt ${attempt} failed`
                );

                console.error(
                    "Gemini error:",
                    error
                );

                if (
                    error.status === 503 &&
                    attempt < maxAttempts
                ) {

                    const waitTime =
                        Math.pow(2, attempt) * 1000;

                    console.log(
                        `Gemini busy. Retrying in ${waitTime / 1000} seconds...`
                    );

                    await new Promise(
                        resolve =>
                            setTimeout(
                                resolve,
                                waitTime
                            )
                    );

                } else {

                    analysisStore[analysisId] = {

                        status: "failed",

                        error:
                            error.message ||
                            "Gemini request failed."

                    };

                    return;

                }

            }

        }

        // =====================================
        // CHECK GEMINI RESPONSE
        // =====================================

        if (!response) {

            analysisStore[analysisId] = {

                status: "failed",

                error:
                    "No response received from Gemini."

            };

            return;

        }

        // =====================================
        // CLEAN RESPONSE
        // =====================================

        let analysisText =
            response.text.trim();

        analysisText =
            analysisText.replace(
                /```json/g,
                ""
            );

        analysisText =
            analysisText.replace(
                /```/g,
                ""
            );

        analysisText =
            analysisText.trim();

        // =====================================
        // PARSE JSON
        // =====================================

        let analysis;

        try {

            analysis =
                JSON.parse(analysisText);

        } catch (err) {

            console.error(
                "Invalid JSON returned by Gemini:"
            );

            console.log(
                analysisText
            );

            analysisStore[analysisId] = {

                status: "failed",

                error:
                    "Gemini returned invalid JSON."

            };

            return;

        }

        // =====================================
        // FINAL RESULT
        // =====================================

        console.log(
            "===== GEMINI ANALYSIS ====="
        );

        console.log(
            JSON.stringify(
                analysis,
                null,
                2
            )
        );

        analysisStore[analysisId] = {

            status: "completed",

            analysis: analysis

        };

        console.log(
            `Analysis ${analysisId} completed successfully.`
        );

    } catch (error) {

        console.error(
            "UPLOAD / ANALYSIS ERROR:",
            error
        );

    }

});

// =====================================
// ANALYSIS STATUS
// =====================================

app.get(
    "/api/status/:analysisId",
    (req, res) => {

        const analysis =
            analysisStore[
                req.params.analysisId
            ];

        if (!analysis) {

            return res.status(404).json({

                success: false,

                error:
                    "Analysis not found"

            });

        }

        res.json(analysis);

    }
);

// =====================================
// START SERVER
// =====================================

app.listen(PORT, () => {

    console.log(
        `Server is running on port ${PORT}`
    );

});
