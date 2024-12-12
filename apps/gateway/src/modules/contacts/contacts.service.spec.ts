import { Test, TestingModule } from '@nestjs/testing';
import { ContactCardsService } from './contacts.service';

describe('ContactsService', () => {
  let service: ContactCardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContactCardsService],
    }).compile();

    service = module.get<ContactCardsService>(ContactCardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
