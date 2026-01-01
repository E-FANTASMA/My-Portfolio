require('dotenv').config();
const express = require('express');
const app = express();
const nodemailer = require('nodemailer');

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
    const { name, email, number, subject, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ojojeremiah249@gmail.com',
            // Use process.env if you set up the .env file, otherwise use the string
            pass: process.env.MAIL_PASS || 'zveh afvx gzzh bzxm' 
        }
    });

    const mailOptions = {
        from: email,
        to: 'ojojeremiah249@gmail.com',
        subject: `Portfolio: ${subject}`,
        text: `Name: ${name}\nPhone: ${number}\nEmail: ${email}\n\nMessage:\n${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).send("Error sending mail. Check your App Password.");
        }
        // This gives the user a nice popup alert and sends them back home
        res.send("<script>alert('Message Sent Successfully!'); window.location.href='/';</script>");
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})