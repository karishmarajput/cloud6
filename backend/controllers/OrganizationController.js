const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const csv = require("csv-parser");
const util = require("util")
const { resolve } = require("path");
const {Document} = require("docxyz")
const crypto = require('crypto');
const mammoth = require('mammoth');
const PDFServicesSdk = require('@adobe/pdfservices-node-sdk');
const nodemailer = require('nodemailer');
const {v4 : uuidv4} = require("uuid")
const ethers = require("ethers")
var convertapi = require("convertapi")('ozeDVGketrfbznX6');
require("dotenv").config()
const { convert } = require('html-to-image');

const Organization = require("../models/OrganizationModel");
const uploadFile = require("../middlewares/upload")
const User = require("../models/UserData")


const provider = new ethers.providers.JsonRpcProvider(process.env.API_URL)
const signer = new ethers.Wallet(process.env.PRIVATE_KEY,provider)
const {abi} = require("../blockchain/artifacts/contracts/Certification.sol/Certification.json");
const contractAddress = process.env.CONTRACT_ADDRESS
const contractInstance = new ethers.Contract(contractAddress,abi,signer);


function getUnixTimestampForNextMonths(numMonths) {
    const currentDate = new Date();
    const nextDate = new Date(currentDate);
    nextDate.setMonth(currentDate.getMonth() + numMonths);
    const currentUnixTimestamp = Math.floor(currentDate.getTime() / 1000);
    const nextUnixTimestamp = Math.floor(nextDate.getTime() / 1000);
    return { currentUnixTimestamp, nextUnixTimestamp };
  }
//Organization Signup
exports.signup = async(req,res,next) => {
    const {name,email,phoneNumber,password} = req.body;
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

//Organization Login
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
        jwt.sign(payload,process.env.JWT_KEY,{expiresIn : 3600},(err,token)=>{
            if (err) throw err;
            res.status(200).json({_id : org._id,name : org.name,token : token})
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({messsage : "Server error"})
    }
}

//Get Templates of a particular organization
exports.getMyTemplates = async(req,res,next) => {
    try {
        const org = await Organization.findById(req.userData.org.id);
        if(!org){
            return res.status(400).json({message : "The organization doesn't exist"});
        }
        const templates = org.templates;
        const templates_mapped = templates.map(obj => {
            const { _id, name } = obj;
            return { _id, name };
        });
        return res.status(200).json({data : templates_mapped})
    } catch (error) {
        console.error(error);
        res.status(500).json({message : "Server Error"})
    }
}

//See the public templates and his templates
/*exports.SeeAllTemplates = async(req,res,next) => {
    try {
        const org = await Organization.findById(req.userData.org.id);
        if(!org){
            return res.status(400).json({message : "The organization doesn't exist"});
        }
        const templates = org.templates;
        const templates_mapped = templates.map(obj => {
            const { _id, name } = obj;
            return { _id, name };
        });
        const templates_public = await 
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Server Error"})
    }
}*/

//Upload a template (Word)
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
                convertapi.convert('jpg',{
                    File : "./templates/"+req.file.filename
                },'doc').then(function(result){
                    result.saveFiles("./image_files")
                })
                return res.status(200).json({message : "File Uploaded Successfully.",data : result})
            }
        })
      } catch (err) {
        res.status(500).send({
          message: `Could not upload the file: ${req.file.originalname}. ${err}`,
        });
      }
};

