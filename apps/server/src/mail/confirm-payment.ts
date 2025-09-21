// mailers/confirm-payment.ts
import { Mailer } from '~/mail';

interface MailData {
  name?: string | undefined;
  order_id: string;
  amount: number;
  currency: string;
  account_url?: string | undefined;
}

export class ConfirmPaymentMailer extends Mailer<MailData> {
  protected template = 'confirm-payment';
}
