import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './entities/product.entity'; // หรือ schemas/product.schema แล้วแต่ path คุณ
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Express } from 'express'; // ✅ Import Type สำหรับไฟล์

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}

  // ✅ [Helper] ฟังก์ชันแปลง Path ไฟล์ให้เป็น URL สวยๆ (ตัด 'uploads/' ออก)
  private toPublicImagePath(filePath: string): string {
    if (!filePath) return '';
    // 1. เปลี่ยน Backslash (\) ของ Windows เป็น Slash (/)
    const normalized = filePath.replace(/\\/g, '/');
    // 2. ตัดคำว่า 'uploads/' ข้างหน้าออก เพื่อให้เก็บแค่ 'products/xxxx.jpg'
    return normalized.replace(/^uploads\//, '');
  }

  // ✅ 1. สร้างสินค้า (รับไฟล์รูปภาพเพิ่ม)
  async create(createProductDto: CreateProductDto, file?: Express.Multer.File): Promise<Product> {
    const productData = { ...createProductDto };

    // ถ้ามีไฟล์แนบมา ให้บันทึก Path ลงใน field 'image'
    if (file) {
      productData.image = this.toPublicImagePath(file.path);
    }

    const createdProduct = new this.productModel(productData);
    return createdProduct.save();
  }

  // ✅ 2. ข้อมูล Dashboard (Real Data + Mock Graphs)
  async getStats() {
    const products = await this.productModel.find().exec();
    
    // --- 📊 ข้อมูลจริงจาก Database ---
    const totalItems = products.length;
    // มูลค่าสต็อกรวม = ราคา x จำนวนที่เหลือ
    const totalValue = products.reduce((sum, item) => sum + (item.price * (item.stock || 0)), 0);
    // สินค้าที่หมดสต็อก
    const outOfStock = products.filter(item => (item.stock || 0) <= 0).length;
    // สินค้าใกล้หมด (น้อยกว่า 5 ชิ้น)
    const lowStock = products.filter(item => (item.stock || 0) < 5);

    // --- 📈 ข้อมูลกราฟจำลอง (Mock Data) ---
    const dailyData = [
      { name: 'Mon', total: totalValue * 0.05 },
      { name: 'Tue', total: totalValue * 0.08 },
      { name: 'Wed', total: totalValue * 0.06 },
      { name: 'Thu', total: totalValue * 0.12 },
      { name: 'Fri', total: totalValue * 0.15 },
      { name: 'Sat', total: totalValue * 0.25 }, 
      { name: 'Sun', total: totalValue * 0.20 }, 
    ];

    return {
      totalItems,
      totalValue,
      outOfStock,
      lowStock,
      dailyData
    };
  }

  // ✅ 3. ค้นหาและกรองสินค้า (Search Engine)
  async findAll(query: any): Promise<Product[]> {
    const { keyword, minPrice, maxPrice, sort, category, brands } = query;
    let filter: any = {};

    // ค้นหา Keyword
    if (keyword) {
      filter.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { brand: { $regex: keyword, $options: 'i' } },
        { category: { $regex: keyword, $options: 'i' } },
      ];
    }

    // กรองราคา
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // กรองหมวดหมู่
    if (category && category !== 'All') {
        const categories = category.split(',');
        filter.category = { $in: categories };
    }

    // กรองแบรนด์
    if (brands) {
        filter.brand = { $in: brands.split(',') };
    }

    // เรียงลำดับ
    let sortOption: any = {};
    if (sort === 'asc') sortOption.price = 1;
    if (sort === 'desc') sortOption.price = -1;
    if (!sort) sortOption.createdAt = -1;

    return this.productModel.find(filter).sort(sortOption).exec();
  }

  // ✅ 4. ดูสินค้าชิ้นเดียว
  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) throw new NotFoundException(`Product #${id} not found`);
    return product;
  }

  // ✅ 5. แก้ไขสินค้า (รับไฟล์รูปภาพใหม่เพิ่ม)
  async update(id: string, updateProductDto: UpdateProductDto, file?: Express.Multer.File): Promise<Product> {
    const updateData = { ...updateProductDto };

    // ถ้ามีการอัปโหลดรูปใหม่ ให้เอา Path ใหม่ไปทับอันเดิม
    if (file) {
      updateData.image = this.toPublicImagePath(file.path);
    }

    const existingProduct = await this.productModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    
    if (!existingProduct) throw new NotFoundException(`Product #${id} not found`);
    return existingProduct;
  }

  // ✅ 6. ลบสินค้า
  async remove(id: string): Promise<Product> {
    const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();
    if (!deletedProduct) throw new NotFoundException(`Product #${id} not found`);
    return deletedProduct;
  }

  // ✅✅ 7. ระบบชำระเงิน & ตัดสต็อก (Real Logic)
  async checkout(items: any[]) {
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    const soldItems: string[] = [];

    for (const item of items) {
      const productId = item._id || item.id;
      const product = await this.productModel.findById(productId);

      if (product) {
        if (product.stock > 0) {
          product.stock = product.stock - 1;       // ลดสต็อก
          product.sold = (product.sold || 0) + 1;  // เพิ่มยอดขายสะสม
          
          await product.save(); 
          
          soldItems.push(product.name); 
        } else {
          console.warn(`[Stock Error] สินค้า ${product.name} หมดแล้ว ตัดไม่ได้`);
        }
      }
    }

    return {
      success: true,
      message: 'ตัดสต็อกเรียบร้อย',
      orderId: orderId,
      itemsProcessed: soldItems,
      timestamp: new Date()
    };
  }
}