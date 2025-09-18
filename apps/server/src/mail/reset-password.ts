import { Mailer } from '~/mail';

interface MailData {
  name: string;
  url: string;
}

export class ResetPasswordMailer extends Mailer<MailData> {
  protected template = 'reset-password';
}
