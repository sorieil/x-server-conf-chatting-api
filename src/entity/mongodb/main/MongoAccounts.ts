import './Connect';
import mongoose, { Schema, Document, Types, model } from 'mongoose';
export interface PermissionI extends Document {
    permissionName: string;
    isChecked: boolean;
}

export interface ProfileI extends Document {
    profileImg: string;
}

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

const accountsEventSchema: Schema = new Schema({
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
    accountsEventSchema,
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
    eventList: { type: [accountsEventSchema] },
    profiles: { type: Array },
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
