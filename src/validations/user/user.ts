import Joi, { ObjectSchema, PartialSchemaMap } from 'joi';
import Base from '../base';

export default class User extends Base {
  public getRegisterVS(): ObjectSchema {
    const schema: PartialSchemaMap = {
      username: this.isString(true),
      email: this.email(true),
      password: this.isString(true),
      country: this.isString(true),
    };

    return Joi.object(schema);
  }

  public getLoginVS(): ObjectSchema {
    const schema: PartialSchemaMap = {
      email: this.email(true),
      password: this.isString(true),
    };
    return Joi.object(schema);
  }
}
