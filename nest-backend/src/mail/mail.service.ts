// mail.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MailService {
    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) { }

    async sendEmail(
        to: string,
        subject: string,
        htmlContent: string,
    ) {
        const apiKey = this.configService.get<string>('BREVO_API_KEY');
        if (!apiKey) {
            throw new Error('BREVO_API_KEY is not set');
        }

        const payload = {
            sender: {
                email: this.configService.get('USER_EMAIL'),
                name: this.configService.get('NAME'),
            },
            to: [{ email: to }],
            subject,
            htmlContent,
        };

        const response = await firstValueFrom(
            this.httpService.post(
                'https://api.brevo.com/v3/smtp/email',
                payload,
                {
                    headers: {
                        'api-key': apiKey,
                        'Content-Type': 'application/json',
                    },
                },
            ),
        );

        return response.data;
    }
}
