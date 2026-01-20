import { 
  Controller, Get, Post, Body, Patch, Param, Delete, Query, 
  UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator 
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express'; 
import type { Express } from 'express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ✅ [แก้ไข] เพิ่ม FileInterceptor เพื่อรับรูปภาพ
  @Post()
  @UseInterceptors(FileInterceptor('image')) // รับไฟล์ชื่อ 'image' จาก FormData
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false, // ไม่บังคับว่าต้องมีรูป (เพราะใน DTO เป็น Optional)
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // จำกัดขนาด 5MB
        ],
      }),
    )
    file?: Express.Multer.File, // รับไฟล์เข้ามาในตัวแปรนี้
  ) {
    // ส่งทั้งข้อมูลสินค้า และ ไฟล์ ไปให้ Service
    return this.productsService.create(createProductDto, file);
  }

  // ✅ Endpoint สำหรับ Dashboard (ของเดิม)
  @Get('stats')
  getStats() {
    return this.productsService.getStats();
  }

  // ✅ Search & Filter (ของเดิม)
  @Get()
  findAll(@Query() query: any) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  // ✅ [แก้ไข] เพิ่ม FileInterceptor เพื่อรับรูปภาพใหม่ตอนแก้ไข
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string, 
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
        ],
      }),
    )
    file?: Express.Multer.File,
  ) {
    return this.productsService.update(id, updateProductDto, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
  
  // ✅ Coupon API (ของเดิม)
  @Post('coupon')
  checkCoupon(@Body() body: any) {
      if (body.code === 'SAVE30') return { code: 'SAVE30', discount: 30, message: 'ส่วนลด 30% ใช้งานได้', category: 'all' };
      return { message: 'ไม่พบโค้ด' };
  } 

  // ✅ Checkout API (ของเดิม)
  @Post('checkout')
  checkout(@Body() orderData: any) {
    console.log('Order received:', orderData); 
    return this.productsService.checkout(orderData.items); 
  } 
}