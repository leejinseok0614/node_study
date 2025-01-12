import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Payload } from "./jwt.payload";
import { CatsRepository } from "src/cats/cats.repository";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly catsRepository: CatsRepository) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'secret',
            ignoreExpiration: false,
        });
    }

    async validate(payload: Payload) {
        const cat = await this.catsRepository.findCatByIdWithoutPassword(payload.sub);
        
        if (cat) {
            return cat; // request.user에 저장
        } else {
            throw new UnauthorizedException('접근 오류');
        }
    }   
}