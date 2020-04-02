import './Connect';
import mongoose, { Schema, Document } from 'mongoose';

export type EventType = 'type';

export interface SampleI extends Document {
    name: string;
    joinDt: Date;
    accessDt: Date;
    pushToken: string;
    mobileType: string;
    isPushOn: boolean;
}

export const SampleSchema: Schema = new Schema({
    name: { type: String },
    joinDt: { type: Date },
    accessDt: { type: Date },
    pushToken: { type: String },
    mobileType: { type: String },
    isPushOn: {
        type: Boolean,
        required: true,
    },
});

export const Sample = mongoose.model<SampleI>('sample', SampleSchema);
