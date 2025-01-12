import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CatsRepository } from 'src/cats/cats.repository';
import { LoginRequestDto } from './dto/login.request.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly catsRepository: CatsRepository,
        private readonly jwtService: JwtService,
    ) {}

    async jwtLogIn(data: LoginRequestDto) {
        const { email, password } = data;

        //* 해당 이메일이 존재하는지 확인
        const cat = await this.catsRepository.findCatByEmail(email);

        if (!cat) {
            throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요.');
        }

        //* password가 일치하는지 확인
        const isPasswordValidated: boolean = await bcrypt.compare(
            password, 
            cat.password
        );

        if (!isPasswordValidated) {
            throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요.');
        }

        const payload = { email: email, sub: cat.id };

        return {
            token: this.jwtService.sign(payload),
        };
    }
}