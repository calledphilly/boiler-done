import { Mailer } from '.';

interface MailData {
  name: string;
  url: string;
}

export class ResetPasswordMailer extends Mailer<MailData> {
  protected template = 'reset-password';
}
