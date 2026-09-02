let biopsyUploaded = false;
let ihcUploaded = false;
let imagingUploaded = false;
let cbcUploaded = false;
let lftUploaded = false;
let rftUploaded = false;
let echoUploaded = false;
let biopsyUpload=document.querySelector("#biopsy-upload");
let biopsyFiles = [];
let biopsyStatus = document.querySelector("#biopsyStatus");
let biopsyCount = document.querySelector("#biopsyCount");
let biopsyFileList = document.querySelector("#biopsyFiles");
let biopsyCheck=document.querySelector("#biopsyCheck");
let analyzeBtn = document.querySelector("#but");
biopsyUpload.addEventListener("change", (event) => {
   let files = event.target.files;
   for(let file of files){
    biopsyFiles.push(file);
    console.log(file);
   }
   if(biopsyFiles.length>0){
   biopsyStatus.innerText = "Uploaded";
   biopsyCheck.innerHTML='<i class="fa-solid fa-check"></i>';
   biopsyCheck.style.backgroundColor="skyblue";
   biopsyUploaded =true;
   updateUploadCount();
   }
biopsyCount.innerText = biopsyFiles.length;
biopsyFileList.innerHTML = "";
 for(let file of biopsyFiles){
        biopsyFileList.innerHTML += file.name + "<br>";
    }
});
let IHCUpload=document.querySelector("#IHC-upload");
let IHCfiles=[];
let IHCStatus = document.querySelector("#IHCStatus");
let IHCCount = document.querySelector("#IHCCount");
let IHCFileList = document.querySelector("#IHCFiles");
let IHCCheck=document.querySelector("#IHCcheck");
IHCUpload.addEventListener("change", (event) => {
   let files = event.target.files;
   for(let file of files){
    IHCfiles.push(file);
    console.log(file);
   }
   if(IHCfiles.length>0){
   IHCStatus.innerText = "Uploaded";
   IHCCheck.innerHTML='<i class="fa-solid fa-check"></i>';
   IHCCheck.style.backgroundColor="skyblue";
   ihcUploaded=true;
   updateUploadCount();
   }
IHCCount.innerText =IHCfiles.length;
IHCFileList.innerHTML = "";
 for(let file of IHCfiles){
        IHCFileList.innerHTML += file.name + "<br>";
    }
});
let ScanUpload=document.querySelector("#Scan-upload");
let ScanFiles = [];
let ScanStatus = document.querySelector("#ScanStatus");
let ScanCount = document.querySelector("#ScanCount");
let ScanFileList = document.querySelector("#ScanFiles");
let scanCheck= document.querySelector("#imagingCheck");
ScanUpload.addEventListener("change", (event) => {
   let files = event.target.files;
   for(let file of files){
    ScanFiles.push(file);
    console.log(file);
   }
   if(ScanFiles.length>0){
   ScanStatus.innerText = "Uploaded";
   scanCheck.innerHTML='<i class="fa-solid fa-check"></i>';
   scanCheck.style.backgroundColor="skyblue";
   imagingUploaded=true;
   updateUploadCount();
   }
ScanCount.innerText = ScanFiles.length;
ScanFileList.innerHTML = "";
 for(let file of ScanFiles){
        ScanFileList.innerHTML += file.name + "<br>";
    }
});
let bloodUpload=document.querySelector("#blood-upload");
let bloodFiles = [];
let bloodStatus = document.querySelector("#bloodStatus");
let bloodCount = document.querySelector("#bloodCount");
let bloodFileList = document.querySelector("#bloodFiles");
bloodUpload.addEventListener("change", (event) => {
   let files = event.target.files;
   for(let file of files){
    bloodFiles.push(file);
    console.log(file);
   }
   if(bloodFiles.length>0){
   bloodStatus.innerText = "Uploaded";
   }
bloodCount.innerText = bloodFiles.length;
bloodFileList.innerHTML = "";
 for(let file of bloodFiles){
        bloodFileList.innerHTML += file.name + "<br>";
    }
});
let heartUpload=document.querySelector("#heart-upload");
let heartFiles = [];
let heartStatus = document.querySelector("#heartStatus");
let heartCount = document.querySelector("#heartCount");
let heartFileList = document.querySelector("#heartFiles");
let heartCheck=document.querySelector("#echoCheck");
heartUpload.addEventListener("change", (event) => {
   let files = event.target.files;
   for(let file of files){
    heartFiles.push(file);
    console.log(file);
   }
   if(heartFiles.length>0){
   heartStatus.innerText = "Uploaded";
   heartCheck.innerHTML='<i class="fa-solid fa-check"></i>';
   heartCheck.style.backgroundColor="skyblue";
   echoUploaded=true;
   updateUploadCount();
   }
heartCount.innerText = heartFiles.length;
heartFileList.innerHTML = "";
 for(let file of heartFiles){
        heartFileList.innerHTML += file.name + "<br>";
    }
});
bloodUpload.addEventListener("change", (event)=>{
    let files = event.target.files;
    for(let file of files){
        let fileName = file.name.toUpperCase();
        if(fileName.includes("CBC")){
            CBCcheck.style.backgroundColor = "skyblue";
            CBCcheck.innerHTML ='<i class="fa-solid fa-check"></i>';
            cbcUploaded=true;
            updateUploadCount();
        }
        if(fileName.includes("LFT")){
            LFTcheck.style.backgroundColor = "skyblue";
            LFTcheck.innerHTML ='<i class="fa-solid fa-check"></i>';
            lftUploaded=true;
            updateUploadCount();
        }
        if(fileName.includes("RFT")|| fileName.includes("KFT")){
            RFTcheck.style.backgroundColor = "skyblue";
            RFTcheck.innerHTML = '<i class="fa-solid fa-check"></i>';
            rftUploaded=true;
            updateUploadCount();
        }
    }
});
function updateUploadCount(){
    let reports = [ biopsyUploaded,ihcUploaded,imagingUploaded,cbcUploaded,lftUploaded,rftUploaded,echoUploaded];
    let count = reports.filter((report)=>{
        return report === true;
    }).length;
    document.querySelector("#vi").innerText = `${count}/7`;
    let uploadStatus = document.querySelector("#up");
    if(count === 0){
        uploadStatus.innerText = "Waiting for Uploads";
    }
    else if(count < 7){
        uploadStatus.innerText = "Uploading Reports";
    }
    else{
        uploadStatus.innerText = "All Reports Uploaded";
    }
    let analyzeBtn = document.querySelector("#but");
    if(count > 0){
        analyzeBtn.disabled = false;
    }
    else{
        analyzeBtn.disabled = true;
    }
}
let deleteButtons = document.querySelectorAll(".delete-btn");

