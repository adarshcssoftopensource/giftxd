import { AdminModule } from './modules/admin/admin.module';
import { MongoConnectionModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JWTModuleGlobal } from '@app/common';
import { ClientModule } from './modules/client/client.module';
import { WebsiteModule } from './modules/website/website.module';
import { AffiliateModule } from './modules/affiliate/affiliate.module';
import { SupervisorModule } from './modules/supervisor/supervisor.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { ScheduleModule } from './modules/schedules/schedule.module';
import { PermissionModule } from './modules/permission/permission.module';
import { CryptoCardModule } from './modules/crypto-card/crypto-card.module';
import { MailServiceModule } from 'apps/mail-service/src/mail-service.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { RoleModule } from './modules/role/role.module';
import { ContactModule } from './modules/contact/contact.module';
import { SuggestionModule } from './modules/suggestion/suggestion.module';
import { VendorModule } from './modules/vendor/vendor.module';
import { ServiceClient } from '../clients/serviceClient';
import { SettingsModule } from './modules/setting/setting.module';
import { ProfileModule } from './modules/profile/profile.module';
import { SecurityQuestionModule } from './modules/securityQuestion/securityQuestion.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/apps/auth-service/.env`,
    }),
    JWTModuleGlobal,
    MongoConnectionModule.register('USER'),
    AdminModule,
    ClientModule,
    WebsiteModule,
    AffiliateModule,
    SupervisorModule,
    EmployeeModule,
    ScheduleModule,
    PermissionModule,
    CryptoCardModule,
    CryptoCardModule,
    QuestionsModule,
    RoleModule,
    ContactModule,
    SuggestionModule,
    VendorModule,
    MailServiceModule,
    ServiceClient,
    SettingsModule,
    ProfileModule,
    SecurityQuestionModule,
  ],
  controllers: [],
  providers: [],
})
export class AuthServiceModule {}
