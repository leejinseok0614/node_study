import { PickType } from "@nestjs/mapped-types";
import { Cat } from "src/cats/cats.schema";

export class LoginRequestDto extends PickType(Cat, [
    'email', 
    'password'
] as const) {}