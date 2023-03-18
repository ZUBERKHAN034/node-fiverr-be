import Joi, { AnySchema, ObjectSchema, PartialSchemaMap } from 'joi';
import Base from '../base';

export default class Gig extends Base {
  private orderBy(isRequired: boolean): AnySchema {
    let schema = Joi.string().trim().valid('createdAt', 'sales');
    if (isRequired) {
      schema = schema.required();
    }
    return schema;
  }

  public getCreateVS(): ObjectSchema {
    const schema: PartialSchemaMap = {
      title: this.isString(true),
      desc: this.isString(true),
      cat: this.isString(true),
      cover: this.isString(true),
      shortTitle: this.isString(true),
      price: this.isNumber(true),
      shortDesc: this.isString(true),
      deliveryTime: this.isNumber(true),
      revisionNumber: this.isNumber(true),
      features: this.isStringArray(true),
      sales: this.isNumber(false),
      starNumber: this.isNumber(false),
      totalStars: this.isNumber(false),
      images: this.isStringArray(false),
    };

    return Joi.object(schema);
  }

  public getGigsVS(): ObjectSchema {
    const schema: PartialSchemaMap = {
      userId: this.isObjectId(false),
      cat: this.isString(false),
      min: this.isNumber(false),
      max: this.isNumber(false),
      search: this.isString(false),
      orderBy: this.orderBy(false),
    };

    return Joi.object(schema);
  }
}
