import { join } from 'path';
import { constants, Template } from '@walletpass/pass-js';
import { ApplePass } from '@walletpass/pass-js/dist/interfaces';
import { NextFunction, Request, Response } from 'express';
import env from '@/server/env';

class BarcodePass {
  static template: Template;

  static templateFolder = join(__dirname, './barcode.pass');

  static async getTempalte() {
    if (this.template) {
      return this.template;
    }
    this.template = await Template.load(this.templateFolder);
    await this.template.loadCertificate(
      join(this.templateFolder, ''),
      env.APPLE_PASS_CERTIFICATE_PASSWORD
    );

    return this.template;
  }
}

const passJson: Partial<ApplePass> = {
  description: 'SMMJ Design',
  passTypeIdentifier: '',
  organizationName: '',
  teamIdentifier: 'VUTU7AKEUR',
  backgroundColor: 'rgb(52,80,81)',
  // foregroundColor: 'rgb(255, 255, 255)',
  // labelColor: 'rgb(50, 50, 50)',
  // for blur background
  eventTicket: {},

  // for strip image
  // coupon: {},
};

export default async function appleWalletHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const barcode = '/ROIFOXP';
    const template = await BarcodePass.getTempalte();
    const pass = template.createPass({
      ...passJson,
      serialNumber: barcode,
      barcodes: [
        {
          message: barcode,
          altText: barcode,
          format: 'PKBarcodeFormatCode128',
          messageEncoding: 'iso-8859-1',
        },
      ],
    });
    const buf = await pass.asBuffer();
    res.type(constants.PASS_MIME_TYPE);
    res.send(buf);
  } catch (error) {
    console.error(error);
    next(error);
  }
}
