import { RequestParams } from '../types/common';
import * as fs from 'fs';
import * as SibApiV3Sdk from 'sib-api-v3-typescript';

class Emailer {
  private apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  private from;
  constructor(key: string, from: { email: string; name: string }) {
    this.from = from;
    this.apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, key);
  }

  public async sendEmail(to: string, subject: string, body: string): Promise<any> {
    try {
      const sendSmtpEmail = {
        sender: {
          name: this.from.name,
          email: this.from.email,
        },
        to: [
          {
            email: to,
          },
        ],
        subject: subject,
        htmlContent: body,
      };
      const sendInBlue = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      return { status: true, sendInBlue };
    } catch (error) {
      return { status: false, error: error };
    }
  }

  public async sendBulkEmail(to: Array<string>, subject: string, body: string): Promise<any> {
    try {
      const sendSmtpEmail = {
        sender: {
          name: this.from.name,
          email: this.from.email,
        },
        to: to.map((email) => ({ email })), // Convert array of emails to array of objects
        subject: subject,
        htmlContent: body,
      };
      const sendInBlue = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      return { status: true, sendInBlue };
    } catch (error) {
      return { status: false, error: error };
    }
  }

  // Email HTML render function
  public renderEmailTemplate(name: string, vars: RequestParams, folder = 'email-templates'): string {
    let html = fs.readFileSync(`${__dirname}/../public/${folder}/${name}.html`, 'utf8');
    const keys = Object.keys(vars);
    keys.forEach((key) => {
      const reg = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(reg, vars[key]);
    });
    return html;
  }

  // General HTML render function
  public renderRawTemplate(text: string = '', varsToReplace: Array<any> = []): string {
    let html = text;
    varsToReplace.forEach((v, _) => {
      const reg = new RegExp(v[0], 'g');
      html = html.replace(reg, v[1]);
    });
    return html;
  }
}

export default Emailer;
