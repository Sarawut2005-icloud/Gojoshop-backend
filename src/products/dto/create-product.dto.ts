import { IsNotEmpty, IsString, IsNumber, Min, IsOptional, IsArray, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer'; // ✅ Import Transform เพิ่ม

export class CreateProductDto {
  @IsNotEmpty({ message: 'ชื่อสินค้าห้ามเว้นว่าง' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'กรุณาระบุราคา' })
  @IsNumber()
  @Min(0)
  @Max(10000000) // เพิ่ม Max กันเลขเวอร์เกินจริง
  @Type(() => Number)
  price: number;

  // ✅ [เพิ่มใหม่] สต็อกสินค้า
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  stock?: number = 10; // Default 10

  // ✅ [เพิ่มใหม่] จำนวนที่ขายไป
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  sold?: number = 0;

  @IsOptional() 
  @IsString() 
  description?: string;

  @IsOptional() 
  @IsString() 
  category?: string;

  @IsOptional() 
  @IsString() 
  image?: string; // Path รูปปก (Controller จะจัดการให้)

  // ✅ [แก้ไขเพิ่ม] จัดการ Array รูปภาพ (Gallery)
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') return [value]; // ถ้ามาเป็น string ตัวเดียว ให้ใส่ []
    if (Array.isArray(value)) return value;        // ถ้าเป็น array อยู่แล้วก็ใช้เลย
    return [];
  })
  @IsArray()
  @IsString({ each: true })
  gallery?: string[];

  // ✅ [แก้ไขเพิ่ม] จัดการ Array สี (Colors)
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') return [value];
    if (Array.isArray(value)) return value;
    return [];
  })
  @IsArray()
  @IsString({ each: true })
  colors?: string[];

  @IsOptional() 
  @IsString() 
  brand?: string;

  // ==========================================
  // 🧠 CPU Section
  // ==========================================
  @IsOptional() @IsString() socket?: string;
  @IsOptional() @IsString() cpuSeries?: string;
  @IsOptional() @IsString() coresThreads?: string;
  @IsOptional() @IsString() baseClock?: string;
  @IsOptional() @IsString() boostClock?: string;
  @IsOptional() @IsString() cache?: string;

  // ==========================================
  // 🎮 GPU Section
  // ==========================================
  @IsOptional() @IsString() gpuSeries?: string;
  @IsOptional() @IsString() gpuModel?: string;
  @IsOptional() @IsString() vram?: string;
  @IsOptional() @IsString() busWidth?: string;
  @IsOptional() @IsNumber() @Type(() => Number) cudaCores?: number;

  // ==========================================
  // 🔌 Mainboard & RAM Section
  // ==========================================
  @IsOptional() @IsString() chipset?: string;
  @IsOptional() @IsString() formFactor?: string;
  @IsOptional() @IsString() memoryType?: string;
  @IsOptional() @IsNumber() @Type(() => Number) memorySlot?: number;
  @IsOptional() @IsString() maxCapacity?: string;

  // ==========================================
  // 📦 Case Section
  // ==========================================
  @IsOptional() @IsString() caseType?: string;
  @IsOptional() @IsString() maxGpuLength?: string;
  @IsOptional() @IsString() maxCpuCoolerHeight?: string;
  @IsOptional() @IsString() radiatorSupport?: string;

  // ==========================================
  // 🔋 PSU & Power Section
  // ==========================================
  @IsOptional() @IsString() wattage?: string;
  @IsOptional() @IsString() efficiencyRating?: string;
  @IsOptional() @IsString() powerRequirement?: string;

  // ==========================================
  // 🎖️ Warranty & Gacha Points
  // ==========================================
  @IsOptional() @IsString() warranty?: string;
  
  @IsOptional() 
  @IsNumber() 
  @Min(0) 
  @Type(() => Number) 
  points?: number;
}