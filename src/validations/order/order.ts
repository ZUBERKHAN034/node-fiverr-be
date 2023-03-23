import Joi, { ObjectSchema, PartialSchemaMap } from 'joi';
import Base from '../base';

export default class Order extends Base {
  public getCreateVS(): ObjectSchema {
    const schema: PartialSchemaMap = {
      gigId: this.isObjectId(true),
    };

    return Joi.object(schema);
  }
}
