import './Connect';
import mongoose, { Schema, Document, Types, model } from 'mongoose';
export interface PermissionI extends Document {
    permissionName: string;
    isChecked: boolean;
}

export interface ProfileI extends Document {
    profileImg: string;
    profileImgThumb: string;
    email: string;
    companyName: string;
    departmentName: string;
    address: string;
    nickname: string;
    age: string;
    nationality: string;
    boyfriend: string;
    gender: string;
    favorite: string;
    Species: string;
    Class: string;
    birthday: string;
}

const ProfileSchema = new Schema({
    profileImg: { type: String },
    profileImgThumb: { type: String },
    email: { type: String },
    companyName: { type: String },
    departmentName: { type: String },
    address: { type: String },
    nickname: { type: String },
    age: { type: String },
    nationality: { type: String },
    boyfriend: { type: String },
    gender: { type: String },
    favorite: { type: String },
    Species: { type: String },
    Class: { type: String },
    birthday: { type: String },
});

export const profile = model<ProfileI>('profile', ProfileSchema);

export interface AccountsEventI extends Document {
    eventId: Schema.Types.ObjectId;
    name: string;
    joinDt: Date;
    accessDt: Date;
    pushToken: string;
    mobileType: string;
    isPushOn: boolean;
    point: number;
}

const AccountsEventSchema: Schema = new Schema({
    eventId: { type: Schema.Types.ObjectId },
    name: { type: String },
    joinDt: { type: Date },
    accessDt: { type: Date },
    pushToken: { type: String },
    mobileType: { type: String },
    isPushOn: { type: Boolean },
    point: { type: Number },
});

export const AccountsEvent = model<AccountsEventI>(
    'eventList',
    AccountsEventSchema,
);

export interface AccountsI extends Document {
    block: any[];
    group: any[];
    createDt: Date;
    phone: string;
    password: string;
    name: string;
    eventList: [AccountsEventI];
    profiles: ProfileI;
    myQRCode: string;
    isDupPhoneNum: boolean;
    isInactive: boolean;
    permission: PermissionI;
}

export const AccountsSchema: Schema = new Schema({
    block: { type: Array, required: true },
    group: { type: Array },
    phone: { type: String, required: true },
    password: { type: String },
    name: { type: String },
    eventList: { type: [AccountsEventSchema] },
    profiles: { type: ProfileSchema },
    myQRCode: { type: String },
    isDupPhoneNum: {
        type: Boolean,
        required: true,
    },
    isInactive: {
        type: Boolean,
        required: true,
    },
    permission: { type: Array },
});

export const Accounts = mongoose.model<AccountsI>('Accounts', AccountsSchema);
