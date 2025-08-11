import { Module } from '@nestjs/common';
import { GoogleDriveService } from './google-drive.service';
import { GoogleDriveController } from './google-drive.controller';

@Module({
    controllers: [GoogleDriveController],
    providers: [GoogleDriveService],
    exports: [GoogleDriveService], // 👈 para que puedas importarlo en otros módulos
})
export class GoogleDriveModule { }
