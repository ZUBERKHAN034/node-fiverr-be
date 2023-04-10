import Joi, { ObjectSchema, PartialSchemaMap } from 'joi';
import Base from '../base';

export default class Favorite extends Base {
  public getCreateVS(): ObjectSchema {
    const schema: PartialSchemaMap = {
      gigId: this.isObjectId(true),
      img: this.isString(true),
      title: this.isString(true),
      price: this.isNumber(true),
    };

    return Joi.object(schema);
  }
}
