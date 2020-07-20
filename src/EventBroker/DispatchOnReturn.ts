import { IQEventBroker } from '../Models/IQEventBroker';
import { take } from 'rxjs/operators';
import {Subject} from "rxjs";

export function DispatchOnReturn(options: {
    type: string;
    eventBroker: IQEventBroker;
    mapReturnValue?: (data: any) => any;
    awaitAsyncReturnValue?: boolean;
}) {
    options = {
        mapReturnValue: (data) => data,
        awaitAsyncReturnValue: true,
        ...options,
    };

    return function (
        target: any,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        const original = descriptor.value;
        descriptor.value = (...params: Array<any>) => {
            let data = original(...params);

            const dispatch = (data) => {
                options.eventBroker.dispatch({
                    type: options.type,
                    data,
                });
            };

            const processData = (data, callback) => {
                if (options.awaitAsyncReturnValue) {
                    if (data.then) {
                        data.then(callback);
                    } else if (data.subscribe) {
                        data.pipe(take(1)).subscribe(callback);
                    } else {
                        callback(data);
                    }
                } else {
                    callback(data);
                }
            };

            const mapAndDispatch = (data) => {
                processData(data, (processed) => {
                    const mapped = options.mapReturnValue(processed);
                    processData(mapped, (finalMapped) => {
                        dispatch(finalMapped);
                    });
                });
            };

            mapAndDispatch(data);

            return data;
        };

        return descriptor;
    };
}
