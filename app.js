require('dotenv').config();
const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');
const fs = require('fs');

// 1. Middleware MUST come before routes
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // Helps read form data

// 2. The Home Route
app.get('/', (req, res) => {
    res.render('index', { title: 'Jeremiah Ojo | Portfolio' });
});

// 3. The Working Contact Route
app.post('/contact', (req, res) => {
    const { name, email, mobile, subject, message } = req.body;

    // 1. Configure the SendGrid Transporter
    const transporter = nodemailer.createTransport(sgTransport({
        auth: {
            api_key: process.env.SENDGRID_API_KEY
        }
    }));

    // 2. Mail Options (Must use the email you verified in SendGrid)
    const mailOptions = {
        from: 'ojojeremiah249@gmail.com', // Your verified sender
        to: 'ojojeremiah249@gmail.com',
        subject: `Portfolio: ${subject}`,
        text: `Name: ${name}\nPhone: ${mobile}\nEmail: ${email}\n\nMessage:\n${message}`,
        replyTo: email // This lets you reply directly to the user
    };

    // 3. Keep your logging logic
    const logEntry = `\nDate: ${new Date().toLocaleString()}\nName: ${name}\nMessage: ${message}\n-------------------------`;
    fs.appendFile('contact_logs.txt', logEntry, (err) => {
        if (err) console.log("Log Error:", err);
    });

    // 4. Send the Mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("SendGrid Error:", error);
            return res.status(500).send("SendGrid failed. Check your API Key.");
        }
        res.send("<script>alert('Message Sent via SendGrid!'); window.location.href='/';</script>");
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})