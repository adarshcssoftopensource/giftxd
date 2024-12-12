import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
// import * as puppeteer from 'puppeteer';

@Injectable()
export class PdfService {
  constructor(private readonly mailerService: MailerService) {}

  // async createPdf(orderData): Promise<Buffer> {
  //   const browser = await puppeteer.launch();
  //   const page = await browser.newPage();
  //   // Set your HTML content here with the order data
  //   await page.setContent(`Your HTML here`);
  //   const pdf = await page.pdf({ format: 'A4', printBackground: true });
  //   await browser.close();
  //   return pdf;
  // }

  async sendPdfToEmail(pdfBuffer: Buffer, email: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email, // list of receivers
      subject: 'Order Details PDF', // Subject line
      text: 'Here are your order details.', // plaintext body
      attachments: [
        {
          filename: 'order-details.pdf',
          content: pdfBuffer,
        },
      ],
    });
  }
}
