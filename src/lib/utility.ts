import { Pagination } from '../types/common';
import { mkdir, readdir } from 'fs/promises';
import { http } from 'follow-redirects';

import fs from 'fs';
import crypto from 'crypto';
class Utility {
  public isEmpty(val: string | any): boolean {
    return val == null || val === null || val.length === 0 || Object.keys(val).length === 0;
  }

  public pagination(page: number, limit: number): Pagination {
    return { offset: (page - 1) * limit, limit: limit };
  }
  public hash(noOfBytes: number) {
    return crypto.randomBytes(noOfBytes).toString('hex');
  }
  public generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  public async mediaDownload(url: string, path: string): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      http.get(url.replace('https', 'http'), (response) => {
        const statusCode = response.statusCode;

        if (statusCode === 302) {
          return reject('Redirect error!');
        }

        if (statusCode !== 200) {
          return reject('Download error!');
        }

        const writeStream = fs.createWriteStream(path);

        response.pipe(writeStream);

        writeStream.on('error', (error) => {
          reject('Error writing to file!' + error);
        });
        writeStream.on('finish', () => {
          writeStream.close();

          resolve(true);
        });
      });
    }).catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error);
    });
  }
  public async tmpDir(): Promise<string> {
    const path = `${__dirname}/../tmp`;
    try {
      await readdir(path);
    } catch (err) {
      await mkdir(path, { recursive: true });
    }
    return path as string;
  }
}

export default new Utility();
