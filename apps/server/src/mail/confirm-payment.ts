// mailers/confirm-payment.ts
import { Mailer } from '.';

interface MailData {
  name?: string | undefined;
  order_id: string;
  amount: number;
  currency: string;
  invoice_url?: string | undefined;
}

export class ConfirmPaymentMailer extends Mailer<MailData> {
  protected template = 'confirm-payment';
}
