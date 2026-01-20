import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // --- 1. โหลดค่า Config จาก .env ---
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // --- 2. เชื่อมต่อฐานข้อมูล MongoDB ---
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        // 🔥 เพิ่มตัวนี้แก้ปัญหา Backend ช้า/ค้าง
        // ถ้าต่อ DB ไม่ได้ภายใน 5 วิ ให้แจ้ง Error เลย (ไม่ต้องรอนาน)
        serverSelectionTimeoutMS: 5000, 
      }),
      inject: [ConfigService],
    }),

    // --- 3. เปิดการเข้าถึงรูปภาพ (Serve Static) ---
    ServeStaticModule.forRoot({
      // ✅ ใช้ process.cwd() ชี้ไปที่โฟลเดอร์ uploads หน้าบ้านสุด (ระดับเดียวกับ src)
      rootPath: join(process.cwd(), 'uploads'), 
      serveRoot: '/uploads', // URL สำหรับเรียกรูป (http://localhost:3001/uploads/...)
    }),

    // --- 4. Modules ของระบบ ---
    ProductsModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}