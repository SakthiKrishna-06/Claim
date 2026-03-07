
import db from './db.js';

const fetchOTP = async () => {

  const res = await db.pool2.query(
    "select body from email_received where body like '%web portal is%' and to_email = 'insurance@promedhospital.com' order by id desc limit 1;"
  );
  let finalOTP = null;  
    const otpMatch = await res.rows[0].body.match(/(?<!\d)\d{6}(?!\d)/);
    finalOTP = otpMatch ? otpMatch[0] : null;
  
    console.log('finalOTP:', finalOTP);

    return finalOTP;
   
};



  module.exports = fetchOTP
 