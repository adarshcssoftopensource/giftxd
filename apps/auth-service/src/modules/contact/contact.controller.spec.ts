import { Test, TestingModule } from '@nestjs/testing';
import { ContactCardController } from './contact.controller';

describe('ContactController', () => {
  let controller: ContactCardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactCardController],
    }).compile();

    controller = module.get<ContactCardController>(ContactCardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
