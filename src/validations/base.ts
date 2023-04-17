import Joi, { AnySchema, ObjectSchema, PartialSchemaMap } from 'joi';

export default class Base {
  protected isObjectId(isRequired: boolean): AnySchema {
    let schema = Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .message(`"id" is not valid!`);
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

  protected isGender(isRequired: boolean): AnySchema {
    let schema = Joi.string().trim().valid('male', 'female');
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
  protected isEmail(isRequired: boolean): AnySchema {
    let schema = Joi.string().trim().email();
    if (isRequired) {
      schema = schema.required();
    }
    return schema;
  }
  protected isPhone(isRequired: boolean): AnySchema {
    let schema = Joi.string()
      .regex(/^.*(?<=\s)\d{10}$/)
      .message(`"phone" number is not valid!`);
    if (isRequired) {
      schema = schema.required();
    }
    return schema;
  }

  protected isSort(isRequired: boolean): AnySchema {
    let schema = Joi.string().trim().valid('asc', 'desc');
    if (isRequired) {
      schema = schema.required();
    }
    return schema;
  }

  protected isStringArray(isRequired: boolean): AnySchema {
    let schema = isRequired
      ? Joi.array().items(Joi.string().trim().required())
      : Joi.array().items(Joi.string().trim());

    if (isRequired) {
      schema = schema.required();
    }
    return schema;
  }

  public listAllVs(): ObjectSchema {
    const schema: PartialSchemaMap = {};

    schema.page = this.isString(true);
    schema.limit = this.isString(true);
    schema.order = this.isSort(true);
    schema.orderBy = this.isString(true);
    schema.search = this.isString(false);
    schema.isArchived = this.isBoolean(true);

    return Joi.object(schema);
  }

  public getIdVS(): ObjectSchema {
    const schema: PartialSchemaMap = {
      id: this.isObjectId(true),
    };
    return Joi.object(schema);
  }
}
