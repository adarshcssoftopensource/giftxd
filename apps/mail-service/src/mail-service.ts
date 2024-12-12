import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
  ) {}

  public async sendMail(mailOptions: {to: string, subject: string, html: string}) {
    try{
      const response = await this.mailerService
        .sendMail({
          from: "GiftXD <noreply@giftxd.com>",
          to: mailOptions.to, 
          subject: mailOptions.subject, 
          html: mailOptions.html
        });
      return {
        accepted: response.accepted,
        rejected: response.rejected,
        messageSize: response.messageSize,
        messageTime: response.messageTime,
        response: response.response
      }
      
    }catch(error){
      console.log("Error Sending Email =>\n", error);
    }
  }
}
