import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// ✅ เพิ่ม Type Document เพื่อให้ Service เรียกใช้แล้วรู้จักทุก Field
export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  // ==========================================
  // 📦 SECTION: BASIC INFO (ข้อมูลพื้นฐาน)
  // ==========================================
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, min: 0 }) // ✅ เพิ่ม min: 0 กันราคาติดลบ
  price: number;

  @Prop()
  description: string;

  @Prop()
  category: string; // CPU, GPU, Mainboard, RAM, SSD, PSU, Case, Cooling

  @Prop()
  image: string; // รูปปกสินค้า

  // ✅ อัลบั้มรูปภาพเพิ่มเติม
  @Prop([String])
  gallery: string[];

  @Prop([String])
  colors: string[];

  @Prop()
  brand: string;

  // ==========================================
  // 📦 SECTION: STOCK & INVENTORY (เพิ่มความสมจริง)
  // ==========================================
  @Prop({ default: 10, min: 0 }) // ✅ เพิ่ม min: 0
  stock: number; 

  @Prop({ default: 0, min: 0 })  // ✅ เพิ่ม min: 0
  sold: number;

  // ==========================================
  // 🧠 SECTION 1: สมองคอมพิวเตอร์ (CPU & Processor)
  // ==========================================
  @Prop()
  socket: string;          // เช่น LGA1700, AM5
  
  @Prop()
  cpuSeries: string;       // เช่น Core i9, Ryzen 9
  
  @Prop()
  coresThreads: string;    // เช่น 24 Cores / 32 Threads
  
  @Prop()
  baseClock: string;       // ความเร็วเริ่มต้น
  
  @Prop()
  boostClock: string;      // ความเร็วสูงสุด

  @Prop()
  cache: string;           // เช่น 36MB L3 Cache

  // ==========================================
  // 🎮 SECTION 2: การ์ดจอ (GPU / Graphic Card)
  // ==========================================
  @Prop()
  gpuSeries: string;       // เช่น RTX 40 Series
  
  @Prop()
  gpuModel: string;        // เช่น RTX 4090
  
  @Prop()
  vram: string;            // เช่น 24GB GDDR6X
  
  @Prop()
  busWidth: string;        // เช่น 384-bit
  
  @Prop()
  cudaCores: number;       // เช่น 16384

  // ==========================================
  // 🔌 SECTION 3: เมนบอร์ด & หน่วยความจำ (Mainboard & RAM)
  // ==========================================
  @Prop()
  chipset: string;         // เช่น Z790
  
  @Prop()
  formFactor: string;      // เช่น ATX, ITX
  
  @Prop()
  memoryType: string;      // เช่น DDR5
  
  @Prop()
  memorySlot: number;      // จำนวนช่องเสียบแรม
  
  @Prop()
  maxCapacity: string;     // เช่น 128GB

  // ==========================================
  // 📦 SECTION 4: เคส (PC Case & Dimension)
  // ==========================================
  @Prop()
  caseType: string;        // เช่น Mid Tower
  
  @Prop()
  maxGpuLength: string;    // ใส่การ์ดจอได้ยาวสุดกี่ mm
  
  @Prop()
  maxCpuCoolerHeight: string; // ใส่ซิงค์ลมได้สูงกี่ mm
  
  @Prop()
  radiatorSupport: string; // รองรับหม้อน้ำ

  // ==========================================
  // 🔋 SECTION 5: พลังงาน & ความร้อน (PSU & Cooling)
  // ==========================================
  @Prop()
  wattage: string;         // เช่น 850W
  
  @Prop()
  efficiencyRating: string; // เช่น 80 Plus Gold
  
  @Prop()
  powerRequirement: string; // กำลังไฟที่แนะนำ

  // ==========================================
  // 🎖️ SECTION 6: การรับประกัน & อื่นๆ
  // ==========================================
  @Prop()
  warranty: string;        // เช่น 3 Years
  
  @Prop({ default: 0, min: 0 })
  points: number;          // แต้มอาคม
}

export const ProductSchema = SchemaFactory.createForClass(Product);