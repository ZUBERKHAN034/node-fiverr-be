import Joi, { AnySchema, ObjectSchema, PartialSchemaMap } from 'joi';
// import constants from '../common/constants';

export default class Base {
  protected id(isRequired: boolean): AnySchema {
    let schema = Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .message(`id is not valid ObjectId`);
    if (isRequired) {
      schema = schema.required();
    }
    return schema;
  }

  protected isNumber(isRequired: boolean): AnySchema {
    let schema = Joi.number();
    if (isRequired) {
      schema = schema.required();
    }
    return schema;
  }

  protected isString(isRequired: boolean): AnySchema {
    let schema = Joi.string().trim();
    if (isRequired) {
      schema = schema.required();
    }
    return schema;
  }

  protected isStringAlpha(isRequired: boolean): AnySchema {
    let schema = Joi.string().trim().alphanum();
    if (isRequired) {
      schema = schema.required();
    }
    return schema;
  }
  protected isBoolean(isRequired: boolean): AnySchema {
    let schema = Joi.bool();
    if (isRequired) {
      schema = schema.required();
    }
    return schema;
  }

  protected order(isRequired: boolean): AnySchema {
    let schema = Joi.string().trim().valid('asc', 'desc');
    if (isRequired) {
      schema = schema.required();
    }
    return schema;
  }

  public listAllVs(): ObjectSchema {
    const schema: PartialSchemaMap = {};

    schema.page = this.isString(true);
    schema.limit = this.isString(true);
    schema.order = this.order(true);
    schema.orderBy = this.isString(true);
    schema.search = this.isString(false);
    schema.isArchived = this.isBoolean(true);

    return Joi.object(schema);
  }
}
