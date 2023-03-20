import Joi, { ObjectSchema, PartialSchemaMap } from 'joi';
import Base from '../base';

export default class Review extends Base {
  public getCreateVS(): ObjectSchema {
    const schema: PartialSchemaMap = {
      gigId: this.isObjectId(true),
      desc: this.isString(true),
      star: this.isNumber(true),
    };

    return Joi.object(schema);
  }
}
