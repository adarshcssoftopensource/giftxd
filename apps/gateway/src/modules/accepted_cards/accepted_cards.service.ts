import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AcceptedCard, SortOrderString } from '@app/schemas/home/accepted_cards.schema';
import { AcceptedCardDto, CreateAcceptedCardDto, UpdateAcceptedCardDto } from '@app/dto/home/accepted.cards.dto';
import { REQUEST } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { USER_MODELS } from '@app/schemas';
import { roleType } from '@app/schemas/users/role.schema';
import { S3Service } from '@app/common';

@Injectable()
export class AcceptedCardService {
  constructor(
    @InjectModel(AcceptedCard.name) private readonly acceptedCardsModel: Model<AcceptedCard>,
    @InjectModel(USER_MODELS.User.name) private readonly userModel: Model<USER_MODELS.User>,
    @Inject(REQUEST) private request: Request,
    private jwt: JwtService,
    private s3Service: S3Service
  ) {}
  
  async getAcceptedCards(
    limit: number,
    page: number,
    query: string,
    sortOrder: SortOrderString
    ): Promise<AcceptedCardDto[]> {
      query = query.toUpperCase();
      const skip = (page - 1) * limit;
      let queryFilter: any = {};
      
    if (query) {
      queryFilter = { name: { $regex: `^${query}`, $options: 'i' } };
    }
  
    let queryResult = this.acceptedCardsModel.find(queryFilter).skip(skip).limit(limit);
  
    return (await queryResult.sort({ name: sortOrder })).map((obj) => { return { id:obj.id, name:obj.name, cardImage: obj.cardImage } as AcceptedCardDto;});
  }

  async createAcceptedCard(createCardDto: CreateAcceptedCardDto): Promise<AcceptedCardDto> {
    const token = this.request.headers['x-access-token'];
    const decode = this.jwt.decode(token);
    const user = await this.userModel.findById(decode['_id']).populate('role');
    if(!user || user.role.name != roleType.Admin){
      throw new UnauthorizedException("Unauthorized to send this request")
    }

    createCardDto.name = createCardDto.name.toUpperCase();
    const card = await this.acceptedCardsModel.findOne({name: createCardDto.name});
    if(card){
      throw new BadRequestException("Another card with similar name already exists!")
    }
    try {
      const uploadResult: AWS.S3.ManagedUpload.SendData =
        await this.s3Service.uploadFile(createCardDto.file);
      const { id, name, cardImage } =  await new this.acceptedCardsModel({ name: createCardDto.name, cardImage: uploadResult.Location }).save();
      return { id, name, cardImage } as AcceptedCardDto;
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException("Error uploading card image");
    }
  }

  async updateAcceptedCard(
    updateCardDto: UpdateAcceptedCardDto,
  ): Promise<AcceptedCardDto> {
    const token = this.request.headers['x-access-token'];
    const decode = this.jwt.decode(token);
    const user = await this.userModel.findById(decode['_id']).populate('role');
    if(!user || user.role.name != roleType.Admin){
      throw new UnauthorizedException("Unauthorized to send this request")
    }

    let card = await this.acceptedCardsModel.findOne({
      _id: new Types.ObjectId(updateCardDto.id),
    });
    if (!card)
      throw new NotFoundException("Card not found");
    
    const deleteResult: AWS.S3.DeleteObjectOutput = await this.s3Service.deleteFileByLocation(card.cardImage);
    if (deleteResult && deleteResult.DeleteMarker) {
      const uploadResult: AWS.S3.ManagedUpload.SendData = await this.s3Service.uploadFile(updateCardDto.file);
      card = await this.acceptedCardsModel.findOneAndUpdate(
        { _id: new Types.ObjectId(updateCardDto.id) },
        {
          $set: {
            cardImage: uploadResult.Location
          },
        },
        { new: true },
      );
    } else {
      throw new InternalServerErrorException("Error occurred during card image deletion")
    }

    return { id: card.id, name: card.name, cardImage: card.cardImage };
  }

  async deleteAcceptedCard(cardId: string): Promise<any> {
    const token = this.request.headers['x-access-token'];
    const decode = this.jwt.decode(token);
    const user = await this.userModel.findById(decode['_id']).populate('role');
    if(!user || user.role.name != roleType.Admin){
      throw new UnauthorizedException("Unauthorized to send this request")
    }
    
    let card = await this.acceptedCardsModel.findOne({
      _id: new Types.ObjectId(cardId)
    })
    if (!card)
      throw new NotFoundException("Card not found");

    const deleteResult: AWS.S3.DeleteObjectOutput = await this.s3Service.deleteFileByLocation(card.cardImage);
    if (deleteResult && deleteResult.DeleteMarker) {
      const result = await this.acceptedCardsModel.deleteOne({
        _id: new Types.ObjectId(cardId),
      });
      return {};
    } else {
      throw new InternalServerErrorException("Error occurred during card image deletion")
    }  
  }
}
