import { EventI } from './MongoEvent';
import { AccountsI, Accounts } from './MongoAccounts';
import './Connect';
import mongoose, { Schema, Document, model } from 'mongoose';
export interface ParticipantsAccountsI extends Document {
    accountId: AccountsI;

    createDt: Date;
}
export interface ParticipantsFavoriteI extends Document {
    accountId: AccountsI;
    eventId: EventI;
    favoriteAccounts: ParticipantsAccountsI[];
    createDt: Date;
}

const ParticipantsAccountsSchema: Schema = new Schema({
    accountId: { type: Schema.Types.ObjectId },
    createDt: { type: Date },
});

export const ParticipantsAccounts = model<ParticipantsAccountsI>(
    'ParticipantsAccounts',
    ParticipantsAccountsSchema,
);

export const ParticipantsFavoriteSchema: Schema = new Schema({
    accountId: { type: Schema.Types.ObjectId },
    eventId: { type: Schema.Types.ObjectId },
    favoriteAccounts: { type: [ParticipantsAccountsSchema] },
    createDt: { type: Date },
});

export const ParticipantsFavorite = mongoose.model<ParticipantsFavoriteI>(
    'participantsFavorite',
    ParticipantsFavoriteSchema,
);
