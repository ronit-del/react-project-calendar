// mail.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import juice from 'juice';

@Injectable()
export class MailService {

    private templateCache: Map<string, Handlebars.TemplateDelegate> = new Map();

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) { }

    private async loadTemplate(templateName: string) {
        if (this.templateCache.has(templateName)) {
            return this.templateCache.get(templateName);
        }

        const templatePath = path.join(
            process.cwd(),
            'src/mail/templates',
            `${templateName}.hbs`,
        );

        const source = await fs.readFile(templatePath, 'utf8');
        const compiled = Handlebars.compile(source);

        this.templateCache.set(templateName, compiled);
        return compiled;
    }

    async renderTemplate(
        templateName: string,
        variables: Record<string, any>,
    ) {
        const template = await this.loadTemplate(templateName);
        if (!template) {
            throw new Error(`Template ${templateName} not found`);
        }
        const html = template(variables);

        return juice(html);
    }

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
