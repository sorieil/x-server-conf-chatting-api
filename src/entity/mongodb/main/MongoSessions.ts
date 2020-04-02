import './Connect';
import { AccountsI, AccountsSchema } from './MongoAccounts';
import mongoose, { Schema, Document, Types, SchemaTypeOpts } from 'mongoose';
import { EventI, Event } from './MongoEvent';

export type SessionType =
    | 'userParticipation'
    | 'gMap'
    | 'notice'
    | 'attachmentFile'
    | 'infoList'
    | 'luckyDraw'
    | 'schedule'
    | 'board'
    | 'gallery'
    | 'video'
    | 'stamp'
    | 'quest'
    | 'survey'
    | 'score'
    | 'survival';
// export enum SessionType {
// 'userParticipation' = 'userParticipation',
// 'gMap' = 'gMap',
// 'notice' = 'notice',
// 'attachmentFile' = 'attachmentFile',
// 'infoList' = 'infoList',
// 'luckyDraw' = 'luckyDraw',
// 'schedule' = 'schedule',
// 'board' = 'board',
// 'gallery' = 'gallery',
// 'video' = 'video',
// 'stamp' = 'stamp',
// 'quest' = 'quest',
// 'survey' = 'survey',
// 'score' = 'score',
// 'survival' = 'survival',
// }
export type UserParticipationType = 'all' | 'photo' | 'message';

export interface SessionsI extends Document {
    eventId: EventI;
    sessionType: SessionType;
    menuId: Schema.Types.ObjectId;

    title: string;
    createDt: Date;
    joinAccount: [AccountsI];
    likePoint: number;
    commentPoint: number;
    getLikePoint: number;
    getCommentPoint: number;
    point: number;
    maxProductCount: number;
    remainedProductCount: number;
    isOpen: boolean;
    closeUrl: string;
    limitUserCount: number;
    description: string;
    subject: any[];

    // Quiz Survival
    aliveUser: AccountsI;

    deadUser: AccountsI;
    order: number;

    // Survey
    isDupParticipation: boolean;

    // Quest
    isSequential: boolean;

    // LuckyDraw
    luckyDrawJoinCode: string;
    winLuckyDraw: any[];
    isDupWinLuckyDraw: boolean;
    // UserParticipation
    userParticipationType: UserParticipationType;
}

export const clearQuestSchema: Schema = new Schema(
    {
        questId: Schema.Types.ObjectId,
        order: Number,
    },
    { _id: false },
);

export const joinAccountSchema: Schema = new Schema({
    accountId: { type: AccountsSchema },
    joinDt: Date,
    isReceivedProduct: Boolean,
    // Quest
    clearQuest: { type: clearQuestSchema },
    // Stamp
    stampCount: Number,
    // Quiz Score
    score: Number,
    rank: Number,
    timeDiff: Number,
    // luckyDraw
    luckyDraw: Number,
});

export const SessionsSchema: Schema = new Schema({
    eventId: {
        type: Schema.Types.ObjectId,
    },
    sessionType: {
        type: String,
    },
    menuId: {
        type: Schema.Types.ObjectId,
    },
    title: { type: Number },
    createDt: { type: Date },
    joinAccount: { type: [AccountsSchema] },
    likePoint: { type: Number, default: 0 },
    commentPoint: { type: Number, default: 0 },
    getLikePoint: { type: Number, default: 0 },
    getCommentPoint: { type: Number, default: 0 },
    point: { type: Number, default: 0 },
    maxProductCount: { type: Number },
    remainedProductCount: { type: Number },
    isOpen: { type: Boolean },
    closeUrl: { type: String },
    limitUserCount: { type: Number },
    description: { type: String },
    subject: { type: Array },

    // Quiz Survival Accounts
    aliveUser: { type: [AccountsSchema] },
    // Accounts
    deadUser: { type: [AccountsSchema] },
    order: { type: Number },

    // Survey
    isDupParticipation: {
        type: Boolean,
        default: false,
    },

    // Quest
    isSequential: {
        type: Boolean,
        default: true,
    },

    // LuckyDraw
    luckyDrawJoinCode: { type: String },
    winLuckyDraw: { type: Array },
    isDupWinLuckyDraw: {
        type: Boolean,
        default: false,
    },

    // UserParticipation
    userParticipationType: {
        type: String,
    },
});
export const Sessions = mongoose.model<SessionsI>('sessions', SessionsSchema);
