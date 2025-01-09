import { forwardRef, Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { Cat, CatSchema } from './cats.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CatsRepository } from './cats.repository';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { MulterExtendedModule } from 'nestjs-multer-extended';

@Module({
    imports: [
        ConfigModule.forRoot(),
        MulterModule.register({
            dest: './upload',
        }),
        MulterExtendedModule.register({
            awsConfig: {
                accessKeyId: process.env.AWS_S3_ACCESS_KEY,
                secretAccessKey: process.env.AWS_S3_SECRET_KEY,
                region: process.env.AWS_S3_REGION,
            },
            bucket: process.env.AWS_S3_BUCKET,
            basePath: 'images',
            fileSize: 1 * 1024 * 1024,
        }),
        MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }]),
        forwardRef(() => AuthModule),
    ],
    controllers: [CatsController],
    providers: [CatsService, CatsRepository],
    exports: [CatsService, CatsRepository],
})
export class CatsModule { }
