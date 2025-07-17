import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: "gmail", 
    auth: {
        user: "roroferry89@gmail.com",
        pass: "robe sohe jmzz yfqi",
    },
});

export const sendEmail = async (email) => {
    try {
        const mailOptions = {
            from: "roroferry89@gmail.com",
            to: email,
            subject: "User Account",
            text: "Welcome to RoRo Ferry System! Your account was successfully created.",
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

export const sendOTP = async (email, otp) => {
    try {
        const mailOptions = {
            from: "roroferry89@gmail.com",
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is: ${otp}. It expires in 1 minutes.`,
        };
    
        const info = await transporter.sendMail(mailOptions);
    
        console.log("Email sent:", info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

export const sendTicket = async (email, bookingId, pdfPath) => {
    try {
        const mailOptions = {
            from: "roroferry89@gmail.com",
            to: email,
            subject: "Your Ro-Ro Ferry E-Ticket",
            text: `Thank you for booking with us. Please find your E-Ticket attached.`,
            attachments: [
                {
                    filename: `Ticket-${bookingId}.pdf`,
                    path: pdfPath,
                }
            ]
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("E-Ticket sent via email:", info.response);
    } catch (error) {
        console.error("Error sending E-Ticket email:", error);
    }
};
