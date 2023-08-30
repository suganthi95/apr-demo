const express = require('express');
//const axios = require('axios');
const pg = require('pg');

var unirest = require("unirest");

const app = express();
const port = 3000;

// Database setup
const pool = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'apr_dev_mnbv_db',
    password: 'keasnmacaa',
    port: 5432,
});

app.use(express.json());

// Generate random 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
}

// Save OTP to the database
async function saveOTPToDatabase(phone, otp) {
    const query = 'INSERT INTO otps (phone_number, otp) VALUES ($1, $2)';
    await pool.query(query, [phone, otp]);
}

// Send OTP via Fast2SMS
async function sendOTP(phone, otp_num) {
    const apiKey = '7MVsvEZUBmASXhFOKzGjJdqo6Tk0wCby45aiIfct9n2HPWp3xgoEYky9jm4OUxD8Ivt3qwFpig7M5LQG';
    const message = `Your OTP is ${otp_num}.`;
    // const url = ` https://www.fast2sms.com/dev/bulkV2?authorization=7MVsvEZUBmASXhFOKzGjJdqo6Tk0wCby45aiIfct9n2HPWp3xgoEYky9jm4OUxD8Ivt3qwFpig7M5LQG&route=otp&variables_values=&flash=0&numbers=`;
    // //const url = `https://www.fast2sms.com/dev/bulk?authorization=${apiKey}&message=${message}&language=english&route=q&numbers=${phone}`;

    // try {
    //     const response = await axios.get(url);
    //     if (response.data.return === true) {
    //         return true;
    //     }
    //     return false;
    // } catch (error) {
    //     console.error('Error sending OTP:', error);
    //     return false;
    // }

    var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");

    req.headers({
        "authorization": "7MVsvEZUBmASXhFOKzGjJdqo6Tk0wCby45aiIfct9n2HPWp3xgoEYky9jm4OUxD8Ivt3qwFpig7M5LQG"
    });

    req.form({
        "variables_values": otp_num,
        "route": "otp",
        "numbers": phone,
    });


    let result ;
    req.end(function (res) {

        // if (res.error) throw new Error(res.error);
        
        console.log(res.body);
        console.log("test: ", res.body.return);
        if(res.body.return === true){
                    result =  true;
        }else{
                   result =false;
        }
        // this is the result {
        //     return: true,
        //     request_id: 'noqlbe1p0zgitha',
        //     message: [ 'SMS sent successfully.' ]
        //   }
    });

    // try {
    //         const response = await axios.get(url);
    //         if (response.data.return === true) {
    //             return true;
    //         }
    //         return false;
    //     } catch (error) {
    //         console.error('Error sending OTP:', error);
    //         return false;
    //     }

    try{
         if(result === true){
            return true;
         }else{
            return false;
         }
    }catch(err){
        console.log('Error sending OTP:', err);
        return false
    }
}

// Route to initiate OTP sending
app.post('/send-otp', async (req, res) => {
    const { phone_number } = req.body;
    const otp = generateOTP();

    // Save OTP to the database
    await saveOTPToDatabase(phone_number, otp);

    // Send OTP via Fast2SMS
    const isSent = await sendOTP(phone_number, otp);

    if (isSent) {
        res.json({ success: true, message: 'OTP sent successfully.' });
    } else {
        res.json({ success: false, message: 'Failed to send OTP.' });
    }
});

// Route to verify OTP
app.post('/verify-otp', async (req, res) => {
    const { phone_number, otp } = req.body;
    const query = 'SELECT otp FROM otps WHERE phone_number = $1 ORDER BY created_at DESC LIMIT 1';
    const result = await pool.query(query, [phone_number]);

    if (result.rows.length > 0 && result.rows[0].otp === otp) {
        res.json({ success: true, message: 'OTP verified successfully.' });
    } else {
        res.json({ success: false, message: 'Invalid OTP.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});