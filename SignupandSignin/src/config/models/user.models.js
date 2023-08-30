const getUserByMail ="SELECT * FROM registrant_info WHERE email_id =?";

const addUser = "INSERT INTO registrant_info (first_name, last_name, email_id, password, mobile_number) VALUES (?, ?, ?, ?, ?)";

const updateReftoken = "UPDATE registrant_info SET refresh_token =? WHERE email_id =?";

const checkReftoken = "SELECT * FROM registrant_info WHERE refresh_token =?";

const saveOtp = "INSERT INTO otp_info (phone_number, otp) VALUES (?,?)";

const getOtp = "SELECT otp FROM otp_info WHERE phone_number = ? ORDER BY created_at DESC LIMIT 1";

module.exports = {
    getUserByMail,
    addUser,
    updateReftoken,
    checkReftoken,
    saveOtp,
    getOtp
}