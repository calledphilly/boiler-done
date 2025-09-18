import { Mailer } from '.';

interface MailData {
  name: string;
  url: string;
}

export class VerifyEmailMaliler extends Mailer<MailData> {
  protected template = 'verify-email';
}
