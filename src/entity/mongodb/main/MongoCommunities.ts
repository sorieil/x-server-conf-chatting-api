import './Connect';
import { AccountsI, AccountsSchema } from './MongoAccounts';
import { Event, EventSchema, EventI } from './MongoEvent';
import mongoose, { Schema, Document, Types } from 'mongoose';
import { ReportSchema, ReportI } from './MongoCommonSchema';
export const LikeSchema: Schema = new Schema({
    accountId: { type: AccountsSchema },
    createDt: { type: Date },
});

export interface LikeI extends Document {
    accountId: AccountsI;
    createDt: Date;
}

export const ReCommentSchema: Schema = new Schema({
    eventId: { type: EventSchema },
    accountId: { type: AccountsSchema },
    content: { type: String },
    createDt: { type: Date },
    reported: { type: [ReportSchema] },
    like: { type: [LikeSchema] },
});

export interface ReCommentI extends Document {
    eventId: EventI;
    accountId: AccountsI;
    content: string;
    createDt: Date;
    reported: [ReportI];
    like: [LikeI];
}

export const CommentSchema: Schema = new Schema({
    eventId: { type: EventSchema },
    accountId: { type: AccountsSchema },
    content: { type: String },
    createDt: { type: Date },
    reported: { type: [ReportSchema] },
    reComment: { type: [ReCommentSchema] },
    like: { type: Array },
});

export interface CommentI extends Document {
    eventId: EventI;
    accountId: AccountsI;

    content: string;
    createDt: Date;
    reported: [ReportI];
    reComment: [ReCommentI];
    like: [LikeI];
}
export interface CommunitiesI extends Document {
    eventId: EventI;
    accountId: AccountsI;
    subject: string;
    title: string;
    body: string;
    imageUrl: string;
    createDt: Date;
    order: number;
    tags: string[];
    viewCount: number;
    likeCount: number;
    like: [LikeI];
    comment: [CommentI];
    reported: [ReportI];
    postPoint: number;
    likePoint: number;
    commentPoint: number;
}
const CommunitiesSchema: Schema = new Schema({
    eventId: { type: Schema.Types.ObjectId, createIndexes: true },
    accountId: { type: Schema.Types.ObjectId, createIndexes: true },
    subject: { type: String },
    title: { type: String },
    body: { type: String },
    imageUrl: { type: String },
    createDt: { type: Date },
    order: { type: Number },
    tags: { type: Array },
    viewCount: { type: Number },
    likeCount: { type: Number },
    like: { type: [LikeSchema] },
    comment: { type: [CommentSchema] },
    reported: { type: [ReportSchema] },
    postPoint: { type: Number, default: 0 },
    likePoint: { type: Number, default: 0 },
    commentPoint: { type: Number, default: 0 },
});

export const Communities = mongoose.model<CommunitiesI>(
    'communities',
    CommunitiesSchema,
);
