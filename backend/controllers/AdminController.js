const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/AdminModel");
const Organization = require("../models/OrganizationModel")
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
        console.log(err.message);
        res.status(500).json({message : "Error while signing up the admin"})
    }
      
}
exports.login = async(req,res,next) => {
    const {email,password} = req.body;
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
    let data = await Organization.find({ verified: false });
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
        organization.verified = true;
        await organization.save();
        res.status(200).json({ message: 'Verification status changed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}