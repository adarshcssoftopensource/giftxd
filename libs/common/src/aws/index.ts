import { Injectable, OnModuleInit } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { Buffer } from 'buffer';
@Injectable()
export class S3Service implements OnModuleInit {
  AWS_S3_BUCKET: string;
  s3: AWS.S3;

  constructor(private config: ConfigService) {}

  onModuleInit() {
    this.AWS_S3_BUCKET = this.config.get<string>('AWS_S3_BUCKET');
    console.log({
      accessKeyId: this.config.get<string>('AWS_S3_ACCESS_KEY'),
      secretAccessKey: this.config.get<string>('AWS_S3_KEY_SECRET'),
    });
    this.s3 = new AWS.S3({
      accessKeyId: this.config.get<string>('AWS_S3_ACCESS_KEY'),
      secretAccessKey: this.config.get<string>('AWS_S3_KEY_SECRET'),
    });
  }

  async uploadFile(file: Express.Multer.File, path = 'images/'): Promise<any> {
    return new Promise((resolve, reject) => {
      const key = randomUUID() + extname(file.originalname);
      const base64file = Buffer.from(file.buffer);
      const params = {
        Bucket: this.AWS_S3_BUCKET,
        Key: String(key),
        Body: base64file,
        ContentType: file.mimetype,
      };
      this.s3.upload({ ...params }, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  async deleteFileByLocation(location: string): Promise<any> {
    const parts = location.split('/');

    // Get the last part (which will be the filename with extension)
    const key = parts[parts.length - 1];
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: this.AWS_S3_BUCKET,
        Key: key,
      };

      this.s3.deleteObject(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
}
