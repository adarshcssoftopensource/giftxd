import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { WebsiteModule } from './modules/website/website.module';
import { MailService } from './mail-service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/apps/mail-service/.env`,
    }),
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAILGUN_SMTP_HOST'),
          port: configService.get('MAILGUN_SMTP_PORT'),
          secure: configService.get('MAILGUN_SMTP_SECURE') == 'true',
          auth: {
            user: configService.get('MAILGUN_SMTP_USER'),
            pass: configService.get('MAILGUN_SMTP_PASS'),
          },
        },
        defaults: {
          from: configService.get('DEFAULT_EMAIL_ADDRESS'),
        },
      }),
      inject: [ConfigService]
    }),
    WebsiteModule,
  ],
  controllers: [],
  providers: [MailService, ConfigService],
  exports: [MailService]
})
export class MailServiceModule {}
