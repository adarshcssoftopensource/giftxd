import { Controller, Get, Param, Res } from '@nestjs/common';
import { PdfService } from './pdf.service';
// import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@Controller('pdf')
@ApiTags('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  // @Get(':orderId')
  // async getOrderPdf(@Param('orderId') orderId: string, @Res() res: any) {
  //   // Here you would get your order details using the orderId
  //   const orderData = {}; // Your order data here
  //   const pdfBuffer = await this.pdfService.createPdf(orderData);

  //   res.set({
  //     'Content-Type': 'application/pdf',
  //     'Content-Disposition': 'attachment; filename=order.pdf',
  //   });

  //   res.end(pdfBuffer, 'binary');
  // }
}
