import { Query } from 'express-serve-static-core';

export interface ParamsID extends Query {
  id?: string;
}

export interface UploadFile {
  files?:
    | {
        [fieldname: string]: Express.Multer.File[];
      }
    | Express.Multer.File[]
    | undefined;
}

export interface JSONWithFileUpload extends UploadFile {
  document?: string;
}
