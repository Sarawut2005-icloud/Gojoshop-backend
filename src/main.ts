import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // ✅ 1. เปิด CORS (สำคัญมาก)
  // เพื่อให้ Frontend (Port 3000) ยิง Request มาหา Backend (Port 3001) ได้
  app.enableCors(); 

  // ✅ 2. ตั้งค่า ValidationPipe แบบ Full Option
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,            // ตัด field ที่ไม่ได้อยู่ใน DTO ทิ้ง (กันคนส่งมั่ว)
    forbidNonWhitelisted: true, // แจ้ง Error ทันทีถ้ามี field แปลกปลอม
    transform: true,            // แปลง Payload ให้เป็น Instance ของ DTO
    
    // 🔥 HERO FEATURE: ช่วยแปลง "20000" (String) -> 20000 (Number) ให้อัตโนมัติ
    // จำเป็นมากเวลาส่งข้อมูลผ่าน FormData
    transformOptions: { 
      enableImplicitConversion: true 
    },
  }));
  
  // ✅ 3. รันที่ Port 3001 
  await app.listen(3001); 
  console.log(`🚀 Backend is running on: http://localhost:3001`);
}
bootstrap();