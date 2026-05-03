// Email utility for sending password reset emails
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    console.log('📧 Attempting to send email to:', options.email);
    console.log('📧 SMTP Config:', {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER,
        hasPassword: !!process.env.SMTP_PASS
    });

    try {
        console.log('📧 Creating transporter...');
        
        // Create transporter with more detailed configuration
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            },
        });

        // console.log('📧 Verifying transporter...');
        
        // // Verify transporter connection
        // await transporter.verify();
        // console.log('✅ Transporter verified successfully');

        // Email options
        const mailOptions = {
            from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html || options.message
        };

        // FOR TESTING: Log the reset URL / token to console so we can grab it directly!
        console.log('\n--- 🧪 TEST HELPER ---');
        console.log(`Email Sent Content: ${options.message}`);
        console.log('----------------------\n');

        console.log('📧 Sending email...');
        
        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent successfully!');
        console.log('📧 Message ID:', info.messageId);
        
        return info;
        
    } catch (error) {
        console.error('❌ Email sending failed:');
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        
        // Detailed error logging for debugging
        if (error.code === 'EAUTH') {
            console.error('❌ Authentication failed - check SMTP_USER and SMTP_PASS');
        } else if (error.code === 'ECONNECTION') {
            console.error('❌ Connection failed - check SMTP_HOST and SMTP_PORT');
        }
        
        throw new Error(`Email could not be sent: ${error.message}`);
    }
};

module.exports = sendEmail;