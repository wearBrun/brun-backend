import nodemailer from 'nodemailer'
import env from '../env.js'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: env.NODE_MAILER_EMAIL,
      pass: env.NODE_MAILER_PASSWORD
  }
});

export const sendEmailOnForgotPassword = async (options) => {
  const mail = {
    from: env.NODE_MAILER_EMAIL,
    to: options.email, 
    subject: options.subject,
    text: options.message, 
    html: `<!DOCTYPE html>
    <html>
    <head>  
    <meta charset="UTF-8">  
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
    <title>Reset Your Password for Brun</title>
       <style>
           body {
               font-family: sans-serif;
               margin: 0;
               padding: 20px;
           }
           h1 {
               font-size: 24px;
               margin-bottom: 15px;
           }
           p {
               font-size: 16px;
               line-height: 1.5;
               margin-bottom: 15px;
           }
           a {
               color: #007bff;
               text-decoration: none;
           }
           .button-container {
               text-align: center;
               margin-top: 20px;
           }
           .button {
               background-color: chocolate;
               color: white;
               padding: 10px 20px;
               border-radius: 5px;
               text-decoration: none;
           }
       </style>
    </head>
    <body>
       <h1>Hi ${options.first_name},</h1>
       <p>We received a request to reset your password for your Brun account. No worries, it happens to the best of us!</p>
       <p>To set a new password, simply click this link:</p>
       <p><a href=${options.resetLink} class="button">Reset Your Password</a></p>
       <p>This link will expire in 2 minitues for security reasons. If you don't reset your password within that time, you can request a new link.</p>
       <p><strong>Important:</strong> If you didn't request a password reset, please let us know immediately by replying to this email.</p>
       <p>Here are some tips for creating a strong password:</p>
       <ul>
           <li>Use a combination of uppercase and lowercase letters, numbers, and symbols.</li>
           <li>Avoid using personal information, such as your name or birthday.</li>
           <li>Create a unique password for each of your online accounts.</li>
           <li>Consider using a password manager to help you keep track of your passwords.</li>
       </ul>
       <p>We hope this helps! If you have any questions, please don't hesitate to contact us at ${env.NODE_MAILER_EMAIL}.</p>
       <p>Sincerely,<br>The Brun Team</p>
    </body>
    </html>`,
  };

  try {
   await transporter.sendMail(mail);
  } catch (error) {
    console.log(
      "Email service failed silently. Make sure you have provided your MAIL credentials in the .env file"
    );
    console.log("Error: ", error);
  }
};

export const sendEmailOnSignUp = async (options) => {
  const mail = {
    from: env.NODE_MAILER_EMAIL,
    to: options.email, 
    subject: options.subject,
    text: options.message, 
    html: `<!DOCTYPE html
    <html>
    <head>   
    <meta charset="UTF-8">  
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
    <title>Welcome to Brun!</title>
       <style>
           body {
               font-family: sans-serif;
               margin: 0;
               padding: 20px;
           }
           h1 {
               font-size: 24px;
               margin-bottom: 15px;
           }
           p {
               font-size: 16px;
               line-height: 1.5;
               margin-bottom: 15px;
           }
           a {
               color: #007bff;
               text-decoration: none;
           }
           .button-container {
               text-align: center;
               margin-top: 20px;
           }
           .button {
               background-color: chocolate;
               color: white;
               padding: 10px 20px;
               border-radius: 5px;
               text-decoration: none;
           }
       </style>
    </head>
    <body>
       <h1>Hi ${options.first_name},</h1>
       <p>Welcome to Brun!  We're so excited to have you join our community.</p>
       <p>You're now officially a part of something special🎉.</p>
       <p>If you have any questions, please don't hesitate to reach out to us at ${env.NODE_MAILER_EMAIL}. We're always happy to help!</p>
       <p>We can't wait to see you exploring and making the most of Brun. </p>
       <p>Sincerely,<br>The Brun Team</p>
       <p class="button-container"><a href=${env.FRONTEND_BASEURL} class="button">Let's Go!</a></p>
    </body>
    </html>`,
  };

  try {
   await transporter.sendMail(mail);
  } catch (error) {
    console.log(
      "Email service failed silently. Make sure you have provided your MAIL credentials in the .env file"
    );
    console.log("Error: ", error);
  }
};