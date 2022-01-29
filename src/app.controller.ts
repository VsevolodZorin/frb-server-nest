import { Controller, Get } from '@nestjs/common';
import { AppService } from '@src/app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    this.configService.get('TEST');
    return this.appService.getHello();
  }
}
