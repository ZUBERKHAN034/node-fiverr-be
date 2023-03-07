import sgMail from '@sendgrid/mail';
import * as fs from 'fs';
import { RequestParams } from '../types/common';

class Emailer {
  private from;
  constructor(key: string, from: { email: string; name: string }) {
    this.from = from;
    sgMail.setApiKey(key);
  }

  public renderRawTemplate(text: string = '', varsToReplace: Array<any> = []): string {
    let html = text;
    varsToReplace.forEach((v, _) => {
      const reg = new RegExp(v[0], 'g');
      html = html.replace(reg, v[1]);
    });
    return html;
  }

  public async sendEmail(to: string, subject: string, body: string): Promise<any> {
    try {
      const options: sgMail.MailDataRequired = {
        to,
        subject,
        html: body,
        from: {
          name: this.from.name,
          email: this.from.email,
        },
        category: 'non-promotions',
      };
      const sendgrid = await sgMail.send(options);
      return { status: true, sendgrid };
    } catch (error) {
      return { status: false, error: error };
    }
  }

  public async sendBulkEmail(to: Array<string>, subject: string, body: string): Promise<any> {
    try {
      const options: sgMail.MailDataRequired = {
        to,
        subject,
        html: body,
        from: {
          name: this.from.name,
          email: this.from.email,
        },
        category: 'non-promotions',
      };
      const sendgrid = await sgMail.send(options);
      return { status: true, sendgrid };
    } catch (error) {
      return { status: false, error: error };
    }
  }
  public renderEmailTemplate(name: string, vars: RequestParams, folder = 'email-templates'): string {
    let html = fs.readFileSync(`${__dirname}/../public/${folder}/${name}.html`, 'utf8');
    const keys = Object.keys(vars);
    keys.forEach((key) => {
      const reg = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(reg, vars[key]);
    });
    return html;
  }
}

export default Emailer;
