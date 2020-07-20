import {
    IQEventBroker,
    IQEventBrokerSubscriptionOptions,
} from '../Models/IQEventBroker';
import { IQEvent } from '../Models/IQEvent';
import { Observable, Subject } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

export abstract class QEventBrokerBase implements IQEventBroker {
    private eventSubject: Subject<IQEvent>;

    constructor() {
        this.eventSubject = this.defineEventSubject();
    }

    protected abstract defineEventSubject();

    /**
     * Subscribe to an event of type eventType (string)
     * Subscription callback will return event data
     * @param eventType
     * @param options
     */
    event$<T = any>(
        eventType: string,
        options?: IQEventBrokerSubscriptionOptions
    ): Observable<T> {
        options = {
            ...(options || {}),
        };

        let subscribable = <any>this.eventSubject
            .asObservable()
            .pipe(
                filter((event: IQEvent<T>) => {
                    return event && event.type === eventType;
                })
            )
            .pipe(
                map((event: IQEvent<T>) => {
                    return event.data;
                })
            );

        if (options.maxTimes) {
            subscribable = subscribable.pipe(take(options.maxTimes));
        }
        return subscribable;
    }

    get events$(): Observable<IQEvent> {
        return this.eventSubject.asObservable().pipe(filter((event) => !!event));
    }


    dispatch(event: IQEvent): void {
        this.eventSubject.next(event);
    }
}
