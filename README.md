# OncoGuide AI

OncoGuide AI is an AI-powered clinical report analysis platform designed to help healthcare professionals review multiple oncology reports as one connected clinical picture.

The system accepts reports such as histopathology, immunohistochemistry (IHC), CT scans, blood investigations, and pathology reports. It extracts relevant information and uses Google Gemini AI to generate organized clinical insights through a user-friendly dashboard.

> **Important:** OncoGuide AI is a decision-support prototype. It does not replace professional medical judgment, diagnosis, or treatment planning.

---

## Problem Statement

An oncology patient may have several reports containing important information about diagnosis, biomarkers, imaging findings, and laboratory investigations.

These reports are often reviewed separately, making the process:

* Time-consuming
* Difficult to organize
* Prone to missed connections
* Harder to summarize into one clinical picture

OncoGuide AI brings these reports together and converts scattered medical information into clear, structured insights for easier review.

---

## Key Features

* Secure user signup and login
* Supabase-based authentication
* Multiple medical report uploads
* Support for PDF medical reports
* Automatic text extraction from uploaded reports
* AI-powered report analysis using Google Gemini
* Combined analysis of multiple oncology reports
* Structured clinical summary
* Identification of important findings
* Highlighting of biomarkers and imaging observations
* User-friendly clinical dashboard
* Previous analysis and report management

---

## How It Works

1. The user creates an account or logs in.
2. The user uploads one or more oncology reports.
3. The reports are temporarily received by the Node.js backend.
4. Text is extracted from each uploaded PDF.
5. The extracted information is sent to Google Gemini AI.
6. Gemini analyses the reports together.
7. The system converts the response into structured clinical insights.
8. The final results are displayed on the results page.

### Application Workflow

```text
Doctor / Healthcare Professional
              ↓
       Upload Medical Reports
              ↓
      Frontend User Interface
              ↓
       Node.js + Express API
              ↓
         PDF Text Extraction
              ↓
         Google Gemini AI
              ↓
   Structured Clinical Insights
              ↓
       Results and Dashboard
```

---

## Technology Stack

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js

### Database and Authentication

* Supabase
* Supabase Authentication
* PostgreSQL

### Document Processing

* Multer
* PDF text extraction

### Artificial Intelligence

* Google Gemini API

### Integration and Configuration

* REST APIs
* CORS
* dotenv
* Environment variables

---

## Project Structure

```text
OncoGuide-AI/
│
├── server.js
├── package.json
├── package-lock.json
├── .env
├── .gitignore
│
├── routes/
│   ├── auth routes
│   ├── upload routes
│   └── analysis routes
│
├── services/
│   ├── Gemini integration
│   └── report processing
│
├── uploads/
│   └── temporary uploaded reports
│
├── public/
│   ├── HTML files
│   ├── CSS files
│   ├── JavaScript files
│   └── images
│
└── README.md
```

> The exact folder structure may differ depending on the current version of the project.

---

## Node.js Requirements

Before running the project, make sure the following are installed:

* Node.js
* npm

Check whether they are installed:

```bash
node --version
npm --version
```

If these commands display version numbers, Node.js and npm are installed successfully.

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Geetanshi-Arora/OncoGuide-AI.git
```

### 2. Open the Project Folder

```bash
cd OncoGuide-AI
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Install the Additional Supabase Package

```bash
npm install @supabase/supabase-js
```

---

## Environment Variables

Create a `.env` file in the main project folder.

Add the required configuration values:

```env
PORT=5000

GEMINI_API_KEY=your_google_gemini_api_key

SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace the placeholder values with your actual API credentials.

> Never upload the `.env` file to GitHub.

Add it to `.gitignore`:

```gitignore
.env
node_modules/
uploads/
```

If your project uses different environment-variable names, use the exact names referenced in your JavaScript files.

---

## Run the Backend

Start the Node.js backend with:

```bash
node server.js
```

After the server starts successfully, the terminal should display a message showing the local server address.

For example:

```text
Server running on http://localhost:5000
```

Open the displayed address in your browser.

---

## Supabase Setup

1. Create a project in Supabase.
2. Open **Project Settings**.
3. Go to the **API** section.
4. Copy the following values:

   * Project URL
   * Anon public key
5. Add these values to your `.env` file.
6. Open **Authentication → Providers**.
7. Make sure email authentication is enabled.
8. Configure the required redirect URLs if email confirmation is enabled.

Authentication users can be viewed under:

```text
Supabase Dashboard → Authentication → Users
```

Supabase automatically manages authentication data, so a separate custom users table is not required unless the application needs additional profile information.

---

## Supported Reports

The prototype can work with reports such as:

* Histopathology reports
* Immunohistochemistry reports
* CT scan reports
* Blood investigation reports
* Breast pathology reports
* Lung pathology reports
* Other relevant oncology reports in PDF format

---

## Example Clinical Output

The generated result may contain:

* Patient and case overview
* Primary diagnosis
* Histopathology findings
* IHC and biomarker findings
* Imaging observations
* Important blood investigations
* Detected clinical relationships
* Missing or unavailable information
* Points requiring medical review

The final output depends on the information available in the uploaded documents.

---

## Security and Privacy Considerations

For a production healthcare system, the following should be implemented:

* Encryption of sensitive patient information
* Secure report storage
* Role-based access control
* Strict database access policies
* Supabase Row Level Security
* Automatic deletion of temporary files
* Audit logs
* Patient consent management
* De-identification of medical documents
* Compliance with applicable healthcare and data-protection laws

Do not use identifiable real-patient data during public demonstrations unless appropriate consent and security measures are in place.

---

## Current Limitations

* AI-generated content may contain inaccuracies.
* Output quality depends on the clarity of uploaded reports.
* Scanned PDFs may require OCR support.
* The system is not a certified medical device.
* Clinical findings must be verified by a qualified healthcare professional.
* The prototype should not be used independently for diagnosis or treatment.

---

## Future Scope

* OCR support for scanned and handwritten reports
* Integration with hospital information systems
* FHIR and electronic health record integration
* Support for additional cancer types
* Multilingual report analysis
* Visual disease-progression timelines
* Treatment-response tracking
* Role-based doctor and administrator dashboards
* Improved privacy and compliance controls
* Explainable AI with direct references to report sections
* Exportable clinical summaries

---

## Team

Developed as a healthcare AI hackathon project to demonstrate how artificial intelligence can help organize and connect information from multiple oncology reports.

---

## Disclaimer

OncoGuide AI is an educational and hackathon prototype. It is not intended to provide medical advice, make a diagnosis, recommend treatment, or replace a qualified healthcare professional.

All AI-generated findings must be independently reviewed and verified by an authorized medical professional.