//Get all the headers of the csv
exports.getAllTemplates = async(req,res,next) => {
    console.log('hello')
    try {
        await Organization.findById(req.userData.org.id).then((org,err)=>{
            if(org){
                console.log(org)
                console.log(org.templates)
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
//Get array of JSON objects according to the row data
function parseCSVtoJSON(csvFilePath,placeholders){
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

//Extracting text from docx file
async function extractTextFromDocx(filePath) {
    try {
        const result = await mammoth.extractRawText({path : filePath});
        return result.value;
    } catch (error) {
        throw error;
    }
}

//Using regex to count the number of placeholders in the file
function countPlaceholdersInText(text) {
    const pattern = /{{.*?}}/g;
    const matches = text.match(pattern) || [];
    return matches.map(match => match.replace(/{{|}}/g, '').trim());
}

//Calculate the PDF Hash
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

//Serializing Data
function serializeWithDelimiter(array, delimiter) {
    return array.map(item => JSON.stringify(item)).join(delimiter);
}

//Utility for saving the serialized data corresponding to the user
async function SaveUserData(data_instance,template_name){
    const UserAvailable = await User.findOne({email :  data_instance[1]["email"]});
    if(UserAvailable){
        UserAvailable.totaldata.push({data : serializeWithDelimiter(data_instance,"#") + "#"+template_name});
        const res = await UserAvailable.save()
        return res;
    }
    else{
        const NewUser = new User({_id : new mongoose.Types.ObjectId(),email :  data_instance[1]["email"]});
        NewUser.totaldata.push({data : serializeWithDelimiter(data_instance,"#") + "#" + template_name});
        const res = await NewUser.save();
        return res
    }
}
async function mergeAndSendEmail(file_path,data_instance,template_name) {
    try {
        const credentials = PDFServicesSdk.Credentials
            .servicePrincipalCredentialsBuilder()
            .withClientId("c69f66aa60dd4a718f84e509a8e5077a")
            .withClientSecret("p8e-Evegkfh66jnyj6FCqHB2S1VHgjcz8bB7")
            .build();
        const jsonDataForMerge = data_instance[0];
        const executionContext = PDFServicesSdk.ExecutionContext.create(credentials);
        const documentMerge = PDFServicesSdk.DocumentMerge;
        const documentMergeOptions = documentMerge.options;
        const options = new documentMergeOptions.DocumentMergeOptions(jsonDataForMerge, documentMergeOptions.OutputFormat.PDF);
        const documentMergeOperation = documentMerge.Operation.createNew(options);
        const input = PDFServicesSdk.FileRef.createFromLocalFile(file_path);
        documentMergeOperation.setInput(input);
        const result = await documentMergeOperation.execute(executionContext);
        const uniqueFileName = `Certificate_${uuidv4()}.pdf`;
        await result.saveAsFile('../file_buffer/'+uniqueFileName)
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
                to: data_instance[1]["email"],
                subject: 'Certificate',
                attachments: [{
                    filename: '../file_buffer/'+uniqueFileName,
                    path: '../file_buffer/'+uniqueFileName
                }],
            };
            const sendMail = util.promisify(transporter.sendMail).bind(transporter);
            const info = await sendMail(mailOptions);
            const hash = await calculatePDFHash('../file_buffer/'+uniqueFileName)
            const saved = await SaveUserData(data_instance,template_name);
            if(data_instance.length === 3){
                const res = await addDataToBlockChainWithExpiry(data_instance[0]["id"],hash,getUnixTimestampForNextMonths(data_instance[2]["expiry"]).nextUnixTimestamp)
                console.log(res)
            }
            else{
                const res = await addDataToBlockChainWithoutExpiry(data_instance[0]["id"],hash);
                console.log(res)
            }
            
            fs.unlinkSync('../backend/file_buffer/'+uniqueFileName);
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

//Utility for comparing the placeholders and attributes
function compareArraysIgnoringEmail(placeholderArray, attributeArray) {
    const cleanPlaceholder = placeholderArray.filter(attr => attr !== 'email').filter(attr => attr != 'expiry').map(attr => attr.trim());
    const cleanAttribute = attributeArray.filter(attr => attr !== 'email').filter(attr => attr != 'expiry').map(attr => attr.trim());
    const sortedPlaceholder = cleanPlaceholder.slice().sort();
    const sortedAttribute = cleanAttribute.slice().sort();
    const arraysAreEqual = JSON.stringify(sortedPlaceholder) === JSON.stringify(sortedAttribute);
    return arraysAreEqual;
}


exports.uploadCSVandSelectTemplate = async(req,res,next) => {
    const template = req.body.template_id;
    text = await extractTextFromDocx("../backend/templates/" + template)
    let placeholders = countPlaceholdersInText(text);
    let column_names = await getAttributesFromCSV("../backend/csv_data/" + req.file.filename)
    if(compareArraysIgnoringEmail(placeholders,column_names) === false){
        fs.unlinkSync("../backend/csv_data/" + req.file.filename)
        return res.status(400).json({message : "Placeholders and csv attributes do not match"})
    }
    ans = await parseCSVtoJSON("../backend/csv_data/" + req.file.filename,placeholders);
    for(var i = 0 ;i < ans.length;i++){
        await mergeAndSendEmail("../backend/templates/" + template,ans[i],template)
    }
    return res.status(200).json({message : "done"})
    
}
            