import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product, ProductSchema } from './entities/product.entity';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfigFactory } from '../common/utils/multer.config';
import { PRODUCT_STORAGE_FOLDER, PRODUCT_IMAGE } from './products.constants';

@Module({
  imports: [
    // 1. เชื่อมต่อ Database Schema
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    
    // 2. ตั้งค่า Multer สำหรับ Module นี้
    MulterModule.registerAsync(
      multerConfigFactory(PRODUCT_STORAGE_FOLDER, {
        maxSize: PRODUCT_IMAGE.MAX_SIZE,
        allowedMimeTypes: PRODUCT_IMAGE.ALLOWED_MIME_TYPES,
      }),
    ),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}