deleteButtons.forEach((button) => {
    button.addEventListener("click", () => {
        let reportName = button.dataset.report;
        if(reportName === "biopsy"){
            biopsyFiles = [];
            biopsyStatus.innerText = "Pending";
            biopsyCount.innerText = 0;
            biopsyFileList.innerHTML = "No reports uploaded";
            biopsyCheck.innerHTML = "";
            biopsyCheck.style.backgroundColor = "";
            biopsyUploaded = false;
            updateUploadCount();
            console.log("Biopsy Report deleted");
        }
        if(reportName === "ihc"){
            IHCFiles = [];
            IHCStatus.innerText = "Pending";
            IHCCount.innerText = 0;
            IHCFileList.innerHTML = "No reports uploaded";
            IHCCheck.innerHTML = "";
            IHCCheck.style.backgroundColor = "";
            ihcUploaded = false;
            updateUploadCount();
            console.log("IHC Report deleted");
        }
        if(reportName === "scan"){
            ScanFiles = [];
            ScanStatus.innerText = "Pending";
            ScanCount.innerText = 0;
            ScanFileList.innerHTML = "No reports uploaded";
            scanCheck.innerHTML = "";
            scanCheck.style.backgroundColor = "";
            imagingUploaded = false;
            updateUploadCount();
            console.log("Imaging Report deleted");
        }
        if(reportName === "blood"){
            bloodFiles = [];
            bloodStatus.innerText = "Pending";
            bloodCount.innerText = 0;
            bloodFileList.innerHTML = "No reports uploaded";
            RFTcheck.innerHTML = "";
            LFTcheck.innerHTML = "";
            CBCcheck.innerHTML = "";
            RFTcheck.style.backgroundColor = "";
            LFTcheck.style.backgroundColor = "";
            CBCcheck.style.backgroundColor = "";
            rftUploaded=false;
            lftUploaded = false;
            cbcUploaded=false;
            updateUploadCount();
            console.log("Blood Report deleted");
        }
        if(reportName === "echo"){
            heartFiles = [];
            heartStatus.innerText = "Pending";
            heartCount.innerText = 0;
            heartFileList.innerHTML = "No reports uploaded";
            heartCheck.innerHTML = "";
            heartCheck.style.backgroundColor = "";
            echoUploaded = false;
            updateUploadCount();
            console.log("ECHO Report deleted");
        }
    });
});
analyzeBtn.addEventListener("click", async () => {
    console.log("Analyze clicked");
    let formData = new FormData();
    for (let file of biopsyFiles) {
        formData.append("biopsy", file);
    }
    for (let file of IHCfiles) {
        formData.append("ihc", file);
    }
    for (let file of ScanFiles) {
        formData.append("imaging", file);
    }
    for (let file of bloodFiles) {
        formData.append("blood", file);
    }
    for (let file of heartFiles) {
        formData.append("echo", file);
    }
    try {
        analyzeBtn.disabled = true;
        analyzeBtn.innerText = "Analyzing...";
        const response = await fetch("http://localhost:3000/api/upload", {
            method: "POST",
            body: formData
        });
        console.log("Response received", response);
         const data = await response.json();
        console.log(data);
        if (data.success) {
            sessionStorage.setItem("analysisId", data.analysisId);
            window.location.href = "analysis.html";
        }else {
            alert("Analysis failed. Please try again.");
            analyzeBtn.disabled = false;
            analyzeBtn.innerText = "Analyze";
        }
    } catch (error) {
        console.log("Error:", error);
        alert("Server Error");
        analyzeBtn.disabled = false;
        analyzeBtn.innerText = "Analyze";
    }
});