import sharp from 'sharp';
import constants from '../common/constants';
import utility from './utility';
import * as cheerio from 'cheerio';
import path from 'path';
import fs from 'fs/promises';
import os from 'os';
import s3Helper from './s3_helper';
import { Getfile, ProductEdit } from '../types/request/product';

const tmpdir = os.tmpdir();

class AppFunctions {
  private async svgEditor(svgData: Buffer | string, params: ProductEdit): Promise<string> {
    // methods explanations -> https://cheerio.js.org/classes/Cheerio.html

    const $ = await cheerio.load(svgData, { xmlMode: true });
    if (!utility.isEmpty(params.size)) {
      $('svg').attr('height', `${params.size}px`);
      $('svg').attr('width', `${params.size}px`);
    }
    if (!utility.isEmpty(params.bgColor)) {
      $('svg').prepend(`<rect width="100%" height="100%" fill=${params.bgColor} />`);
    }
    if (!utility.isEmpty(params.fill)) {
      $('path').attr('fill', params.fill);
    }
    if (!utility.isEmpty(params.strokeColor)) {
      $('path').attr('stroke', params.strokeColor);
    }
    if (!utility.isEmpty(params.strokeWidth)) {
      $('path').attr('stroke-width', params.strokeWidth);
    }

    return $.xml();
  }
  public userSortFields(sortBy: string, order: string) {
    let sortOrder: number = -1;
    order === 'desc' ? (sortOrder = -1) : (sortOrder = 1);
    switch (sortBy) {
      case constants.ENUMS.USER_LIST_SORT_BY.FULL_NAME:
        return { firstName: sortOrder };
      case constants.ENUMS.USER_LIST_SORT_BY.EMAIL:
        return { email: sortOrder };
      case constants.ENUMS.USER_LIST_SORT_BY.LASTACTIVITY:
        return { lastActivity: sortOrder };
      case constants.ENUMS.USER_LIST_SORT_BY.PLAN:
        return { plan: sortOrder };
      case constants.ENUMS.USER_LIST_SORT_BY.TYPE:
        return { type: sortOrder };
      default:
        return { createdAt: -1 };
    }
  }

  public reportsSortFields(sortBy: string, order: string) {
    let sortOrder: number = -1;
    order === 'desc' ? (sortOrder = -1) : (sortOrder = 1);
    switch (sortBy) {
      case constants.ENUMS.REPORTS_LIST_SORT_BY.FULL_NAME:
        return { firstName: sortOrder };
      case constants.ENUMS.REPORTS_LIST_SORT_BY.PLAN:
        return { plan: sortOrder };
      case constants.ENUMS.REPORTS_LIST_SORT_BY.EMAIL:
        return { email: sortOrder };
      case constants.ENUMS.REPORTS_LIST_SORT_BY.RECENT_DOWNLOAD_DATE:
        return { recentDownloadDate: sortOrder };
      case constants.ENUMS.REPORTS_LIST_SORT_BY.DOWNLOADS:
        return { downloads: sortOrder };
      default:
        return { createdAt: -1 };
    }
  }

  public reportSortFields(sortBy: string, order: string) {
    let sortOrder: number = -1;
    order === 'desc' ? (sortOrder = -1) : (sortOrder = 1);
    switch (sortBy) {
      case constants.ENUMS.REPORT_LIST_SORT_BY.LABEL:
        return { label: sortOrder };
      case constants.ENUMS.REPORT_LIST_SORT_BY.VARIANT_TYPE:
        return { variantType: sortOrder };
      case constants.ENUMS.REPORT_LIST_SORT_BY.TAGS:
        return { tags: sortOrder };
      case constants.ENUMS.REPORT_LIST_SORT_BY.CATEGORY:
        return { category: sortOrder };
      case constants.ENUMS.REPORT_LIST_SORT_BY.ISFREE:
        return { isFree: sortOrder };
      default:
        return { createdAt: -1 };
    }
  }
  public invoiceSortFields(sortBy: string, order: string) {
    let sortOrder: number = -1;
    order === 'desc' ? (sortOrder = -1) : (sortOrder = 1);
    switch (sortBy) {
      case constants.ENUMS.INVOICE_LIST_SORT_BY.DATE:
        return { date: sortOrder };
      case constants.ENUMS.INVOICE_LIST_SORT_BY.DESCRIPTION:
        return { description: sortOrder };
      case constants.ENUMS.INVOICE_LIST_SORT_BY.AMOUNT:
        return { amount: sortOrder };
      case constants.ENUMS.INVOICE_LIST_SORT_BY.STATUS:
        return { status: sortOrder };
      default:
        return { createdAt: -1 };
    }
  }

