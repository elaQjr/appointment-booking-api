import nodemailer from 'nodemailer';

interface EmailOptions {
    to: string;
    subject: string;
    message?: string;
    html?: string;
}

const sendEmail = async (options: EmailOptions): Promise<void> => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER as string,
            pass: process.env.EMAIL_PASS as string,
        },
    });
    const mailOptions = {
        from:  `"Your App" <${process.env.EMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        text: options.message,
        html: options.html
    };
    await transporter.sendMail(mailOptions);
};

export default sendEmail;