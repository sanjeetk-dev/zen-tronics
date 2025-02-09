import dotenv from "dotenv";
// import nodemailer from 'nodemailer'
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGODB_URI,
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  sessionSecret: process.env.SESSION_SECRET,
  cloudinary:{
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  },
  jwt_secret: process.env.JWT_SECRET,
  admin_password: process.env.ADMIN_PASSWORD,
  gmail: {
    smtp_user: process.env.SMTP_USER,
    smtp_pass: process.env.SMTP_PASS,
  }
};
// export const transporter = nodemailer.createTransport({
//     service: "Gmail",
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS,
//     },
//   });