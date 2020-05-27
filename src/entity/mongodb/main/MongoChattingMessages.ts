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
}

export const ChattingMessagesSchema: Schema = new Schema({
    accountId: { type: Schema.Types.ObjectId },
    chattingListId: { type: Schema.Types.ObjectId },
    messages: { type: String },
    fileupload: { type: Array },
    createdAt: { type: Date },
    readMembers: { type: Array },
});

export const ChattingMessages = mongoose.model<ChattingMessagesI>(
    'chattingMessages',
    ChattingMessagesSchema,
);
