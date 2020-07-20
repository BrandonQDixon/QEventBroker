import { Observable } from 'rxjs';
import { IQEvent } from './IQEvent';

export interface IQEventBrokerSubscriptionOptions {
    maxTimes?: number;
}

export interface IQEventBroker {
    /**
     * Subscribe to an event of type eventType (string)
     * Subscription callback will return event data
     * @param eventType
     * @param options
     */
    event$<T = any>(
        eventType: string,
        options?: IQEventBrokerSubscriptionOptions
    ): Observable<T>;

    events$: Observable<IQEvent>;

    /**
     * Dispatch a new event
     * @param event
     */
    dispatch(event: IQEvent): void;
}
