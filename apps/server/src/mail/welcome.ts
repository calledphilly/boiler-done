import { Mailer } from '.';

interface MailData {
  name: string;
}

export class WelcomeMailer extends Mailer<MailData> {
  protected template = 'welcome';
}
