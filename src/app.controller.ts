import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('stream-link')
  getStreamLink() {
    return this.appService.getStreamLink();
  }
}
