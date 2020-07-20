import {IQEventBroker} from "../Models/IQEventBroker";
import {take} from "rxjs/operators";

export function DispatchOnReturn(options: {
    type: string,
    eventBroker: IQEventBroker,
    mapReturnValue?: (data: any) => any,
    awaitAsyncReturnValue?: boolean
}) {
    options = {
        mapReturnValue: (data) => data,
        awaitAsyncReturnValue: true,
        ...options
    };

    return function (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const original = descriptor.value;
        descriptor.value = (...params: Array<any>) => {
            let result = original(...params);

            const dispatch = (data) => {
                data = options.mapReturnValue(data);
                options.eventBroker.dispatch({
                    type: options.type,
                    data
                });
            }

            if (options.awaitAsyncReturnValue) {
                if (result.then) {
                    result.then(dispatch)
                } else if (result.subscribe) {
                    result.pipe(take(1)).subscribe(dispatch);
                } else {
                    dispatch(result);
                }
            } else {
                dispatch(result);
            }

            return result;
        }

        return descriptor;
    }
}