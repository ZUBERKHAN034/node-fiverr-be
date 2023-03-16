import Joi, { ObjectSchema, PartialSchemaMap } from 'joi';
import Base from '../base';

export default class User extends Base {
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
      sales: this.isNumber(false),
      starNumber: this.isNumber(false),
      totalStars: this.isNumber(false),
      images: this.isStringArray(false),
      features: this.isStringArray(false),
    };

    return Joi.object(schema);
  }

  public getDeleteVS(): ObjectSchema {
    const schema: PartialSchemaMap = {
      id: this.isObjectId(true),
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
      sort: this.isSort(false),
    };

    return Joi.object(schema);
  }
}
