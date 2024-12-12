import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';

@Injectable()
export class OcrService {
  async extractTextFromImage(file: any): Promise<any> {
    const data = new FormData();
    data.append('image', file.buffer, file.originalname);

    const options = {
      method: 'POST',
      url: 'https://ocr-extract-text.p.rapidapi.com/ocr',
      headers: {
        'X-RapidAPI-Key': 'YOUR_API_KEY',
        'X-RapidAPI-Host': 'ocr-extract-text.p.rapidapi.com',
        ...data.getHeaders(),
      },
      data: data,
    };

    try {
      const response = await axios(options);
      return response.data;
    } catch (error) {
      throw new Error('Error extracting text from image.');
    }
  }
}
