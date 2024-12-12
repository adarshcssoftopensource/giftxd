import { USER_MODELS, HOME_MODELS } from '@app/schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { USER_DTOS } from '@app/dto';
import { Inject, Injectable } from '@nestjs/common';
import { hash_with_bcrypt, compare_hash_with_bcrypt } from '@app/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { roleType } from '@app/schemas/users/role.schema';
import axios from 'axios';
import { KycVerificationStatus } from '@app/schemas/users/client.schema';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const crypto = require('crypto');
import { generateFromEmail } from 'unique-username-generator';

@Injectable()
export class WebsiteService {
  constructor(
    @InjectModel(HOME_MODELS.SettingsCard.name)
    private settingsCardModel: Model<HOME_MODELS.SettingsCard>,
    @InjectModel(USER_MODELS.User.name)
    private userModel: Model<USER_MODELS.User>,
    @InjectModel(USER_MODELS.Client.name)
    private clientModel: Model<USER_MODELS.Client>,
    @InjectModel(USER_MODELS.Role.name)
    private roleModel: Model<USER_MODELS.Role>,
    @InjectModel(HOME_MODELS.PhoneNumber.name)
    private phoneNumberModel: Model<HOME_MODELS.PhoneNumber>,
    private jwt: JwtService,
    @Inject('MAIL_CLIENT_SERVICE')
    private readonly mailService: ClientProxy,
  ) {}

  async signup_user(model: USER_DTOS.WebSiteUserSignupDto) {
    try {
      const {
        email,
        password,
        lot_number,
        captcha_output,
        pass_token,
        gen_time,
      } = model;

      function hmac_sha256_encode(value, key) {
        const hash = crypto
          .createHmac('sha256', key)
          .update(value, 'utf8')
          .digest('hex');
        return hash;
      }

      async function post_form(captcha_body, url) {
        const options = {
          url: url,
          method: 'POST',
          params: captcha_body,
        };

        const result = await axios(options);
        if (result?.data?.result === 'success') {
          return true;
        }
        return false;
      }

      const sign_token = hmac_sha256_encode(
        lot_number,
        process.env.CAPTCHA_KEY_SIGN_UP,
      );
      const captcha_data = {
        lot_number,
        captcha_output,
        pass_token,
        gen_time,
        sign_token: sign_token,
      };
      const API_SERVER = process.env.BASE_URL_CAPTCHA;
      const API_URL =
        API_SERVER +
        '/validate' +
        '?captcha_id=' +
        process.env.CAPTCHA_ID_SIGN_UP;
      const captcha_verified = await post_form(captcha_data, API_URL);
      if (captcha_verified) {
        const is_exist = await this.userModel.findOne({ email });

        if (is_exist) {
          return new RpcException({
            errorCode: 400,
            message: [
              {
                type: 'error',
                value: email,
                msg: 'email already exists',
                path: 'email',
              },
            ],
          });
        }
        const role = await this.roleModel.findOne({
          name: roleType.Client,
        });

        if (!role) {
          throw new RpcException('Client Role not exist');
        }
        let uniqueName;
        let isUnique = false;

        while (!isUnique) {
          uniqueName = generateFromEmail(email, 3);

          const existingUser = await this.userModel.findOne({
            username: uniqueName,
          });

          if (!existingUser) {
            isUnique = true;
          }
        }
        let user = await new this.userModel({
          email,
          username: uniqueName,
          role: role._id,
          password: hash_with_bcrypt(password),
        });

        // Create a default settings card for the new user
        const defaultSettings = new this.settingsCardModel({
          username: 'defaultUsername',
          email: '',
          phone_number: 0,
          password: '',
          notification_preferences: 'default',
          preferred_language: 'English',
          preferred_time_zone: 'UTC',
          last_active: '',
          active_session: '',
          account_closed: false,
        });
        await defaultSettings.save();
        user.settings = defaultSettings._id as Types.ObjectId;
        user['token'] = this.jwt.sign({ _id: user._id });
        await user.save();
        await new this.clientModel({ user: user['_id'] }).save();

        await this.sendOtpEmail(user.id);

        return { token: user.token };
      } else {
        return new RpcException({
          errorCode: 401,
          message: [
            {
              type: 'error',
              value: 'unknown',
              msg: 'Invalid captcha',
              path: 'unknown',
            },
          ],
        });
      }
    } catch (Err) {
      return new RpcException(Err.message);
    }
  }

