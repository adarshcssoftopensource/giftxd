import { Injectable } from '@nestjs/common';
import { MailService } from '../../mail-service';
import { ConfigService } from '@nestjs/config';
import { USER_DTOS } from '@app/dto';
import { readFileSync } from 'fs';
import { compile } from 'handlebars';
import { join } from 'path';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class WebsiteService {
  constructor(
    private emailService: MailService,
    private config: ConfigService,
  ) {}

  private formattedDateTime(datetime: Date) {
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const month = monthNames[datetime.getMonth()];
    const day = datetime.getDate();
    const year = datetime.getFullYear();
    let hours = datetime.getHours();
    let minutes = datetime.getMinutes().toString();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    if (hours > 12) {
      hours -= 12;
    }

    if (minutes.length < 2) {
      minutes = '0' + minutes;
    }

    return `${month} ${day}, ${year} | ${hours}:${minutes} ${ampm}`;
  }

  async sendPasswordResetEmail(
    model: USER_DTOS.PasswordResetEmailDto,
  ): Promise<any | RpcException> {
    const { email, firstname, giftxd_address, os, browser, location, datetime } = model;
    const dateTime = new Date(datetime);

    const htmlPath = join(
      process.cwd(),
      'assets',
      'templates',
      'password_reset.html',
    );
    const htmlContent = readFileSync(htmlPath, 'utf8');

    const compiledTemplate = compile(htmlContent);
    const renderedHtml = compiledTemplate({
      email,
      firstname,
      htmlContent,
      // os,
      // browser,
      datetime: this.formattedDateTime(dateTime),
      // location,
      giftxd_address
    });

    const mailOptions = {
      to: email,
      subject: 'Password Reset Request',
      html: renderedHtml,
    };

    return await this.emailService.sendMail(mailOptions);
  }

  async sendVerificationEmail(model: USER_DTOS.EmailVerificationDto): Promise<any | RpcException>{
    const { email, otp, expiryTime, giftxd_address} = model;
    
    const htmlPath = join(process.cwd(), 'assets', 'templates', 'email_verification.html');
    const htmlContent = readFileSync(htmlPath, 'utf8');

    const compiledTemplate = compile(htmlContent);
    const renderedHtml = compiledTemplate({
      giftxd_address,
      htmlContent,
      expiryTime,
      otp: otp
    });

    const mailOptions = {
      to: email,
      subject: 'Email Verification',
      html: renderedHtml,
    };
    
    return await this.emailService.sendMail(mailOptions);
  }

  async sendLoginNotificationEmail(model: USER_DTOS.LoginNotificationEmailDto): Promise<any | RpcException>{
    const { email, firstname, os, browser, location, datetime } = model;

    const dateTime = new Date(datetime);

    const htmlPath = join(
      process.cwd(),
      'assets',
      'templates',
      'login_notification.html',
    );
    const htmlContent = readFileSync(htmlPath, 'utf8');

    const compiledTemplate = compile(htmlContent);
    const renderedHtml = compiledTemplate({
      firstname,
      htmlContent,
      email,
      // os,
      // browser,
      datetime: this.formattedDateTime(dateTime),
      // location,
    });

    const mailOptions = {
      to: email,
      subject: 'Login Notification',
      html: renderedHtml,
    };
    
    return await this.emailService.sendMail(mailOptions);
  }
}
