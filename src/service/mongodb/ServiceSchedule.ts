import {
    Sessions,
    SessionsI,
    SessionType,
} from './../../entity/mongodb/main/MongoSessions';
import { Event, EventI } from './../../entity/mongodb/main/MongoEvent';
import { Types, SchemaType, Schema } from 'mongoose';
import { ScheduleI, Schedule } from '../../entity/mongodb/main/MongoSchedule';
import moment from 'moment-timezone';
export default class ServiceSchedule {
    constructor() {}

    public async getScheduleByEventId(
        event: EventI,
        date: string,
        timezone: string,
    ): Promise<any[]> {
        const sessionsQuery = await Sessions.findOne({
            eventId: event._id,
            sessionType: 'schedule',
            isOpen: true,
            isDupParticipation: false,
            isSequential: true,
            isDupWinLuckyDraw: false,
        }).sort({ createDt: -1 });

        // 유효한 세션이 있으면 로직 실행 특명!! 스케쥴을 찾아라!!
        if (sessionsQuery) {
            const sessionId = sessionsQuery._id;
            const targetDate = moment(date);
            const diffTime = targetDate.diff(targetDate.clone().tz(timezone));

            const startDate = new Date(targetDate.format('YYYY-MM-DD'));
            const endDate = new Date(
                targetDate.add(1, 'd').format('YYYY-MM-DD'),
            );
            console.log(diffTime, startDate, endDate);

            // 고객이 원하는 스케쥴의 날짜를 찾아라!!
            const scheduleQuery = await Schedule.find({
                sessionId: sessionId,
                startDt: {
                    $gte: startDate,
                    $lte: endDate,
                },
            })
                .sort({ order: -1 })
                .exec();

            // 스케쥴이 있으면, 로직 실행
            if (scheduleQuery.length > 0) {
                return new Promise(resolve => {
                    // 다수의 배열 치환/추가/삭제가 있다면, 동기로 로직으로!!
                    const result = scheduleQuery.map((v: any) => {
                        // comment가 존재한다면, 임시 프로필 추가
                        if (typeof v.comment !== 'undefined') {
                            v.comment.map((c: any) =>
                                Object.assign(c, {
                                    name: '홍길동',
                                    profileImg:
                                        'https://ext.fmkorea.com/files/attach/new/20180423/486616/68365856/1028761637/d1e7bf10d56306f6b38d1ca690f2dbe1.jpeg',
                                }),
                            );
                        }

                        // 북마크가 있는지 없는지 상태 추가
                        return Object.assign(v, {
                            isBookmark: v.bookmark.length > 0,
                        });
                    });
                    resolve(result);
                });
            } else {
                // 스케쥴이 없으면 널!!!!
                return null;
            }
            // 유효한 세션이 없다면 널!!!!
        } else {
            return null;
        }
    }
}
