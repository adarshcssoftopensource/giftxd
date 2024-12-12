import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { HOME_DTOS } from '@app/dto'; // Import your DTOs
import { HOME_MODELS } from '@app/schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TextractService {
  private readonly textract;
  private readonly regexPatterns = {
    amazon: /([A-Z0-9]{4}\s*-\s*[A-Z0-9]{6}\s*-\s*[A-Z0-9]{4,6})/,
    apple: /(X[A-Z0-9]{15})|(GCA\d{16})/,
    steam: /([A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5})/,
    mastercard: /5[0-5][0-9]{2}(\s|-)?[0-9]{4}(\s|-)?[0-9]{4}(\s|-)?[0-9]{4}/,
    validThruMonth: /(?:0[1-9]|1[0-2])\/[0-9]{2}/,
    cvv: /^[0-9]{3,4}$/,
  };

  constructor(
    @InjectModel(HOME_MODELS.Card.name)
    private cardModel: Model<HOME_MODELS.Card>,
  ) {
    AWS.config.update({
      region: 'us-west-2',
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    });
    this.textract = new AWS.Textract();
  }

  async extractTextFromImages(
    buffers: Buffer[],
  ): Promise<{ frontText: string; backText: string; receiptText: string }> {
    // if (buffers.length !== 3) {
    //   throw new Error('Expected 3 images (front, back, receipt)');
    // }
    try {
      const [frontImage, backImage, receipt] = buffers;
      let frontText, backText, receiptText;

      if (frontImage) {
        frontText = await this.processImageWithTextract(frontImage);
      }

      if (backImage) {
        backText = await this.processImageWithTextract(backImage);
      }

      if (receipt) {
        receiptText = await this.processImageWithTextract(receipt);
      }
      return { frontText, backText, receiptText };
    } catch (err) {
      console.error('Error in extractTextFromImages:', err);
      throw err;
    }
  }

  private async processImageWithTextract(buffer: Buffer): Promise<string> {
    const params = {
      Document: { Bytes: buffer },
      FeatureTypes: ['FORMS'],
    };

    const data = await this.textract.analyzeDocument(params).promise();
    return this.parseTextractDataToText(data);
  }

  private parseTextractDataToText(
    data: AWS.Textract.AnalyzeDocumentResponse,
  ): string {
    if (!data || !data.Blocks) {
      return '';
    }

    const textBlocks = data.Blocks.filter(
      (block) => block.BlockType === 'LINE' || block.BlockType === 'WORD',
    );
    return textBlocks.map((block) => block.Text).join(' ');
  }

  async parseAndMapCardDetails(
    frontText: string,
    backText: string,
    receiptText: string,
  ): Promise<{ createCardDto: HOME_DTOS.CreateCardDto; cardId?: string }> {
    const combinedText = `${frontText} ${backText} ${receiptText}`;
    console.log(combinedText);
    const cardDetails = this.validateCardNumber(combinedText);
    console.log(cardDetails);
    const createCardDto = new HOME_DTOS.CreateCardDto();

    if (cardDetails.isValid) {
      createCardDto.cardNumber = cardDetails.cardNumber;
      createCardDto.provider = cardDetails.provider;
      createCardDto.cvv = cardDetails.cvv;
      createCardDto.validThruMonth = cardDetails.validThruMonth;
      createCardDto.validThruYear = cardDetails.validThruYear;
      createCardDto.parsedText = combinedText;

      const newCard = new this.cardModel(createCardDto);
      await newCard.save();

      return { createCardDto, cardId: newCard._id.toString() };
    } else {
      // If not valid, return the DTO with an undefined or null cardId
      return { createCardDto, cardId: undefined }; // or null, based on your use case
    }
  }
  private validateCardNumber(text: string): {
    cardNumber: string;
    provider: string;
    isValid: boolean;
    validThruMonth: string;
    validThruYear: string;
    cvv: string;
  } {
    let cardNumber = '';
    let provider = '';
    let validThruMonth = 'Not applicable';
    let validThruYear = 'Not applicable';
    let cvv = 'Not applicable';
    let isValid = false;

    for (const [key, regex] of Object.entries(this.regexPatterns)) {
      const match = text.match(regex);
      if (match && match[0]) {
        switch (key) {
          case 'amazon':
          case 'apple':
          case 'steam':
          case 'mastercard':
            cardNumber = match[0].replace(/\s/g, '');
            provider = key;
            isValid = true;
            break;

          case 'validThruMonth':
            const dateParts = match[0].split('/');
            validThruMonth = dateParts[0];
            validThruYear = dateParts[1];
            break;
          case 'cvv':
            cvv = match[0];
            break;
        }
      }
    }

    return {
      cardNumber,
      provider,
      isValid,
      validThruMonth,
      validThruYear,
      cvv,
    };
  }

  async getById(cardId: string): Promise<HOME_MODELS.Card> {
    const card = await this.cardModel.findById(cardId).exec();
    if (!card) {
      throw new Error('Card not found');
    }
    return card;
  }

  async update(
    cardId: string,
    updateCardDto: HOME_DTOS.UpdateCardDto,
  ): Promise<HOME_MODELS.Card> {
    const updatedCard = await this.cardModel
      .findByIdAndUpdate(cardId, updateCardDto, { new: true })
      .exec();
    if (!updatedCard) {
      throw new Error('Card not found or update failed');
    }
    return updatedCard;
  }
}
