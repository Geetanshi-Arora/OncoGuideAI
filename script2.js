const analysisId = sessionStorage.getItem("analysisId");
let boxes = document.querySelectorAll(".box");
let currentStep = 0;
let animationFinished = false;
const statusText = document.querySelector("#statusText");
const outerRing = document.querySelector("#outerRing");
const percentage = document.querySelector("#c");
const msg = document.querySelector("#d");
function completeStep(index){
    boxes[index].innerHTML = `<i class="fa-solid fa-check"></i>`;
    boxes[index].style.backgroundColor = "rgb(105, 220, 158)";
    boxes[index].style.color = "white";
    boxes[index].style.border = "none";
    updateProgress((index + 1) * 20);
}
function processingStep(index) {
    boxes[index].innerHTML = `<div class="loader"></div>`;
}
function delay(ms){
    return new Promise((resolve)=>{
        setTimeout(resolve, ms);
    });
}
async function startAnalysis(){
    for (let i = 0; i < 4; i++) {
        processingStep(i);
        await delay(3000);
        completeStep(i);
    }
     animationFinished = true;
}

function updateProgress(percent){
    percentage.innerText = `${percent}%`;
    let degree = percent * 3.6;
    outerRing.style.background = `
    conic-gradient(
        indigo 0deg ${degree}deg,
      rgb(211,180,241) ${degree}deg 360deg
)`;
if(percent === 0){
        statusText.innerText = "Waiting...";
    }
    else if(percent < 100){
        statusText.innerText = "Analyzing...";
    }
    else{
        statusText.innerText = "Completed";
        msg.innerText="AI analysis completed successfully. Your treatment report is ready."
    }
}
async function checkAnalysisStatus() {
    try {
        const response = await fetch(`http://localhost:3000/api/status/${analysisId}`);
        const data = await response.json();
        if (data.status === "completed") {
            while (!animationFinished) {
                await delay(500);
            }
            processingStep(4);
            await delay(2000);
            completeStep(4);
            sessionStorage.setItem(
                "analysis",
                JSON.stringify(data.analysis)
            );
            console.log("Analysis Completed");

            setTimeout(() => {
                window.location.href = "result.html";
            }, 1500);
            return;
        }
        if (data.status === "failed") {
            alert("AI Analysis Failed.");
            return;
        }
        setTimeout(checkAnalysisStatus, 2000);
    } catch (err) {
        console.error(err);
        setTimeout(checkAnalysisStatus, 2000);
    }
}
startAnalysis();
checkAnalysisStatus();