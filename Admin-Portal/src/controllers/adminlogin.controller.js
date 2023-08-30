const db = require("../config/dbconfig");
const query = require("../models/adminlogin.model");
const {sequelize} = require("sequelize");
const {QueryTypes} = require("sequelize");
const hash = require("../middlewares/crypt");
const jwt = require("jsonwebtoken");

const JWT_REFRESH_KEY = "ABCDEFGHIJKLlkjihgfedcba";
const token = require("../middlewares/token");

const createAdminTable = async (req,res)=>{
  const result=  await db.sequelize.query(query.adminTable, { type: QueryTypes.CREATE});
  console.log("result", result);
  res.status(200).json("Admin table created")
}

const createRunnerTable = async (req,res)=>{
    const result=  await db.sequelize.query(query.runnerTable, { type: QueryTypes.CREATE});
    console.log("result", result);
    res.status(200).json("Runner table created");
}

const createRegistrantTable = async (req,res)=>{
    const result=  await db.sequelize.query(query.registrantTable, { type: QueryTypes.CREATE});
    console.log("result", result);
    res.status(200).json("Runner table created");
}
const createEventTable = async (req,res)=>{
    const result=  await db.sequelize.query(query.eventTable, { type: QueryTypes.CREATE});
    console.log("result", result);
    res.status(200).json("Runner table created");
}
const createPaymentTable = async (req,res)=>{
    const result=  await db.sequelize.query(query.paymentTable, { type: QueryTypes.CREATE});
    console.log("result", result);
    res.status(200).json("Runner table created");
}
const createRegistrantTypeTable = async (req,res)=>{
    const result=  await db.sequelize.query(query.registrantTypeTable, { type: QueryTypes.CREATE});
    console.log("result", result);
    res.status(200).json("Runner table created");
}
const createRegistrantSourceTable = async (req,res)=>{
    const result=  await db.sequelize.query(query.registrantSourceTable, { type: QueryTypes.CREATE});
    console.log("result", result);
    res.status(200).json("Runner table created");
}
const createRegistrantClassTable = async (req,res)=>{
    const result=  await db.sequelize.query(query.registrantClassTable, { type: QueryTypes.CREATE});
    console.log("result", result);
    res.status(200).json("Runner table created");
}

const adminLogin = async(req,res)=>{
    const {username, password} =req.body;
    console.log("username", username);
  // checking user already exist or not
    const existingUser = await db.sequelize.query(query.getUserByMail,{ replacements: [username], type: QueryTypes.SELECT} );
  
    const userPassword = existingUser[0].admin_password;
           console.log("pass", existingUser);
    
    if(!existingUser){
        res.status(200).json("Invalid username/emaild")
    }else{
        //checking r=the user password 
        if(userPassword === password){
                const accessToken = await token.tokenGenerator(username);
                const refreshToken = await token.refTokenGen(username);

            const updateToken = await db.sequelize.query(query.updateRefToken, {replacements:[refreshToken, username], type: QueryTypes.UPDATE} ) ;

              res.status(200).json({username: username,
                                     passsword: password,
                                    accessToken: accessToken,
                                    refreshToken: refreshToken  });
        }else{
            res.status(200).json("Invalid password")
        }
    }
}


const generateToken = async (req, res) => {
    const refreshToken = req.body.refreshtoken;
    if (refreshToken == null) {
      res.status(401).json("Plese enter the token");
    }
  
    const existingToken = await db.sequelize.query(query.checkReftoken, { replacements: [refreshToken], type: QueryTypes.SELECT });
           console.log("refrehToken: ", existingToken);
   
    if (existingToken[0] !== undefined) {
       //const reToken =  await token.reTokenValidator(refreshToken);
           await jwt.verify(refreshToken, JWT_REFRESH_KEY, async(error, result)=>{
            if(error){
                res.status(400).json("invalid token");
            }else{
                const accToken = await token.tokenGenerator(existingToken[0].admin_user_name);
                res.status(200).json({ accesstoken: accToken });
            }
           })
 
     } else {
      res.status(201).json("Token expired/Invalid. Please login");
    }
}




module.exports = {
    createAdminTable,
    createRunnerTable,
    createEventTable,
    createPaymentTable,
    createRegistrantSourceTable,
    createRegistrantClassTable,
    createRegistrantTypeTable,
    createRegistrantTable,
    adminLogin,
    generateToken
};