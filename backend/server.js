require("dotenv").config();
const readPDF = require("./utils/pdfReader");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const app = express();
const { GoogleGenAI } = require("@google/genai");
const analysisStore = {};
const PORT = 3000;
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

app.use(cors());
app.use(express.json());


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "uploads"));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage: storage });

app.get("/", (req, res) => {
    res.send("OncoGuide AI Backend is Running");
});

app.post("/api/upload", upload.any(), async (req, res)  => {
    const analysisId = Date.now().toString();
    analysisStore[analysisId] = {
        status: "processing",
        analysis: null
    };
    res.json({
        success: true,
        analysisId: analysisId
    });
    let allReportsText = "";
    for (const file of req.files) {
        const text = await readPDF(file.path);
        allReportsText += `${file.originalname}\n${text}\n\n`;
    }
    let response;
    const maxAttempts = 5;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            console.log(`Gemini Attempt ${attempt}...`);
            response = await ai.models.generateContent({
            model:"models/gemini-3.1-flash-lite",
            contents: `
You are an Oncology Clinical Decision Support Assistant.
Analyze the uploaded reports.
Return ONLY valid JSON.
{
  "patientSummary": "",
  "cancerType": "",
  "cancerStage": "",
  "tnmStage": "",
   "tumorSize":"",
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
    "hormonalTherapy": "",
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
11.6. For recommendedDrugs, return the COMPLETE standard treatment regimen based on the diagnosed cancer, stage and biomarkers. Include ALL chemotherapy drugs in the regimen as separate objects. If targeted therapy, hormonal therapy or immunotherapy is indicated, include ALL of those drugs as separate objects. Do NOT return only one representative drug or summarize the regimen.
Patient Reports:
${allReportsText}
`
            });
            console.log("Gemini Success");
            break;
        } catch (error) {
            console.log(`Attempt ${attempt} failed`);
            if (error.status === 503 && attempt < maxAttempts) {
                const waitTime = Math.pow(2, attempt) * 1000;
                console.log(`Gemini busy. Retrying in ${waitTime / 1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
            } else {
                console.error("Gemini API Error:", error);
                analysisStore[analysisId] = {
                    status: "failed",
                    error: error.message || "Gemini request failed."
                };
                return;
            }
        }
    }
    let analysisText = response.text.trim();
    analysisText = analysisText.replace(/```json/g, "");
    analysisText = analysisText.replace(/```/g, "");
    let analysis;
    try {
        analysis = JSON.parse(analysisText);
    } catch (err) {
        console.error("Invalid JSON returned by Gemini:");
        console.log(analysisText);
        analysisStore[analysisId] = {
            status: "failed",
            error: "Gemini returned invalid JSON."
        };
        return;
    }
    console.log("===== GEMINI ANALYSIS =====");
    console.log(JSON.stringify(analysis, null, 2));
    analysisStore[analysisId] = {
        status: "completed",
        analysis: analysis,
    };    
});
app.get("/api/status/:analysisId", (req, res) => {
    const analysis = analysisStore[req.params.analysisId];
    if (!analysis) {
        return res.status(404).json({
            success: false,
            error: "Analysis not found"
        });
    }
    res.json(analysis);
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});