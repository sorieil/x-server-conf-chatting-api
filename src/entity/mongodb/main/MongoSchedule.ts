import './Connect';
import { AccountsI, Accounts, AccountsSchema } from './MongoAccounts';
import mongoose, { Schema, Document } from 'mongoose';
import { EventI, EventSchema } from './MongoEvent';
import { ReportI, ReportSchema } from './MongoCommonSchema';

export interface LikeI extends Document {
    accountId: AccountsI;
    createDt: { type: Date };
}

export const LikeSchema: Schema = new Schema({
    accountId: { type: AccountsSchema },
    createDt: Date,
});

export interface ReCommentI extends Document {
    eventId: EventI;
    accountId: AccountsI;
    content: string;
    createDt: Date;
    reported: [ReportI];
    like: [LikeI];
}

export const reCommentSchema: Schema = new Schema({
    eventId: { type: EventSchema },
    accountId: { type: AccountsSchema },
    content: { type: String },
    createDt: { type: String },
    reported: { type: ReportSchema },
    like: { type: LikeSchema },
});

interface CommentI extends Document {
    eventId: EventI;
    accountId: AccountsI;
    content: Schema.Types.ObjectId;
    createDt: Date;
    reported: [ReportI];
    reComment: [ReCommentI];
    like: [LikeI];
}

export const CommentSchema: Schema = new Schema({
    eventId: { type: EventSchema },
    accountId: { type: AccountsSchema },
    content: { type: Schema.Types.ObjectId },
    createDt: { type: Date },
    reported: { type: Schema.Types.ObjectId },
    reComment: { type: Schema.Types.ObjectId },
    like: { type: Schema.Types.ObjectId },
});

interface FeatureI extends Document {
    featureId: Schema.Types.ObjectId;
    featureType: string;
    featureTypeName: string;
    featureSessionId: Schema.Types.ObjectId;
    featureTitle: string;
    featureThumbnailUrl: string;
    order: number;
}

export const FeatureSchema: Schema = new Schema(
    {
        featureId: mongoose.Schema.Types.ObjectId,
        featureType: String,
        featureTypeName: String,
        featureSessionId: mongoose.Schema.Types.ObjectId,
        featureTitle: String,
        featureThumbnailUrl: String,
        order: Number,
    },
    { _id: false },
);

export interface ScheduleI extends Document {
    eventId: EventI;
    sessionId: Schema.Types.ObjectId;
    order: number;
    name: string;
    description: string;
    location: string;
    tags: any[];

    createDt: Date;
    startDt: Date;
    endDt: Date;
    timezone: string;
    isCurrentSchedule: boolean;

    imageUrl: string;

    connectFeature: [FeatureI];
    bookmark: [AccountsI];

    comment: [CommentI];
    isBookmark: boolean;
}

const ScheduleSchema = new Schema({
    eventId: {
        type: Schema.Types.ObjectId,
    },
    sessionId: {
        type: Schema.Types.ObjectId,
    },

    order: Number,
    name: String,
    description: String,
    location: String,
    tags: Array,

    createDt: Date,
    startDt: Date,
    endDt: Date,
    timezone: String,
    isCurrentSchedule: Boolean,

    imageUrl: String,

    connectFeature: { type: Array },
    bookmark: { type: Array },
    comment: { type: Array },
    isBookmark: { type: Boolean },
});

export const Schedule = mongoose.model<ScheduleI>('schedule', ScheduleSchema);
