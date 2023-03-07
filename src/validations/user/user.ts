import Joi, { AnySchema, ObjectSchema, PartialSchemaMap } from 'joi';
import constants from '../../common/constants';
import Base from '../base';

export default class VUser extends Base {
  private setPassType(isRequired: boolean): AnySchema {
    let schema = Joi.string()
      .trim()
      .valid(
        constants.ENUMS.HASH_TYPES.CREATE_NEW_ACCT,
        constants.ENUMS.HASH_TYPES.RESET_PASSWORD,
        constants.ENUMS.HASH_TYPES.INVITE_EMAIL
      );
    if (isRequired) {
      schema = schema.required();
    }
    return schema;
  }
  private email(isRequired: boolean): AnySchema {
    let schema = Joi.string().trim().email();
    if (isRequired) {
      schema = schema.required();
    }
    return schema;
  }

  public getCreateUserVS(isUpdated: boolean): ObjectSchema {
    const schema: PartialSchemaMap = {};
    schema.firstName = this.isStringAlpha(!isUpdated);
    schema.lastName = this.isStringAlpha(false);
    schema.email = this.email(!isUpdated);
    schema.password = this.isString(!isUpdated);

    return Joi.object(schema);
  }

  public getLoginVS(): ObjectSchema {
    const schema: PartialSchemaMap = {
      email: this.email(true),
      password: this.isString(true),
    };
    return Joi.object(schema);
  }
  public userByIdVS(): ObjectSchema {
    const schema: PartialSchemaMap = {};
    schema.id = this.id(true);
    return Joi.object(schema);
  }
  public getChangePasswordVS(): ObjectSchema {
    const schema: PartialSchemaMap = {};
    schema.oldPassword = this.isString(true);
    schema.password = this.isString(true);

    return Joi.object(schema);
  }

  public getUpdateVS(): ObjectSchema {
    const schema: PartialSchemaMap = {
      firstName: this.isStringAlpha(false),
      lastName: this.isStringAlpha(false),
      title: this.isString(false),
      zipCode: this.isString(false),
      city: this.isString(false),
      state: this.isString(false),
      country: this.isString(false),
      renewAccount: this.isBoolean(false),
      newCollection: this.isBoolean(false),
    };

    return Joi.object(schema);
  }
  public verifyEmail(): ObjectSchema {
    const schema: PartialSchemaMap = {};
    schema.email = this.email(true);

    return Joi.object(schema);
  }

  public getAuthVS(): ObjectSchema {
    const schema: PartialSchemaMap = {
      firstName: this.isStringAlpha(true),
      lastName: this.isStringAlpha(false),
      photo: this.isString(false),
      email: this.email(true),
      type: this.isString(false),
    };

    return Joi.object(schema);
  }
  public getSetPassword(): ObjectSchema {
    const schema: PartialSchemaMap = {};
    schema.hash = this.isString(true);
    schema.password = this.isString(true);
    schema.type = this.setPassType(true);

    return Joi.object(schema);
  }
  public getAcctProfile(): ObjectSchema {
    const schema: PartialSchemaMap = {};
    schema.firstName = this.isStringAlpha(false);
    schema.lastName = this.isStringAlpha(false);
    schema.title = this.isString(false);
    return Joi.object(schema);
  }
  public getEmail(): ObjectSchema {
    const schema: PartialSchemaMap = {};
    schema.hash = this.isString(true);

    return Joi.object(schema);
  }
  public DDListCountriesVS(): ObjectSchema {
    const schema: PartialSchemaMap = {};

    schema.limit = this.isNumber(false);
    schema.page = this.isNumber(false);
    schema.search = this.isString(false);

    return Joi.object(schema);
  }
  public DDListVS(): ObjectSchema {
    const schema: PartialSchemaMap = {};
    schema.id = this.id(true);
    schema.limit = this.isNumber(false);
    schema.page = this.isNumber(false);
    schema.search = this.isString(false);

    return Joi.object(schema);
  }
  public getBillingAddrsVS(): ObjectSchema {
    const schema: PartialSchemaMap = {
      name: this.isString(false),
      line1: this.isString(false),
      line2: this.isString(false),
      zipCode: this.isString(false),
      city: this.isString(false),
      state: this.isString(false),
      country: this.isString(false),
      isDefault: this.isBoolean(false),
    };
    return Joi.object(schema);
  }

  public verifyUpdatedEmail(): ObjectSchema {
    const schema: PartialSchemaMap = {};
    schema.newEmail = this.email(true);

    return Joi.object(schema);
  }

  public UpdatedEmail(): ObjectSchema {
    const schema: PartialSchemaMap = {};
    schema.hash = this.isString(true);
    schema.type = this.isString(true);
    return Joi.object(schema);
  }

  public getUserListVs(): ObjectSchema {
    const schema: PartialSchemaMap = {};

    schema.isArchived = this.isBoolean(true);
    schema.page = this.isString(true);
    schema.limit = this.isString(true);
    schema.order = this.order(true);
    schema.orderBy = this.isString(true);
    schema.search = this.isString(false);

    return Joi.object(schema);
  }
  public listAllReportsVs(): ObjectSchema {
    const schema: PartialSchemaMap = {};
    schema.page = this.isString(true);
    schema.limit = this.isString(true);
    schema.order = this.order(true);
    schema.orderBy = this.isString(true);
    schema.search = this.isString(false);

    return Joi.object(schema);
  }
  public ReportVs(): ObjectSchema {
    const schema: PartialSchemaMap = {};
    schema.id = this.id(true);
    schema.page = this.isString(true);
    schema.limit = this.isString(true);
    schema.order = this.order(true);
    schema.orderBy = this.isString(true);

    return Joi.object(schema);
  }
  public getInvoiceListVs(): ObjectSchema {
    const schema: PartialSchemaMap = {};

    schema.page = this.isString(true);
    schema.limit = this.isString(true);
    schema.order = this.order(true);
    schema.orderBy = this.isString(true);

    return Joi.object(schema);
  }
}
