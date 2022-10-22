import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class WebhookService {
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get('WEBHOOK_API_KEY');
  }

  verifyApiKey(reqApiKey: string): boolean {
    if (reqApiKey && reqApiKey === this.apiKey) {
      return true;
    } else {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
