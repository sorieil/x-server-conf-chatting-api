import './Connect';
import mongoose, { Schema, Document, Types } from 'mongoose';
// export enum EventType {
//     'type' = 'type',
// }

export type EventType = 'type';

export interface ControlFeaturesI extends Document {
    chat: boolean;
    myQR: string;
    notiBox: boolean;
}

export const ControlFeaturesSchema: Schema = new Schema({
    chat: { type: Boolean },
    myQR: { type: Boolean },
    notiBox: { type: Boolean },
});
export interface EventI extends Document {
    name: string;
    joinDt: Date;
    accessDt: Date;
    pushToken: string;
    mobileType: string;
    isPushOn: boolean;
    point: number;
    lang: string[];
    order: number;
    createDt: Date;
    type: EventType;
    containerId: Schema.Types.ObjectId;
    packageName: string;
    accessType: string;
    privateCode: string;
    nameTagAccessCode: string;
    max: number;
    eventUpdateVersion: number;

    timezone: string;
    isPublish: boolean;
    isPublic: boolean;

    thumbnailUrl: string;

    step: number;

    controlFeatures: ControlFeaturesI;

    directUrl: string;
}

export const EventSchema: Schema = new Schema({
    name: { type: String },
    joinDt: { type: Date },
    accessDt: { type: Date },
    pushToken: { type: String },
    mobileType: { type: String },
    isPushOn: {
        type: Boolean,
        required: true,
    },
    point: {
        type: Boolean,
        required: true,
        default: 0,
    },
    lang: { type: Array, default: 'kr' },
    order: { type: Number },
    createDt: { type: Date },
    type: { type: String },
    containerId: { type: Schema.Types.ObjectId },
    packageName: { type: String },
    accessType: { type: String },
    privateCode: { type: String },
    nameTagAccessCode: { type: String },
    max: { type: Number },
    eventUpdateVersion: { type: Number },
    timezone: { type: String },
    isPublish: { type: Boolean },
    isPublic: { type: Boolean },
    thumbnailUrl: { type: String },
    step: { type: Number },
    controlFeatures: { type: ControlFeaturesSchema },
    directUrl: { type: String },
});

export const Event = mongoose.model<EventI>('event', EventSchema);
