import Joi, { ObjectSchema, PartialSchemaMap } from 'joi';
import Base from '../base';

export default class Message extends Base {
  public getCreateVS(): ObjectSchema {
    const schema: PartialSchemaMap = {
      conversationId: this.isObjectId(true),
      desc: this.isString(true),
    };

    return Joi.object(schema);
  }
}
