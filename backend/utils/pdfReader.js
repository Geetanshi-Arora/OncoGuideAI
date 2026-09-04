const fs = require("fs");
const { PDFParse } = require("pdf-parse");
async function readPDF(filePath) {
    try {
        const buffer = fs.readFileSync(filePath);
        const parser = new PDFParse({
            data: buffer
        });
        const result = await parser.getText();
        await parser.destroy();
        return result.text;
    } catch (error) {
        console.error("Error reading PDF:", error);
        return "";
    }
}

module.exports = readPDF;