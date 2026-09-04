const analysis = JSON.parse(sessionStorage.getItem("analysis"));
if (!analysis) {
    alert("No analysis found.");
    window.location.href = "upload.html";
}
console.log(analysis);
document.getElementById("patientSummary").textContent =analysis.patientSummary;
document.getElementById("cancerType").textContent =analysis.cancerType;
document.getElementById("clinicalStage").textContent =analysis.cancerStage;
document.getElementById("tnmStage").textContent =analysis.tnmStage;

const findingsList = document.getElementById("importantFindings");
analysis.importantFindings.forEach((finding) => {
    const li = document.createElement("li");
    li.textContent = finding;
    findingsList.appendChild(li);
});

document.getElementById("er").textContent =analysis.biomarkers.ER;
document.getElementById("pr").textContent =analysis.biomarkers.PR;
document.getElementById("her2").textContent =analysis.biomarkers.HER2;
document.getElementById("ki67").textContent =analysis.biomarkers.Ki67;
document.getElementById("grade").textContent =analysis.biomarkers.histologicalGrade;
document.getElementById("others").textContent =
    analysis.biomarkers.others.length > 0
        ? analysis.biomarkers.others.join(", ")
        : "Not Available";

function applyBiomarkerColor(element, value) {
    const text = value.toLowerCase();
    if (text.includes("positive")) {
        element.classList.add("positive");
    }
    else if (text.includes("negative")) {
        element.classList.add("negative");
    }
    else {
        element.classList.add("warning");
    }
}
applyBiomarkerColor(
    document.getElementById("er"),
    analysis.biomarkers.ER
);
applyBiomarkerColor(
    document.getElementById("pr"),
    analysis.biomarkers.PR
);
applyBiomarkerColor(
    document.getElementById("her2"),
    analysis.biomarkers.HER2
);
applyBiomarkerColor(
    document.getElementById("ki67"),
    analysis.biomarkers.Ki67
);

const pathwayList = document.getElementById("treatmentPathway");
analysis.treatmentPathway.forEach((item) => {
    const li = document.createElement("li");
    const heading = document.createElement("h4");
    heading.textContent = item.step;
    const reason = document.createElement("p");
    reason.textContent = item.reason;
    li.appendChild(heading);
    li.appendChild(reason);
    pathwayList.appendChild(li);
});

const drugsBody = document.getElementById("recommendedDrugsBody");
analysis.recommendedDrugs.forEach((drug) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${drug.drugName}</td>
        <td>${drug.drugClass}</td>
        <td>${drug.purpose}</td>
        <td>${drug.reason}</td>
        <td>${drug.route}</td>
        <td>${
            drug.commonSideEffects?.length
                ? drug.commonSideEffects.join(", ")
                : "Not Available"
        }</td>
    `;
    drugsBody.appendChild(row);
});

const durationBody = document.getElementById("durationBody");

const durations = [
    ["Chemotherapy", analysis.estimatedTreatmentDuration.chemotherapy],
    ["Surgery Recovery", analysis.estimatedTreatmentDuration.surgeryRecovery],
    ["Radiation Therapy", analysis.estimatedTreatmentDuration.radiationTherapy],
    ["Immunotherapy", analysis.estimatedTreatmentDuration.immunotherapy],
    ["Hormonal Therapy", analysis.estimatedTreatmentDuration.hormonalTherapy]
];
durations.forEach(([treatment, duration]) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${treatment}</td>
        <td>${duration || "Not Available"}</td>
    `;
    durationBody.appendChild(row);
});

const favorableList = document.getElementById("favorableFactors");
const unfavorableList = document.getElementById("unfavorableFactors");
analysis.prognosticFactors.favorable.forEach((factor) => {
    const li = document.createElement("li");
    li.textContent = factor;
    favorableList.appendChild(li);
});
analysis.prognosticFactors.unfavorable.forEach((factor) => {
    const li = document.createElement("li");
    li.textContent = factor;
    unfavorableList.appendChild(li);
});
document.getElementById("additionalNotes").textContent = analysis.additionalNotes || "Not Available";
document.getElementById("confidenceLevel").textContent =(analysis.confidenceLevel || "Not Available").toUpperCase();