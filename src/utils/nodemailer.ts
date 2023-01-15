import { createTransport, Transporter } from "nodemailer";
import "dotenv/config";

interface MailOptionsI {
  from: string;
  to: string;
  subject: string;
  text: string;
}

export class Nodemailer {
  private smtpTransport;

  constructor() {
    this.smtpTransport = createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.USER_NODEMAILER,
        pass: process.env.PASS_NODEMAILER,
      },
    });
  }

  public async sendEmail(mailOptions: MailOptionsI) {
    return this.smtpTransport.sendMail(mailOptions);
  }
}
