import Joi, { ObjectSchema, PartialSchemaMap } from 'joi';
import Base from '../base';

export default class User extends Base {
  public getRegisterVS(): ObjectSchema {
    const schema: PartialSchemaMap = {
      username: this.isString(true),
      email: this.isEmail(true),
      password: this.isString(true),
      country: this.isString(true),
      gender: this.isGender(true),
      isSeller: this.isBoolean(true),
    };

    return Joi.object(schema);
  }

  public getLoginVS(): ObjectSchema {
    const schema: PartialSchemaMap = {
      username: this.isString(true),
      password: this.isString(true),
    };
    return Joi.object(schema);
  }

  public getSetupAcctProfileVs(): ObjectSchema {
    const schema: PartialSchemaMap = {
      img: this.isString(false),
      desc: this.isString(true),
      phone: this.isPhone(true),
    };

    return Joi.object(schema);
  }
}
