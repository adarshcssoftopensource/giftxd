import { Test, TestingModule } from '@nestjs/testing';
import { ContactCardsController } from './contacts.controller';

describe('ContactsController', () => {
  let controller: ContactCardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactCardsController],
    }).compile();

    controller = module.get<ContactCardsController>(ContactCardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
