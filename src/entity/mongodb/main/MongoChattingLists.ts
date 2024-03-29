import './Connect';
import mongoose, { Schema, Document, model } from 'mongoose';
import { type } from 'os';

export type EventType = 'type';

export interface MembersI extends Document {
    accountId: Schema.Types.ObjectId;
    profileImage: string;
    name: string;
    companyName: string;
    departmentName: string;
    notReadCount: number;
}

export const MemberSchema: Schema = new Schema({
    accountId: { type: Schema.Types.ObjectId },
    profileImage: { type: String },
    name: { type: String },
    companyName: { type: String },
    departmentName: { type: String },
    notReadCount: { type: Number },
});

export const MembersInChattingLists = model<MembersI>('members', MemberSchema);

export interface LastMsgInfoI extends Document {
    accountId: Schema.Types.ObjectId;
    createdAt: Date;
    messages: string;
    chattingListId: Schema.Types.ObjectId;
}

export interface ChattingListsI extends Document {
    _id: any;
    lastText: string;
    lastTextCreatedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    members: any[];
    membersInformation: MembersI[];
    status: boolean;
    chattingMessageId: Schema.Types.ObjectId;
    eventId: [Schema.Types.ObjectId];
    lastMsgInfo: LastMsgInfoI;
    notReadCount: number;
}

export const LastMsgInfoSchema: Schema = new Schema({
    accountId: { type: Schema.Types.ObjectId },
    createdAt: { type: Date },
    messages: { type: String },
    chattingListId: { type: Schema.Types.ObjectId },
});

export const ChattingListsSchema: Schema = new Schema({
    lastText: { type: String },
    lastTextCreatedAt: { type: Date },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    members: { type: Array },
    membersInformation: { type: [MemberSchema] },
    status: { type: Boolean },
    chattingMessageId: { type: Schema.Types.ObjectId },
    eventId: { type: [Schema.Types.ObjectId] },
    notReadCount: { type: Number },
});

export const ChattingLists = mongoose.model<ChattingListsI>(
    'chattingLists',
    ChattingListsSchema,
);
