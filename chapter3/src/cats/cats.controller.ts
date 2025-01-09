import { Controller, Delete, Get, HttpException, Param, ParseIntPipe, Patch, Post, Put, UseFilters, UseInterceptors, Body, UseGuards, Req, UploadedFile } from '@nestjs/common';
import { CatsService } from './cats.service';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { CatRequestDto } from './dto/cate.request.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Cat } from './cats.schema';
import { ReadOnlyCatDto } from './dto/cat.dto';
import { AuthService } from 'src/auth/auth.service';
import { LoginRequestDto } from 'src/auth/dto/login.request.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decoratos';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AmazonS3FileInterceptor } from 'nestjs-multer-extended';

@Controller('cats')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class CatsController {
    constructor(
        private readonly catsService: CatsService,
        private readonly authService: AuthService,
    ) { }

    @ApiOperation({ summary: '현재 고양이 가져오기' })
    @UseGuards(JwtAuthGuard)
    @ApiResponse({
        status: 200,
        description: '성공',
        type: Cat,
    })
    @Get()
    getCurrentCat(@CurrentUser() cat: Cat) {
        return cat;
    }

    @ApiOperation({ summary: '회원가입' })
    @ApiResponse({
        status: 500,
        description: 'Server Error...',
    })
    @ApiResponse({
        status: 200,
        description: '성공!',
        type: ReadOnlyCatDto,
    })
    @Post()
    async signUp(@Body() body: CatRequestDto) {
        return this.catsService.signUp(body);
    }

    @ApiOperation({ summary: '로그인' })
    @ApiResponse({
        status: 200,
        description: '성공',
        type: Cat,
    })
    @Post('login')
    logIn(@Body() data: LoginRequestDto) {
        return this.authService.jwtLogIn(data);
    }

    @ApiOperation({ summary: '고양이 이미지 업로드' })
    @UseInterceptors(
        AmazonS3FileInterceptor('image', {
            dynamicPath: 'cats',
        }),
    )
    @UseGuards(JwtAuthGuard)
    @Post('upload')
    uploadCatImg(@UploadedFile() file: any, @CurrentUser() cat: Cat) {
        console.log(file);

        // return 'uploadImg';
        // return { image: `http://localhost:8000/media/cats/${files[0].filename}` };
        return this.catsService.uploadCatImg(cat, file);
    }

    @ApiOperation({ summary: '모든 고양이 가져오기' })
    @Get('all')
    getAllCat() {
        return this.catsService.getAllCat();
    }
}
