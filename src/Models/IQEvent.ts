/**
 * Interface for an event.
 * Type is the event name
 * Data is the event payload
 */
export interface IQEvent<T = any> {
    type: string;
    data: T;
}
