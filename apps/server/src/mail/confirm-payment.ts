import { Mailer } from '~/mail';

interface MailData {}

export class ConfirmPaymentMailer extends Mailer<MailData> {
  protected template = 'confirm-payment';
}
