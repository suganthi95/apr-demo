const db = require("../dbconfig");
const query = require("../models/user.models");
const { sequelize } = require("sequelize");
const { QueryTypes } = require("sequelize");
const crypt = require("../middlewares/crypt");
const jwt = require("jsonwebtoken");
const JWT_REFRESH_KEY = "ABCDEFGHIJKLlkjihgfedcba";
var unirest = require("unirest");

const token = require("../middlewares/token");

// const userSignup = async (req, res) => {
//   const { first_name, last_name, email_id,password, mobile_number } = req.body;

//   // check whether user already signed up
//    const existingUser =await db.sequelize.query(query.getUserByMail, {
//     replacements: [email_id],
//     type: QueryTypes.SELECT,
//   });

//   //console.log("existingUser", existingUser);
//   const hashedPassword =await crypt.encrypt(password);

//   if(existingUser[0] == undefined){
//      await db.sequelize.query(query.addUser,{replacements: [first_name, last_name, email_id, hashedPassword, mobile_number],
//         type: QueryTypes.INSERT, });

//     res.status(200).json("Registrant signup success")
//   }else{
//     res.status(200).json("User already exist, Please login")
//   }
// };

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

// Save OTP to the database
async function saveOTPToDatabase(phone_number, otp) {
  //const query = "INSERT INTO otps (phone_number, otp) VALUES ($1, $2)";
  //await pool.query(query, [phone, otp]);
  await db.sequelize.query(query.saveOtp, {
    replacements: [phone_number, otp],
    type: QueryTypes.INSERT,
  });
}

// Send OTP via Fast2SMS
const sendOTP = async (phone, otp_num) => {
  return new Promise((resolve, reject) => {
    const apiKey =
      "7MVsvEZUBmASXhFOKzGjJdqo6Tk0wCby45aiIfct9n2HPWp3xgoEYky9jm4OUxD8Ivt3qwFpig7M5LQG";
    const message = `Your OTP is ${otp_num}.`;
    // const url = ` https://www.fast2sms.com/dev/bulkV2?authorization=7MVsvEZUBmASXhFOKzGjJdqo6Tk0wCby45aiIfct9n2HPWp3xgoEYky9jm4OUxD8Ivt3qwFpig7M5LQG&route=otp&variables_values=&flash=0&numbers=`;
    // //const url = `https://www.fast2sms.com/dev/bulk?authorization=${apiKey}&message=${message}&language=english&route=q&numbers=${phone}`;

    var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");

    req.headers({
      authorization:
        "7MVsvEZUBmASXhFOKzGjJdqo6Tk0wCby45aiIfct9n2HPWp3xgoEYky9jm4OUxD8Ivt3qwFpig7M5LQG",
    });

    req.form({
      variables_values: otp_num,
      route: "otp",
      numbers: phone,
    });

    req.end(function (res) {
      // if (res.error) throw new Error(res.error);

      console.log(res.body);
      const result = res.body;

      if (result.return === true) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

const userSignup = async (req, res) => {
  const { first_name, last_name, email_id, password, mobile_number } = req.body;

  // check whether user already signed up
  const existingUser = await db.sequelize.query(query.getUserByMail, {
    replacements: [email_id],
    type: QueryTypes.SELECT,
  });

  //console.log("existingUser", existingUser);
  const hashedPassword = await crypt.encrypt(password);

  if (existingUser[0] == undefined) {
    await db.sequelize.query(query.addUser, {
      replacements: [
        first_name,
        last_name,
        email_id,
        hashedPassword,
        mobile_number,
      ],
      type: QueryTypes.INSERT,
    });

    //generate otp
    const otp = generateOTP();

    // Save OTP to the database
    await saveOTPToDatabase(mobile_number, otp);

    // Send OTP via Fast2SMS
    const isSent = await sendOTP(mobile_number, otp);

    console.log("isSent:", isSent);
    if (isSent) {
      res.json({
        success: true,
        message: "OTP sent successfully and Registrant signed up successfully",
      });
    } else {
      res.json({ success: false, message: "Failed to send OTP." });
    }
  } else {
    res.status(200).json("User already exist, Please login");
  }
};


const userLogin = async (req, res) => {
  const { email_id, password } = req.body;

  // checking user already exist or not
  const existingUser = await db.sequelize.query(query.getUserByMail, {
    replacements: [email_id],
    type: QueryTypes.SELECT,
  });

  console.log("existinguser", existingUser);

  if (existingUser[0] == undefined) {
    res.status(200).json("Invalid username/emaild");
  } else {
    //checking the user password
    const userPassword = existingUser[0].password;
    const decryptedPassword = crypt.decrypt(userPassword);
    //console.log("pass", userPassword);

    if (decryptedPassword === password) {
      const accessToken = await token.tokenGenerator(email_id);
      const refreshToken = await token.refTokenGen(email_id);
      //update token in database
      await db.sequelize.query(query.updateReftoken, {
        replacements: [refreshToken, email_id],
        type: QueryTypes.UPDATE,
      });
      res.status(200).json({
        user_id: existingUser[0].registrant_id,
        email_id: email_id,
        passsword: password,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    } else {
      res.status(200).json("Invalid password");
    }
  }
};

const generateToken = async (req, res) => {
  const refreshToken = req.body.refreshtoken;
  if (refreshToken == null) {
    res.status(401).json("Plese enter the token");
  }

  const existingToken = await db.sequelize.query(query.checkReftoken, {
    replacements: [refreshToken],
    type: QueryTypes.SELECT,
  });

  console.log("refrehToken: ", existingToken);

  if (existingToken[0] !== undefined) {
    await jwt.verify(refreshToken, JWT_REFRESH_KEY, async (error, result) => {
      if (error) {
        res.status(400).json("invalid token");
      } else {
        const accToken = await token.tokenGenerator(existingToken[0].email_id);
        res.status(200).json({ accesstoken: accToken });
      }
    });
  } else {
    res.status(201).json("Token expired/Invalid. Please login");
  }
};

const resendOtp = async (req, res) => {
const mobile_number= req.body.mobile_number;
   //generate otp
   const otp = generateOTP();

   // Save OTP to the database
   await saveOTPToDatabase(mobile_number, otp);

   // Send OTP via Fast2SMS
   const isSent = await sendOTP(mobile_number, otp);

   console.log("isSent:", isSent);
   if (isSent) {
     res.json({success: true, message: "OTP resent"});
   } else {
     res.json({ success: false, message: "Failed to send OTP." });
};
}


const verifyOtp =  async (req, res) => {
  const { phone_number, otp } = req.body;
  // const query =
  //   "SELECT otp FROM otp_info WHERE phone_number = ? ORDER BY created_at DESC LIMIT 1";
  // const result = await pool.query(query, [phone_number]);
  
  const result = await db.sequelize.query(query.getOtp, {replacements: [phone_number], type:QueryTypes.SELECT});

  if (result[0] !== undefined > 0 && result[0].otp === otp) {
    res.json({ success: true, message: "OTP verified successfully." });
  } else {
    res.json({ success: false, message: "Invalid OTP." });
  }
};

module.exports = {
  userSignup,
  userLogin,
  generateToken,
  resendOtp,
  verifyOtp

};