  async login_user(model: USER_DTOS.WebSiteUserLoginDto) {
    try {
      function hmac_sha256_encode(value, key) {
        const hash = crypto
          .createHmac('sha256', key)
          .update(value, 'utf8')
          .digest('hex');
        return hash;
      }

      async function post_form(captcha_body, url) {
        const options = {
          url: url,
          method: 'POST',
          params: captcha_body,
        };

        const result = await axios(options);
        console.log('captcha result', result.data);

        if (result?.data?.result === 'success') {
          return true;
        }
        return false;
      }

      const sign_token = hmac_sha256_encode(
        model.lot_number,
        process.env.CAPTCHA_KEY_LOGIN,
      );
      const captcha_data = {
        lot_number: model.lot_number,
        captcha_output: model.captcha_output,
        pass_token: model.pass_token,
        gen_time: model.gen_time,
        sign_token: sign_token,
      };
      const API_SERVER = process.env.BASE_URL_CAPTCHA;
      const API_URL =
        API_SERVER +
        '/validate' +
        '?captcha_id=' +
        process.env.CAPTCHA_ID_LOGIN;
      const captcha_verified = await post_form(captcha_data, API_URL);
      if (captcha_verified) {
        const user = await this.userModel
          .findOne({ email: model.email })
          .populate('role');
        if (!user) {
          return new RpcException({
            errorCode: 400,
            message: [
              {
                type: 'error',
                value: 'unknown',
                msg: 'Invalid credentials',
                path: 'unknown',
              },
            ],
          });
        }

        const is_matched = compare_hash_with_bcrypt(
          model.password,
          user['password'],
        );

        if (!is_matched) {
          return new RpcException({
            errorCode: 401,
            message: [
              {
                type: 'error',
                value: 'unknown',
                msg: 'Invalid credentials',
                path: 'unknown',
              },
            ],
          });
        }

        user.token = this.jwt.sign({ _id: user['_id'] });
        user.country_code = model.country;
        user.ip = model.ip;
        await user.save();

        await this.sendLoginNotificationEmail({ user });
        return { token: user.token };
      } else {
        return new RpcException({
          errorCode: 401,
          message: [
            {
              type: 'error',
              value: 'unknown',
              msg: 'Invalid captcha',
              path: 'unknown',
            },
          ],
        });
      }
    } catch (Err) {
      return new RpcException(Err.message);
    }
  }

  async forgetPassword(model: USER_DTOS.WebsiteUserForgetPasswordDto) {
    try {
      const { email } = model;

      const user = await this.userModel.findOne({ email: email });

      if (!user) {
        return new RpcException({
          errorCode: 400,
          message: [
            {
              type: 'error',
              value: email,
              msg: 'Invalid user',
              path: 'email',
            },
          ],
        });
      }

      const token = this.jwt.sign({ _id: user['_id'] }, { expiresIn: '4m' });

      // const event = model as USER_DTOS.CriticalEventData;
      await this.sendPasswordResetEmail({
        ...model,
        id: user._id.toString(),
        token: token,
      });

      return {
        message: "The 'Forgot password' email has been sent successfully.",
      };
    } catch (Err) {
      return new RpcException({
        errorCode: 400,
        message: [
          {
            type: 'internal',
            value: 'unknown',
            msg: Err.message,
            path: 'unknown',
          },
        ],
      });
    }
  }

  async resetPassword(model: USER_DTOS.WebsiteUserResetPasswordDto) {
    try {
      const { token, password } = model;

      const decode = await this.jwt.verifyAsync(token);
      const user = await this.userModel.findById(decode['_id']);

      if (!user) {
        return new RpcException({
          errorCode: 400,
          message: [
            {
              type: 'error',
              value: token,
              msg: 'Invalid user token',
              path: 'token',
            },
          ],
        });
      }

      user.password = hash_with_bcrypt(password);

      await user.save();

      return {
        message: 'For your account, the password has been reset successfully.',
      };
    } catch (Err) {
      console.log(Err.name);
      return new RpcException({
        errorCode: 400,
        message: [
          {
            type: 'internal',
            value: 'unknown',
            msg: Err.message,
            path: 'unknown',
          },
        ],
      });
    }
  }

  async changePassword(id: string, model: USER_DTOS.WebsiteChangePassword) {
    try {
      const { new_password, old_password } = model;
      const user = await this.userModel.findById(id);

      if (!user) {
        return new RpcException({
          errorCode: 400,
          message: [
            {
              type: 'error',
              value: id,
              msg: 'Invalid user',
              path: '_id',
            },
          ],
        });
      }
      const is_matched = compare_hash_with_bcrypt(
        old_password,
        user['password'],
      );
      if (!is_matched) {
        return new RpcException({
          errorCode: 400,
          message: [
            {
              type: 'error',
              value: old_password,
              msg: 'old password is invalid',
              path: 'old_password',
            },
          ],
        });
      }
      user.password = hash_with_bcrypt(new_password);
      await user.save();
      return { message: 'password has been changed.' };
    } catch (Err) {
      console.log(Err.message);
      return new RpcException({
        errorCode: 400,
        message: [
          {
            type: 'internal',
            value: 'unknown',
            msg: Err.message,
            path: 'unknown',
          },
        ],
      });
    }
  }

  async getUserCount() {
    try {
      const userCount = await this.userModel.countDocuments().exec();
      return userCount;
    } catch (error) {
      throw new RpcException('Error getting user count');
    }
  }

  // async verifyEmail(id: string) {
  //   try {
  //     const user = await this.userModel.findOne({ _id: id });

  //     if (!user) {
  //       return new RpcException({
  //         errorCode: 400,
  //         message: [
  //           {
  //             type: 'error',
  //             value: id,
  //             msg: 'Invalid user',
  //             path: 'email',
  //           },
  //         ],
  //       });
  //     }

