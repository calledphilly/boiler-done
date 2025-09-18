import { Mailer } from '~/mail';

interface MailData {
  name: string;
}

export class WelcomeMailer extends Mailer<MailData> {
  protected template = 'welcome';
}
