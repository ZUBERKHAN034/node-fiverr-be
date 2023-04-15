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

  public async generateAvatars(name: string, gender = 'male'): Promise<string> {
    const uniqueName = `${name}-${Date.now()}`;
    const male = `https://api.dicebear.com/6.x/avataaars/svg?seed=${uniqueName}&accessories=kurt,prescription01,prescription02,round,sunglasses,wayfarers&accessoriesProbability=30&clothing=blazerAndShirt,collarAndSweater,hoodie,shirtCrewNeck,shirtVNeck,graphicShirt,blazerAndSweater&eyebrows=angryNatural,default,defaultNatural,flatNatural,frownNatural,raisedExcited,raisedExcitedNatural,sadConcerned,sadConcernedNatural,upDown,upDownNatural,angry&facialHairColor=2c1b18,4a312c,transparent&hairColor=2c1b18,4a312c,724133,a55728,b58143,c93305,d6b370,f59797,ecdcbf,e8e1e1,transparent&skinColor=614335,d08b5b,edb98a,ffdbb4,ae5d29,f8d25c,fd9841&top=dreads01,dreads02,frizzle,hat,shaggy,shortCurly,shortFlat,shortRound,shortWaved,theCaesar,theCaesarAndSidePart,turban,winterHat02,winterHat03,winterHat04,winterHat1&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf,ff6d60,1dbf73,a020f0`;
    const female = `https://api.dicebear.com/6.x/avataaars/svg?seed=${uniqueName}&facialHairProbability=0&top%5B%5D=bigHair,bob,bun,curly,curvy,dreads,frida,fro,hijab,longButNotTooLong,miaWallace,shaggy,shaggyMullet,shavedSides,straightAndStrand,straight01,straight02&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf,ff6d60,1dbf73,a020f0`;
    const url = gender === 'male' ? male : female;
    const { data: svgBuffer } = await axios.get(url, { responseType: 'arraybuffer', responseEncoding: 'binary' });
    const pngBuffer = await this.svgToPng(svgBuffer, { height: 512, width: 512 });

    const avatarUrl = await s3Helper.uploadToS3(
      pngBuffer,
      `${constants.AWS.ASSET_FOLDER.PUBLIC.USER}/${uniqueName}${constants.ENUMS.FILE_FORMAT.PNG}`
    );

    return avatarUrl;
  }
}

export default new AppFunctions();
