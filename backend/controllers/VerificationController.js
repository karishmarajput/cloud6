const crypto = require('crypto');
const fs = require("fs")
const PDFParser = require("pdf2json")
const PDFExtract = require("pdf.js-extract").PDFExtract;
const pdfExtract = new PDFExtract();
const options = {};
const pdfParser = new PDFParser()
function calculatePDFHash(filePath, algorithm = 'sha256') {
    const hash = crypto.createHash(algorithm);
    const fileStream = fs.createReadStream(filePath);

    return new Promise((resolve, reject) => {
        fileStream.on('data', (data) => {
            hash.update(data);
        });

        fileStream.on('end', () => {
            const fileHash = hash.digest('hex');
            resolve(fileHash);
        });

        fileStream.on('error', (error) => {
            reject(error);
        });
    });
}
function findSeatNumber(data, searchString) {
    for (const item of data) {
      if (item.str.includes(searchString)) {
        const seatNumber = item.str.split(':')[1].trim();
        return seatNumber;
      }
    }
    return null;
  }
exports.UploadPDF = async(req,res) => {
    const base_path = 'C:/Users/Dell/Desktop/Poolygon Test/certificateVerifier/backend/pdf_upload/' + req.file.filename
    console.log(base_path)
    const hash = await calculatePDFHash(base_path)
    console.log(hash)
    pdfExtract.extract('C:/Users/Dell/Desktop/Poolygon Test/certificateVerifier/backend/pdf_upload/' + req.file.filename,options,(err,data) => {
        if (err) return console.log(err);
        const searchString = 'CertificateID';
        const seatNumber = findSeatNumber(data["pages"][0]["content"], searchString);
    
        if (seatNumber !== null) {
        console.log(`Seat Number: ${seatNumber}`);
        
        res.status(200).json({message : "Done"})
        
        } else {
        console.log('Seat Number not found.');
        res.status(400).json({message : "Could not find id please upload again"})
        }
    })
}