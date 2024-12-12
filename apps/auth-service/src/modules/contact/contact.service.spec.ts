import { Test, TestingModule } from '@nestjs/testing';
import { ContactCardService } from './contact.service';

describe('ContactService', () => {
  let service: ContactCardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContactCardService],
    }).compile();

    service = module.get<ContactCardService>(ContactCardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
