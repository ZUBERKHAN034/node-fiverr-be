import os from 'os';
import fs from 'fs';
import path from 'path';
const tmpdir = os.tmpdir();

export default class file_manager {
  public writeFileLocally(filename: string, content: any): Promise<string> {
    const localPath = path.join(tmpdir, filename);
    return new Promise((res, rej) => {
      fs.writeFile(localPath, content, function (err) {
        if (err) {
          rej(err);
        }
        res(localPath);
      });
    });
  }

  public deleteLocalFile(filename: string) {
    try {
      fs.unlinkSync(filename);
    } catch (_err) {}
  }
}