  //     const token = this.jwt.sign({ _id: user['_id'] }, { expiresIn: '4m' });
  //     user.email_verif_token = token;
  //     user.save();

  //     await this.sendVerificationEmail({ user: user, token: token });
  //     return { message: 'Email verified successfully!' };
  //   } catch (Err) {
  //     return new RpcException({
  //       errorCode: 400,
  //       message: [
  //         {
  //           type: 'internal',
  //           value: 'unknown',
  //           msg: Err.message,
  //           path: 'unknown',
  //         },
  //       ],
  //     });
  //   }
  // }

  async getUserProfile(token: string) {
    try {
      const decode = await this.jwt.verifyAsync(token);
      const user = await this.userModel
        .findById(decode['_id'], {
          _id: 0,
          email: 1,
          avatar: 1,
          country_code: 1,
          email_verified: 1,
          phone_number: 1,
          created_at: 1,
          updated_at: 1,
          username: 1,
        })
        .populate('role', { name: 1, permissions: 1, _id: 0 });
      if (!user) {
        return new RpcException({
          errorCode: 400,
          message: [
            {
              type: 'error',
              value: token,
              msg: 'Email verification failed. Invalid or expired token.',
              path: 'token',
            },
          ],
        });
      }
      const client = await this.clientModel.findOne({ user: decode['_id'] });
      const phone_number = await this.phoneNumberModel.findOne({
        phoneNumber: user.phone_number,
      });
      return {
        ...user.toObject(),
        phoneVerified: phone_number ? phone_number.isVerified : false,
        idVerified:
          client.identity_verif_status == KycVerificationStatus.COMPLETED,
        residencyVerified:
          client.residency_verif_status == KycVerificationStatus.COMPLETED,
      };
    } catch (error) {
      return new RpcException({
        errorCode: 400,
        message: [
          {
            type: 'error',
            msg: error.message,
            path: 'email',
          },
        ],
      });
    }
  }

  private async sendVerificationEmail(data: {
    user: any;
    otp: string;
    expiryTime: number;
  }) {
    const { user, otp, expiryTime } = data;

    const payload = {
      email: user.email,
      firstname: user.firstname,
      otp: otp,
      expiryTime: expiryTime,
    };
    const temp = await this.mailService.send('mail.emailVerification', payload);
    temp.subscribe((response) => {
      console.log(response);
    });
    return temp;
  }

  private generateOTP(length: number): string {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
  }

  private generateOTPWithExpiry(
    length: number,
    expiryTimeInMinutes: number,
  ): USER_MODELS.OTPData {
    const otp = this.generateOTP(length);
    const currentTime = new Date().getTime();
    const expiryTime = currentTime + expiryTimeInMinutes * 60 * 1000; // Convert minutes to milliseconds
    return { otp, expiryTime };
  }

  async sendOtpEmail(id: string) {
    try {
      const client = await this.clientModel
        .findOne({ user: id })
        .populate('user');
      if (!client) {
        return new RpcException({
          errorCode: 400,
          message: [
            {
              type: 'error',
              value: id,
              msg: 'Invalid user',
              path: 'email',
            },
          ],
        });
      }

      const otp_data = this.generateOTPWithExpiry(6, 1);
      await this.sendVerificationEmail({
        user: client.user,
        otp: otp_data.otp,
        expiryTime: 10,
      });

      const user = await this.userModel.findOneAndUpdate(
        { _id: id },
        { $set: { email_otp: otp_data } },
        { new: true },
      );

      return {};
    } catch (Err) {
      return new RpcException({
        errorCode: 400,
        message: [
          {
            type: 'internal',
            value: 'unknown',
            msg: Err.message,
            path: 'unknown',
          },
        ],
      });
    }
  }

  private async sendLoginNotificationEmail(data: { user: any }) {
    const { user } = data;

    const payload = {
      ...data,
      email: user.email,
      firstname: user.firstname,
    };

    const temp = await this.mailService.send('mail.loginNotification', payload);
    temp.subscribe((response) => {
      console.log(response);
    });
    return temp;
  }

  private async sendPasswordResetEmail(data: { id: string; token: string }) {
    const user = await this.userModel.findOne({ _id: data.id });

    if (!user) {
      return new RpcException({
        errorCode: 400,
        message: [
          {
            type: 'error',
            value: {},
            msg: 'User not found',
            path: 'email',
          },
        ],
      });
    }
    const payload = {
      ...data,
      email: user.email,
      firstname: user.firstname,
    };

    const temp = await this.mailService.send('mail.passwordReset', payload);
    temp.subscribe((response) => {
      console.log(response);
    });
    return temp;
  }
  async tokenVerify(token, secret) {
    if (secret != process.env.TOKEN_VERIFY_SECRET) {
      return new RpcException(' Permission denied ');
    }
    const decode: any = this.jwt.decode(token);
    const user = await this.userModel
      .findById(decode._id)
      .populate('role', { name: 1, permissions: 1, _id: 0 });
    if (!user) {
      return new RpcException('User not found');
    }
    return { _id: user._id, role: user.role };
  }
}
