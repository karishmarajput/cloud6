const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/AdminModel");
const Organization = require("../models/OrganizationModel")
const nodemailer = require('nodemailer');
exports.signup = async(req,res,next) => { 
    const {email,password} = req.body;
    try {
        let admin = await Admin.findOne({email : email});
        if (admin){
            return res.status(400).json({message : "User already exists"})
        }
        admin = new Admin({
            _id: new mongoose.Types.ObjectId(),
            email : email,
            password : password
        })
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(password,salt);
        await admin.save()
        .then((saved,err)=>{
            if (saved){
                return res.status(200).json({message : "Admin Created"})
            }
            if (err){
                return res.status(400).json({message : "Could not save admin"})
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Error while signing up the admin"})
    }
      
}
exports.login = async(req,res,next) => {
    const {email,password} = req.body;
    console.log(req.body)
    try {
        let admin = await Admin.findOne({email : email});
        if (!admin){
            return res.status(400).json({message : "Admin doesn't exist"});
        }
        const isMatch = await bcrypt.compare(password,admin.password);
        if(!isMatch){
            return res.status(400).json({message : "Incorrect password"});
        }
        const payload = {
            admin : {
                id : admin._id
            }
        }
        jwt.sign(payload,"hello",{expiresIn : 3600},(err,token)=>{
            if (err) throw err;
            res.status(200).json({token})
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({messsage : "Server error"})
    }
}
exports.getUnverifiedOrganizations = async(req,res,next) =>{
    let data = await Organization.find({ isVerified: false });
    console.log(data)
    if (data){
        return res.status(200).json({data})
    }
    else{
        return res.status(400).json({message : "Could not fetch the data"})
    }
}
exports.getVerifiedOrganizations = async(req,res,next) =>{
    let data = await Organization.find({ isVerified: true });
    console.log(data)
    if (data){
        return res.status(200).json({data})
    }
    else{
        return res.status(400).json({message : "Could not fetch the data"})
    }
}

exports.verifyOrganization = async(req,res,next) => {
    const organizationId = req.params.organizationId;
    try {
        const organization = await Organization.findById(organizationId);
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }
        organization.isVerified = true;
        await organization.save();
        const transporter = nodemailer.createTransport({ 
            service: 'outlook',
            auth: {
                user: 'verifiertheoriginal@outlook.com',
                pass: 'Verifier$321'
            }
          });
      
          const mailOptions = {
            from: 'verifiertheoriginal@outlook.com',
            to: organization.email, 
            subject: 'Organization Verification',
            text: 'Your organization has been successfully verified by Admin.'
          };
      
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error('Error sending email:', error);
            } else {
              console.log('Email sent:', info.response);
            }
          });
        res.status(200).json({ message: 'Verification status changed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
exports.deleteOrganization = async (req, res, next) => {
    const organizationId = req.params.organizationId;
    console.log(organizationId)
    try {
      const organization = await Organization.findByIdAndDelete(organizationId);
      if (!organization) {
        return res.status(404).json({ message: 'Organization not found' });
      }
  
      res.status(200).json({ message: 'Organization deleted successfully' });
    } catch (error) {
      console.error(error); // Log the error for debugging purposes
      res.status(500).json({ message: 'Error deleting organization', error: error.message });
    }
  };
  function deserializeWithDelimiter(dataString, delimiter) {
    const dataArray = dataString.split(delimiter);
    const templateId = dataArray.pop();
    const objectsArray = dataArray.map(jsonString => JSON.parse(jsonString));
    return  [templateId, objectsArray];
}
async function createPDF(file_path,data_instance,template_id){
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
        const uniqueFileName = `Marksheet_${uuidv4()}.pdf`;
        await result.saveAsFile('C:/Users/Dell/Desktop/Poolygon Test/certificateVerifier/backend/emailbuf/'+uniqueFileName)
        .then((result) =>{})
        return 'C:/Users/Dell/Desktop/Poolygon Test/certificateVerifier/backend/emailbuf/'+uniqueFileName
    } catch (error) {
        console.log('Exception encountered while executing operation', error);
    }
}
exports.GetDetails = async(req,res) => {
    const UserPresent = await User.findOne({email : req.body.email});
    if (!UserPresent){
        return res.status(400).json({message : "User not present"})
    }
    else{
        const file_names = []
        const data = UserPresent.totaldata;
        for (var i = 0;i < data.length;i++){
            const [template_id,ObjectArray] = deserializeWithDelimiter(data[i].data,"#");
            const file_name = await createPDF('C:/Users/Dell/Desktop/Poolygon Test/certificateVerifier/backend/templates/'+template_id,ObjectArray,template_id)
            file_names.push(file_name);
            console.log(file_names)
        }
        var zipper = new zip();

        for (var i = 0 ;i < file_names.length;i++){
            zipper.addLocalFile(file_names[i])
        }
        const uniqueZipID = uuidv4();
        zipper.writeZip("zipped_files/"+uniqueZipID +".zip");
        const transporter = nodemailer.createTransport({
            service: 'outlook',
            auth: {
                user: 'verifiertheoriginal@outlook.com',
                pass: 'Verifier$321'
            }
        });
        const mailOptions = {
            from: 'verifiertheoriginal@outlook.com',
            to: req.body.email, // Assuming data_instance has the recipient's email
            subject: 'Sem 6 Marksheet',
            attachments: [{
                filename: 'zipped_files/'+uniqueZipID + '.zip', // Use the generated unique file name
                path: 'zipped_files/'+uniqueZipID + '.zip'// Attach the saved PDF file
            }],
        };
        const sendMail = util.promisify(transporter.sendMail).bind(transporter);
        const info = await sendMail(mailOptions);
        
        
        res.json(UserPresent.totaldata)
    }
}