import { Test, TestingModule } from '@nestjs/testing';
import { ActivityLogController } from './activitylog.controller';
import { ActivityLogService } from './activitylog.service';

describe('ActivityLogController', () => {
  let controller: ActivityLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityLogController],
      providers: [ActivityLogService],
    }).compile();

    controller = module.get<ActivityLogController>(ActivityLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
