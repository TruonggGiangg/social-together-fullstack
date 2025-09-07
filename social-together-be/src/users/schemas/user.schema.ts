
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';


//tao document de mapping den DB mongoDB
export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    age: number;

    @Prop({ required: true })
    role: string;

    @Prop()
    gender: string;

    @Prop()
    address: string;

    @Prop()
    refreshToken: string;

    @Prop()
    createdAt?: Date

    @Prop()
    updatedAt?: Date

    @Prop()
    isDeleted?: boolean

    @Prop()
    deletedAt?: Date

    @Prop({ type: Object })
    createdBy?: {
        _id: mongoose.Schema.Types.ObjectId,
        email: string
    }

    @Prop({ type: Object })
    updatedBy?: {
        _id: mongoose.Schema.Types.ObjectId,
        email: string
    }

    @Prop({ type: Object })
    deletedBy?: {
        _id: mongoose.Schema.Types.ObjectId,
        email: string
    }
}

export const UserSchema = SchemaFactory.createForClass(User);
