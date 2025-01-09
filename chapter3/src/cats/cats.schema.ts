import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaOptions } from "mongoose";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

const options: SchemaOptions = {
    timestamps: true,
}

@Schema(options)
export class Cat extends Document {
    @ApiProperty({
        example: 'test@test.com',
        description: 'email',
        required: true,
    })
    @Prop({
        required: true,
        unique: true,
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: 'test',
        description: 'name',
        required: true,
    })
    @Prop({
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: 'test1234',
        description: 'password',
        required: true,
    })
    @Prop({
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    password: string;

    @Prop()
    @IsString()
    imgUrl: string;

    readonly readOnlyData: { id: string; email: string; name: string;};
}

export const CatSchema = SchemaFactory.createForClass(Cat);

CatSchema.virtual('readOnlyData').get(function(this: Cat) {
    return {
        id: this.id,
        email: this.email,
        name: this.name,
        imgUrl: `https://d5zgznwo6o29v.cloudfront.net/${this.imgUrl}`,
    };
});
