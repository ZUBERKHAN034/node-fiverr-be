import path from 'path';
import constants from '../common/constants';
import fs from 'fs';
import utility from './utility';
import os from 'os';
import { S3Client, GetObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const tmpdir = os.tmpdir();

class s3Helper {
  public s3Client(): S3Client {
    const s3 = new S3Client({
      region: process.env.REGION,
      endpoint: process.env.ENDPOINT as string,
      credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY,
      },
    });
    return s3;
  }

  public async uploadToS3(file: any, pathToFile: string) {
    const extensionType = path.extname(pathToFile);
    const uploadParams: PutObjectCommandInput = {
      Bucket:
        extensionType == constants.ENUMS.FILE_FORMAT.PNG ? constants.AWS.BUCKET_PUBLIC : constants.AWS.BUCKET_PRIVATE,
      Key: pathToFile,
      Body: file,
      ContentType:
        extensionType == constants.ENUMS.FILE_FORMAT.PNG
          ? constants.ENUMS.MIME_TYPE.IMAGE.PNG
          : constants.ENUMS.MIME_TYPE.IMAGE.SVG,
      ACL:
        extensionType == constants.ENUMS.FILE_FORMAT.PNG
          ? constants.ENUMS.ACL_TYPE.PUBLIC
          : constants.ENUMS.ACL_TYPE.PRIVATE,
    };
    const s3 = this.s3Client();
    const upload: Upload = new Upload({
      client: s3,
      params: uploadParams,
    });
    // start upload
    const metaData = await upload.done();
    return metaData['Location'];
  }

  public async downloadS3Media(url: string, folder: string): Promise<any> {
    const filename = path.basename(url);
    const extensionType = path.extname(url);
    const localPath = path.join(tmpdir, filename);
    const s3 = this.s3Client();
    let keyName = filename;

    if (!utility.isEmpty(folder)) {
      keyName = `${folder}/${filename}`;
    }

    var bucketParams = {
      Bucket:
        extensionType == constants.ENUMS.FILE_FORMAT.PNG
          ? constants.ENUMS.ACL_TYPE.PUBLIC
          : constants.ENUMS.ACL_TYPE.PRIVATE,
      Key: keyName,
    };

    let writeStream = fs.createWriteStream(localPath);
    var fileStream = await s3.send(new GetObjectCommand(bucketParams));

    fileStream.Body.pipe(writeStream);
    return localPath;
  }
  public async getS3File(url: string, folder: string): Promise<any> {
    try {
      const filename = path.basename(url);
      const s3 = this.s3Client();
      let keyName = filename;

      if (!utility.isEmpty(folder)) {
        keyName = `${folder}/${filename}`;
      }

      var bucketParams = {
        Bucket: constants.AWS.BUCKET_PRIVATE,
        Key: keyName,
      };
      const getObject = await s3.send(new GetObjectCommand(bucketParams));
      return {
        filename: path.basename(getObject.Body.req.path, '.svg?x-id=GetObject'),
        buffer: getObject.Body._readableState.buffer.head.data,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  public async downloadPrivateFile(url: string, folder: string): Promise<any> {
    const filename = path.basename(url);

    const localPath = path.join(tmpdir, filename);

    const s3 = this.s3Client();
    let keyName = filename;

    if (!utility.isEmpty(folder)) {
      keyName = `${folder}/${filename}`;
    }

    var bucketParams = {
      Bucket: constants.AWS.BUCKET_PRIVATE,
      Key: keyName,
      ResponseContentType: constants.ENUMS.MIME_TYPE.IMAGE.SVG,
    };
    const command = new GetObjectCommand(bucketParams);
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    const state = await utility.mediaDownload(signedUrl, localPath);

    if (state === true) {
      return localPath;
    }
  }
}

export default new s3Helper();
