const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Organization = require("../models/OrganizationModel");
const uploadFile = require("../middlewares/upload")
const fs = require("fs")
const csv = require("csv-parser");
const multer = require("multer")
const {format} = require("util");
const util = require("util")
const { resolve } = require("path");
const { fstat } = require("fs");
const {Document} = require("docxyz")
const crypto = require('crypto');
const mammoth = require('mammoth');
const PDFServicesSdk = require('@adobe/pdfservices-node-sdk');
const nodemailer = require('nodemailer');
const {v4 : uuidv4} = require("uuid")
const ethers = require("ethers")
//const provider = new ethers.providers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/XhtLUpUoyxXM_IGhLC7TjlybZGZLyWYR")
//const signer = new ethers.Wallet("546e33a261229d700bfd6554cde9446247c9962c4f08c1a6b3a752fa32d812d7",provider)
//const {abi} = require("../blockchain/artifacts/contracts/Certification.sol/Certification.json");
//const contractAddress = "0x600403fa270d33EedaD42395a7Cd337a26a4676B"
//const contractInstance = new ethers.Contract(contractAddress,abi,signer);
exports.signup = async(req,res,next) => { 
    console.log('hello')
    const {name,email,phoneNumber,password} = req.body;
    console.log(req.body)
    try {
        let org = await Organization.findOne({email : email});
        if (org){
            return res.status(400).json({message : "Organization already exists"})
        }
        org = new Organization({
            _id : new mongoose.Types.ObjectId(),
            name : name,
            email : email,
            password : password,
            phoneNumber : phoneNumber,
            isVerified : false
        })
        const salt = await bcrypt.genSalt(10);
        org.password = await bcrypt.hash(password,salt);
        await org.save()
        .then((saved,err)=>{
            if (saved){
                return res.status(200).json({message : "Organization Created. Wait for admin verification"})
            }
            if (err){
                return res.status(400).json({message : "Could not save organization"})
            }
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message : "Error while signing up the organization"})
    }
      
}
exports.login = async(req,res,next) => {
    const {email,password} = req.body;
 
    try {
        let org = await Organization.findOne({email : email});
        if (!org){
            return res.status(400).json({message : "Organization doesn't exist"});
        }
        if (!org.isVerified){
            return res.status(401).json({message : "Organization not yet verified"})
        }
        const isMatch = await bcrypt.compare(password,org.password);

        if(!isMatch){
            return res.status(400).json({message : "Incorrect password"});
        }
        const payload = {
            org : {
                id : org._id
            }
        }
        jwt.sign(payload,"hello",{expiresIn : 3600},(err,token)=>{
            if (err) throw err;
            res.status(200).json({_id : org._id,name : org.name,token : token})
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({messsage : "Server error"})
    }
}

exports.uploadTemplate = async(req,res,next) => {
    try {
        const bool = req.body.publicBool;
        const org = await Organization.findById(req.userData.org.id);
        org.templates.push({name : req.file.filename,publicBool : bool})
        await org.save().then((result,err)=>{
            if(err){
                return res.status(400).json({message : "Could not upload"})
            }
            else{
                return res.status(200).json(result)
            }
        })
      } catch (err) {
        res.status(500).send({
          message: `Could not upload the file: ${req.file.originalname}. ${err}`,
        });
      }
};
exports.getAllTemplates = async(req,res,next) => {
    try {
        await Organization.findById(req.userData.org.id).then((org,err)=>{
            if(org){
                console.log(org)
                return res.status(200).json([org.templates])
            }
            else{
                return res.status(400).json({message : "Could not fetch the templates"})
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({message : error})
    }
}
function getAttributesFromCSV(filePath) {
    const attributes = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('headers', (headers) => {
                attributes.push(...headers);
            })
            .on('end', () => {
                resolve(attributes);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}
async function addDataToBlockChainWithExpiry(CertificateID,HashedValue,ExpiryTime){
    const res = await contractInstance.GenerateCertificate(CertificateID,HashedValue,ExpiryTime);
    return res
}
async function addDataToBlockChainWithoutExpiry(CertificateID,HashedValue){
    const res = await contractInstance.GenerateCertificateWithInfinity(CertificateID,HashedValue);
    return res
}
function parseCSVtoJSON(csvFilePath,placeholders){
    //console.log(placeholders)
    return new Promise((resolve,reject)=>{
        const jsonArray = [];
        fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data',(row) => {
            var temp = {};
            var keys = Object.keys(row);
            for (var i = 0;i < placeholders.length;i++){
                if(placeholders[i].trim() === keys[0].trim()){
                    temp[placeholders[i]] = row[keys[0]]
                }
                else{
                    temp[placeholders[i]] = row[placeholders[i]]
                }
            }
            var emailObject = {email : row["email"]}
            if(row.hasOwnProperty("expiry")){
                var expiryObject = {expiry : row["expiry"]}
                jsonArray.push([temp,emailObject,expiryObject])
            }
            else{
                jsonArray.push([temp,emailObject]);
            }


            
        })
        .on('end',() => {
            resolve(jsonArray)
        })
        .on('error',(error)=>{
            reject(error)
        })
    })
}
function extractText(file_path){
    mammoth.extractRawText({path: file_path})
    .then(function(result){
        var text = result.value; // The raw text
        var messages = result.messages;
        console.log(messages)
        console.log(text)
        return text
    })
    .catch(function(error) {
        console.error(error);
    });
}
async function extractTextFromDocx(filePath) {
    try {
        const result = await mammoth.extractRawText({path : filePath});
        return result.value;
    } catch (error) {
        throw error;
    }
}
function countPlaceholdersInText(text) {
    const pattern = /{{.*?}}/g;
    const matches = text.match(pattern) || [];
    return matches.map(match => match.replace(/{{|}}/g, '').trim());
    //return matches.length;
}
function arePlaceholdersEqual(array1,array2){
    if (array1.length !== array2.length) {
        return false;
    }
    for (let i = 0; i < array1.length; i++) {
        if (array1[i].trim() !== array2[i].trim()) {
            return false;
        }
    }
    return true;
}
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
async function mergeAndSendEmail(file_path,data_instance) {
    try {
        const credentials = PDFServicesSdk.Credentials
            .servicePrincipalCredentialsBuilder()
            .withClientId("c69f66aa60dd4a718f84e509a8e5077a")
            .withClientSecret("p8e-Evegkfh66jnyj6FCqHB2S1VHgjcz8bB7")
            .build();

        const jsonDataForMerge = data_instance[0]; // Make sure data_instance is properly defined
        const executionContext = PDFServicesSdk.ExecutionContext.create(credentials);

        const documentMerge = PDFServicesSdk.DocumentMerge;
        const documentMergeOptions = documentMerge.options;
        const options = new documentMergeOptions.DocumentMergeOptions(jsonDataForMerge, documentMergeOptions.OutputFormat.PDF);
        const documentMergeOperation = documentMerge.Operation.createNew(options);

        const input = PDFServicesSdk.FileRef.createFromLocalFile(file_path);
        documentMergeOperation.setInput(input);

        const result = await documentMergeOperation.execute(executionContext);
        const uniqueFileName = `Marksheet_${uuidv4()}.pdf`;
        await result.saveAsFile('C:/Users/Dell/Desktop/Poolygon Test/certificateVerifier/backend/file_buffer'+uniqueFileName)
        .then(async(result) => {
            const transporter = nodemailer.createTransport({
                service: 'outlook',
                auth: {
                    user: 'verifiertheoriginal@outlook.com',
                    pass: 'Verifier$321'
                }
            });
            const mailOptions = {
                from: 'verifiertheoriginal@outlook.com',
                to: data_instance[1]["email"], // Assuming data_instance has the recipient's email
                subject: 'Sem 6 Marksheet',
                attachments: [{
                    filename: 'C:/Users/Dell/Desktop/Poolygon Test/certificateVerifier/backend/file_buffer'+uniqueFileName, // Use the generated unique file name
                    path: 'C:/Users/Dell/Desktop/Poolygon Test/certificateVerifier/backend/file_buffer'+uniqueFileName // Attach the saved PDF file
                }],
            };
            const sendMail = util.promisify(transporter.sendMail).bind(transporter);
            const info = await sendMail(mailOptions);
            const hash = await calculatePDFHash('C:/Users/Dell/Desktop/Poolygon Test/certificateVerifier/backend/file_buffer'+uniqueFileName)
            console.log(hash)
            console.log(data_instance)
            /*if(data_instance.length === 3){
                const res = await addDataToBlockChainWithExpiry(data_instance[0]["id"],hash,data_instance[2]["expiry"])
                console.log(res)
            }
            else{
                const res = await addDataToBlockChainWithoutExpiry(data_instance[0]["id"],hash);
                console.log(res)
            }
            */
            fs.unlinkSync('C:/Users/Dell/Desktop/Poolygon Test/certificateVerifier/backend/file_buffer'+uniqueFileName);
        })
    } catch (err) {
        console.log('Exception encountered while executing operation', err);
    }
}
function getAttributesFromCSV(filePath) {
    let attributes = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('headers', (headers) => {
                resolve(headers)
                attributes.push(...headers);
            })
            .on('end', () => {
                resolve(attributes);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}
function compareArraysIgnoringEmail(placeholderArray, attributeArray) {
    // Remove "email" attribute from both arrays and trim other elements
    const cleanPlaceholder = placeholderArray.filter(attr => attr !== 'email').filter(attr => attr != 'expiry').map(attr => attr.trim());
    const cleanAttribute = attributeArray.filter(attr => attr !== 'email').filter(attr => attr != 'expiry').map(attr => attr.trim());

    // Sort the arrays and compare
    const sortedPlaceholder = cleanPlaceholder.slice().sort();
    const sortedAttribute = cleanAttribute.slice().sort();

    // Check if the arrays are equal
    const arraysAreEqual = JSON.stringify(sortedPlaceholder) === JSON.stringify(sortedAttribute);

    return arraysAreEqual;
}


exports.uploadCSVandSelectTemplate = async(req,res,next) => {
    const template = req.body.template_id;
    //console.log(req.file.filename);
    text = await extractTextFromDocx("C:/Users/Dell/Desktop/Poolygon Test/certificateVerifier/backend/templates/" + template)
    let placeholders = countPlaceholdersInText(text);
    let column_names = await getAttributesFromCSV("C:/Users/Dell/Desktop/Poolygon Test/certificateVerifier/backend/csv_data/" + req.file.filename)
    if(compareArraysIgnoringEmail(placeholders,column_names) === false){
        fs.unlinkSync("C:/Users/Dell/Desktop/Poolygon Test/certificateVerifier/backend/csv_data/" + req.file.filename)
        return res.status(400).json({message : "Placeholders and csv attributes do not match"})
    }
    ans = await parseCSVtoJSON("C:/Users/Dell/Desktop/Poolygon Test/certificateVerifier/backend/csv_data/" + req.file.filename,placeholders);
    console.log(ans)
    await mergeAndSendEmail("C:/Users/Dell/Desktop/Poolygon Test/certificateVerifier/backend/templates/" + template,ans[0])
    return res.status(200).json({message : "done"})
    
}
            