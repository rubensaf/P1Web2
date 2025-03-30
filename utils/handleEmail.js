require("dotenv").config();
const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE === "true", // Si usa TLS
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: `"Soporte" <${process.env.EMAIL}>`,
            to: options.to,
            subject: options.subject,
            text: options.text,
        });

        console.log(" Correo enviado correctamente");
    } catch (error) {
        console.error(" Error al enviar el correo:", error);
        throw new Error("No se pudo enviar el correo");
    }
};

module.exports = { sendEmail };
