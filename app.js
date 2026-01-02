require('dotenv').config();
const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
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

    // NEW TRANSPORTER CONFIGURATION (Port 465 + TLS Bypass)
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465, 
        secure: true, // Use SSL
        auth: {
            user: 'ojojeremiah249@gmail.com',
            pass: process.env.MAIL_PASS || 'zveh afvx gzzh bzxm' 
        },
        tls: {
            rejectUnauthorized: false // Helps bypass local network/ISP blocks
        }
    });

    const mailOptions = {
        from: email,
        to: 'ojojeremiah249@gmail.com',
        subject: `Portfolio: ${subject}`,
        text: `Name: ${name}\nPhone: ${mobile}\nEmail: ${email}\n\nMessage:\n${message}`
    };

    const logEntry = `
        Date: ${new Date().toLocaleString()}
        Name: ${name}
        Email: ${email}
        Mobile: ${mobile}
        Subject: ${subject}
        Message: ${message}
        -------------------------
        `;

    fs.appendFile('contact_logs.txt', logEntry, (err) => {
        if (err) console.log("Error saving log:", err);
        else console.log("Message logged to contact_logs.txt");
    });

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("--- FULL ERROR START ---");
            console.error("Error Code:", error.code); 
            console.error("Command:", error.command); 
            console.error("Response:", error.response); 
            console.error("--- FULL ERROR END ---");
            return res.status(500).send("Email failed. Check your terminal logs for the code.");
        }
        res.send("<script>alert('Message Sent Successfully!'); window.location.href='/';</script>");
    });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})