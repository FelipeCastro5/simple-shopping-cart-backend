import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EmailService } from 'src/infrastructure/email-service/email-service.service';
import { SendEmailDto } from './send-email.dto';

@ApiTags('Email')
@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  @ApiOperation({ summary: 'Enviar un correo de prueba' })
  @ApiResponse({ status: 201, description: 'Correo enviado exitosamente' })
  async sendEmail(@Body() dto: SendEmailDto) {
    await this.emailService.sendEmail(dto.to, dto.subject, dto.body);
    return { message: `Correo enviado a ${dto.to}` };
  }
}
