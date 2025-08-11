import { Module } from '@nestjs/common';
import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';
import { GeminiService } from '../gemini-ia/gemini.service';
import { HistorialRepository } from '../repository/historial.repository';

@Module({
  controllers: [ChatbotController],
  providers: [ChatbotService, GeminiService, HistorialRepository],
})
export class ChatbotModule {}
