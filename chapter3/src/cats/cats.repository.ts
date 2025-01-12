import { HttpException } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Cat } from "./cats.schema";
import { CatRequestDto } from "./dto/cate.request.dto";

@Injectable()
export class CatsRepository {
    constructor(@InjectModel(Cat.name) private readonly catModel: Model<Cat>) {}

    async findCatByEmail(email: string): Promise<Cat | null> {
        const cat = await this.catModel.findOne({ email });
        return cat;
    }

    async findCatByIdWithoutPassword(catId: string): Promise<Cat | null> {
        const cat = await this.catModel.findById(catId).select('-password');
        return cat;
    }

    async existsByEmail(email: string): Promise<boolean> {
        const result = await this.catModel.exists({ email });
        return result !== null;
    }

    async create(cat: CatRequestDto): Promise<Cat> {
        return await this.catModel.create(cat);
    }

    async findAll() {
        return await this.catModel.find();
    }

    async findByIdAndUpdateImg(id: string, fileName: string) {
        const cat = await this.catModel.findById(id);
        cat.imgUrl = fileName;

        const newCat = await cat.save();
        console.log(newCat);

        return newCat.readOnlyData;
    }
}