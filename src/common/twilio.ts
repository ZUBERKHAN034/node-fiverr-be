import { Twilio } from 'twilio';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';

declare type searchTwilio = {
  phoneNumberType: string;
  countryCode: string;
};
declare type buyTwilio = {
  phoneNumber: string;
  friendlyName: string;
};

export interface TwiloMsg {
  body: string;
  from: string;
  to: string;
  statusCallback?: string;
}

export default class TwilioManager {
  private client: Twilio;
  constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    this.client = new Twilio(accountSid, authToken);
  }

  public async sendSMS(msgOps: TwiloMsg, callBack: boolean = false): Promise<MessageInstance | Error> {
    try {
      msgOps.from = msgOps.from.includes('+') ? msgOps.from : '+1' + msgOps.from;

      if (callBack) {
        msgOps.statusCallback = `${process.env.CF_BASE_URL}/twilio/webhook`;
      }
      const result = await this.client.messages.create(msgOps);
      return result;
    } catch (error) {
      return error;
    }
  }

  public async searchTwilioNumber(searchTwilio: searchTwilio) {
    try {
      return new Promise<any | Error>(async (resolve, reject) => {
        await this.client
          .availablePhoneNumbers(searchTwilio.countryCode)
          .local.list({ contains: searchTwilio.phoneNumberType })
          .then((local) => {
            return resolve(local);
          })
          .catch((error) => {
            return reject(error);
          });
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async buyTwilioNumber(buyTwilio: buyTwilio) {
    try {
      return new Promise<any | Error>(async (resolve, reject) => {
        await this.client.incomingPhoneNumbers
          .create({
            phoneNumber: buyTwilio.phoneNumber,
            smsUrl: 'https://us-central1-arrow-live-enviro.cloudfunctions.net/webhooks',
            friendlyName: buyTwilio.friendlyName,
          })
          .then((incoming_phone_number) => {
            return resolve(incoming_phone_number);
          })
          .catch((error) => {
            return reject(error);
          });
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
