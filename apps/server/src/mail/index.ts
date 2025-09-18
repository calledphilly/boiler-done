// server/mail/Mailer.ts
import fs from 'fs/promises';
import path from 'path';
import nodemailer from 'nodemailer';
import mjml2html from 'mjml';
import { readFileSync } from 'fs';
import { template } from 'radash';

export interface MailOptions<T> {
  to: string;
  subject?: string;
  data: T;
}

export abstract class Mailer<T extends Record<string, any>> {
  protected transporter;
  protected abstract template: string;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'localhost',
      port: 1025,
      secure: false,
    });
  }

  protected getTemplate(): string {
    return readFileSync(
      path.resolve(__dirname, `../../templates/${this.template}.mjml`),
      'utf-8'
    );
  }

  /** Remplace les placeholders {{key}} par les valeurs dans data */
  protected getHydratedHtml(data: T): string {
    const content = this.getTemplate();
    let html = template(content, data);
    return mjml2html(html).html;
  }

  public async send(options: MailOptions<T>) {
    const html = this.getHydratedHtml(options.data);

    await this.transporter.sendMail({
      from: `"No Reply" <development@localhost>`,
      to: options.to,
      subject: options.subject || 'Notification',
      html,
    });
  }
}
