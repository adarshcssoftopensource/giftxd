import { Module } from '@nestjs/common';
import { JWTModuleGlobal } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';
import { ClientModule } from './modules/clients/client.module';
import { AdminModule } from './modules/admin/admin.module';
import { ServiceClient } from './clients/serviceClient';
import { WebsiteModule } from './modules/website/website.module';
import { OrderModule } from './modules/order/order.module';
import { OfferModule } from './modules/offer/offer.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { GiftCardModule } from './modules/giftcards/giftcard.module';
import { UserCardModule } from './modules/user-card/user-card.module';
import { AffiliatesModule } from './modules/affiliates/affiliates.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { SupervisorsModule } from './modules/supervisors/supervisors.module';
import { ScheduleModule } from './modules/schedules/schedule.module';
import { ActivityLogModule } from './modules/activitylog/activitylog.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { WalletValidationModule } from './modules/wallet-validation/wallet-validation.module';
import { CurrencyCodeModule } from './modules/currencies/currency-codes.module';
import { OcrModules } from './modules/ocr-extract/ocr.module';
import { CryptoCardsModule } from './modules/crypto-cards/crypto-cards.module';
import { OtpModule } from './modules/otp/otp.module';
import { BlogModule } from './modules/blog/blog.module';
import { MongoConnectionModule } from '@app/common';
import { QuestionModule } from './modules/question/question.module';
import { TextractModule } from './modules/textract/textract.module';
import { CryptosModule } from './modules/cryptos/cryptos.module';
import { RoleModule } from './modules/role/role.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { SuggestionsModule } from './modules/suggestions/suggestions.module';
import { ProviderModule } from './modules/provider/provider.module';
import { AttributesModule } from './modules/attributes/attributes.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { LinkedAccountModule } from './modules/linked-account/linked-account.module';
import { SellerModule } from './modules/seller/seller.module';
import { VendorModule } from './modules/vendor/vendor.module';
import { TradeDataModule } from './modules/trade-data/trade-data.module';
import { PdfModule } from './modules/pdf/pdf.module';
import { SettingsModule } from './modules/settings/settings.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { TwoFactorAuthModule } from './modules/two-factor/two.factor.module';
import { TimezoneModule } from './modules/timezone/timezone.module';
import { LanguagesModule } from './modules/languages/languages.module';
import { CurrencyModule } from './modules/currency-code/currency-code.module';
import { CryptoCodeModule } from './modules/crypto-code/crypto-code.module';
import { GifXdLogsModule } from './modules/gifXd_logs/giftXd_logs.module';
import { AcceptedCardModule } from './modules/accepted_cards/accepted_cards.module';
import { ContactUsModule } from './modules/contact-us/contact-us.module';
import { SecurityQuestionModule } from './modules/securityQuestion/securityQuestion..module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/apps/gateway/.env`,
    }),
    NestScheduleModule.forRoot(),
    MongoConnectionModule.register('USER'),
    JWTModuleGlobal,
    ServiceClient,
    GifXdLogsModule,
    OrderModule,
    AdminModule,
    ClientModule,
    TransactionModule,
    CurrencyModule,
    CryptoCodeModule,
    WebsiteModule,
    GiftCardModule,
    UserCardModule,
    AffiliatesModule,
    EmployeesModule,
    SupervisorsModule,
    ScheduleModule,
    ActivityLogModule,
    AnalyticsModule,
    WalletValidationModule,
    CurrencyCodeModule,
    OcrModules,
    CryptoCardsModule,
    OtpModule,
    QuestionModule,
    TextractModule,
    BlogModule,
    CryptosModule,
    RoleModule,
    ContactsModule,
    SuggestionsModule,
    OfferModule,
    ProviderModule,
    AttributesModule,
    WalletModule,
    LinkedAccountModule,
    SellerModule,
    VendorModule,
    TradeDataModule,
    PdfModule,
    SettingsModule,
    ProfilesModule,
    TradeDataModule,
    TwoFactorAuthModule,
    TimezoneModule,
    LanguagesModule,
    AcceptedCardModule,
    ContactUsModule,
    SecurityQuestionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
console.log();
