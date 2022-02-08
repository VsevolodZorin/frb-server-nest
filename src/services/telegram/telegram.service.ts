import { Inject, Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { ITelegramOptions } from '@src/services/telegram/types/telegram.interface';
import { TELEGRAM_MODULE_OPTIONS } from '@src/services/telegram/telegram.constants';

@Injectable()
export class TelegramService {
  bot: Telegraf;
  options: ITelegramOptions;

  constructor(@Inject(TELEGRAM_MODULE_OPTIONS) options: ITelegramOptions) {
    this.bot = new Telegraf(options.botToken);
    this.options = options;
  }

  async sendMessage(message: string, chatId: string = this.options.chatId) {
    console.log('--- telegram sendMessage', { message, chatId });
    await this.bot.telegram.sendMessage(chatId, message);
  }
}
