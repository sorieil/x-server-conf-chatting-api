import './Connect';
import mongoose, { Schema, Document, model } from 'mongoose';

export interface MessageI extends Document {
    accountId: Schema.Types.ObjectId;
    message: string;
    createdAt: Date;
}

export const MessageSchema: Schema = new Schema({
    accountId: { type: Schema.Types.ObjectId },
    message: { type: String },
    createdAt: { type: Date },
});

export const _MessageSchemaInChattingMessage = model<MessageI>(
    'message',
    MessageSchema,
);

export interface ReadMembersI extends Document {
    accountId: Schema.Types.ObjectId;
    readDate: Date;
}

export const ReadMembersSchema: Schema = new Schema({
    accountId: Schema.Types.ObjectId,
    readDate: Date,
});

export interface ChattingMessagesI extends Document {
    _id: any;
    accountId: Schema.Types.ObjectId;
    chattingListId: Schema.Types.ObjectId;
    messages: string;
    messageCount: Schema.Types.Number;
    fileupload: any[];
    createdAt: Date;
    readMembers: any[];
    //이미지 업로드 시 이미지 url
    image: string;
    //이미지 업로드인지 텍스트 업로드인지 타입으로 가리기
    type: string;
    //이미지 원본 크기의 값(가로 사이즈)
    imageSize: number;
}

export const ChattingMessagesSchema: Schema = new Schema({
    accountId: { type: Schema.Types.ObjectId },
    chattingListId: { type: Schema.Types.ObjectId },
    messages: { type: String },
    fileupload: { type: Array },
    createdAt: { type: Date },
    readMembers: { type: Array },
    image: { type: String },
    type: { type: String },
    imageSize: { type: Number },
});

export const ChattingMessages = mongoose.model<ChattingMessagesI>(
    'chattingMessages',
    ChattingMessagesSchema,
);
