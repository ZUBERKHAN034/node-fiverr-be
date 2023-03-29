import Joi, { ObjectSchema, PartialSchemaMap } from 'joi';
import Base from '../base';

export default class Conversation extends Base {
  public getCreateVS(): ObjectSchema {
    const schema: PartialSchemaMap = {
      to: this.isObjectId(true),
    };

    return Joi.object(schema);
  }
}