  public productSortFields(sortBy: string, order: string) {
    let sortOrder: number = -1;
    order === 'desc' ? (sortOrder = -1) : (sortOrder = 1);
    switch (sortBy) {
      case constants.ENUMS.PRODUCT_LIST_SORT_BY.NAME:
        return { name: sortOrder };
      case constants.ENUMS.PRODUCT_LIST_SORT_BY.CATEGORY:
        return { category: sortOrder };
      case constants.ENUMS.PRODUCT_LIST_SORT_BY.PRICE:
        return { price: sortOrder };
      case constants.ENUMS.PRODUCT_LIST_SORT_BY.TAGS:
        return { tags: sortOrder };
      case constants.ENUMS.PRODUCT_LIST_SORT_BY.DATE:
        return { createdAt: sortOrder };
      default:
        return { createdAt: -1 };
    }
  }

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
  public async processSvg(file: Getfile, params: ProductEdit, fileType?: string): Promise<any> {
    try {
      const localPath = path.join(tmpdir, file.filename);
      const strSVG = await this.svgEditor(file.buffer, params);
      const inputSvg = Buffer.from(strSVG, 'utf-8');

      if (fileType) {
        // edited svg download
        if (fileType == constants.ASSET_FOLDER_PATH.SVG) {
          await fs.writeFile(`${localPath}${constants.ENUMS.FILE_FORMAT.SVG}`, inputSvg);

          return {
            filePath: `${localPath}${constants.ENUMS.FILE_FORMAT.SVG}`,
            mimeType: constants.ENUMS.MIME_TYPE.IMAGE.SVG,
          };
        }
        // edited png download

        const inputPng = await sharp(inputSvg).png().toBuffer();
        await fs.writeFile(`${localPath}${constants.ENUMS.FILE_FORMAT.PNG}`, inputPng);

        return {
          filePath: `${localPath}${constants.ENUMS.FILE_FORMAT.PNG}`,
          mimeType: constants.ENUMS.MIME_TYPE.IMAGE.PNG,
        };
      }
      // preview png
      const inputPreviewPng = await sharp(inputSvg).png().toBuffer();
      await fs.writeFile(`${localPath}-PREVIEW${constants.ENUMS.FILE_FORMAT.PNG}`, inputPreviewPng);
      return {
        filePath: `${localPath}-PREVIEW${constants.ENUMS.FILE_FORMAT.PNG}`,
        mimeType: constants.ENUMS.MIME_TYPE.IMAGE.PNG,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
  public async downloadProduct(pngUrl: string, svgUrl: string, fileType?: string): Promise<any> {
    try {
      if (fileType) {
        //svg download
        if (fileType == constants.ASSET_FOLDER_PATH.SVG) {
          const path = await s3Helper.downloadS3Media(svgUrl, constants.ASSET_FOLDER_PATH.SVG);
          return { filePath: path, mimeType: constants.ENUMS.MIME_TYPE.IMAGE.SVG };
        }
      }
      //png download
      const path = await s3Helper.downloadS3Media(pngUrl, constants.ASSET_FOLDER_PATH.PNG);

      return { filePath: path, mimeType: constants.ENUMS.MIME_TYPE.IMAGE.PNG };
    } catch (error) {
      throw new Error(error);
    }
  }
}

export default new AppFunctions();
