import { EventI, Event } from './../../entity/mongodb/main/MongoEvent';
import { Types, Schema } from 'mongoose';
export default class ServiceEvent {
    constructor() {}
    public async getEventPackageName(packageName: string): Promise<EventI[]> {
        return Event.find({ name: packageName }).lean();
    }

    public async getEventById(event: EventI): Promise<EventI> {
        const query = await Event.findById(event._id).lean<EventI>();
        return query;
    }
}
