import mongoose, { Document, Schema } from 'mongoose';

export type DepartmentType = 
  | 'رادیولوژی'
  | 'آزمایشگاه'
  | 'سونوگرافی'
  | 'فیزیوتراپی'
  | 'مشاوره'
  | 'دیگر';

export interface IService {
    name: string;
    description?: string;
    price: number;
    duration: number;
    department: DepartmentType;
    isActive?: boolean;
    image?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IServiceDocument extends IService, Document {}

const serviceSchema = new Schema<IServiceDocument>({
    name: {
        type: String,
        required: [true, 'Service name is required.'],
        trim: true,
    },
    description: {
        type: String,
        default: null,
    },
    price: {
        type: Number,
        required: [true, 'Price is required.'],
        min: 0,
    },
    duration: {
        type: Number,
        required: [true, 'Duration is required.'],
    },
    department: {
        type: String,
        enum: ['رادیولوژی', 'آزمایشگاه', 'سونوگرافی', 'فیزیوتراپی', 'مشاوره', 'دیگر'],
        default: 'دیگر',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    image: {
        type: String,
    },
},{
    timestamps: true
});

const Service = mongoose.model<IServiceDocument>('Service', serviceSchema);

export default Service;