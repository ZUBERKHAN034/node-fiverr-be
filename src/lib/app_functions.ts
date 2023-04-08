import axios from 'axios';
import sharp from 'sharp';
import s3Helper from './s3_helper';
import constants from '../common/constants';

class AppFunctions {
  public async svgToPng(p: string | Buffer, { width, height }: { width?: number; height?: number }) {
    try {
      const instance = sharp(p);

      const metadata = await instance.metadata();

      const initDensity = metadata.density ?? 72;

      if (metadata.format !== 'svg') {
        return instance;
      }

      let wDensity = 0;
      let hDensity = 0;
      if (width && metadata.width) {
        wDensity = (initDensity * width) / metadata.width;
      }

      if (height && metadata.height) {
        hDensity = (initDensity * height) / metadata.height;
      }

      if (!wDensity && !hDensity) {
        // both width & height are not present and/or
        // can't detect both metadata.width & metadata.height
        return instance;
      }

      return sharp(p, { density: Math.max(wDensity, hDensity) })
        .resize(width, height)
        .png()
        .toBuffer();
    } catch (error) {
      throw new Error(error);
    }
  }

  public async generateAvatars(name: string): Promise<string> {
    const url = `https://api.dicebear.com/6.x/micah/svg?seed=${name}&facialHair[]&facialHairColor=transparent&hair=dannyPhantom,fonze,full,pixie,turban&mouth=laughing,nervous,pucker,sad,smile,smirk,surprised&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

    const { data: svgBuffer } = await axios.get(url, { responseType: 'arraybuffer', responseEncoding: 'binary' });
    const pngBuffer = await this.svgToPng(svgBuffer, { height: 512, width: 512 });

    const avatarUrl = await s3Helper.uploadToS3(
      pngBuffer,
      `${constants.AWS.ASSET_FOLDER.PUBLIC.USER}/${name}-${Date.now()}${constants.ENUMS.FILE_FORMAT.PNG}`
    );

    return avatarUrl;
  }
}

export default new AppFunctions();
