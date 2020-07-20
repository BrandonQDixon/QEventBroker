import { QEventBroker } from '../EventBroker/QEventBroker';
import { DispatchOnReturn } from '../EventBroker/DispatchOnReturn';
import exp from 'constants';
import {of} from "rxjs";

describe('QEventBroker tests', () => {
    let eventBroker: QEventBroker;

    beforeEach(() => {
        eventBroker = new QEventBroker();
    });

    it('should trigger subscription on event dispatch', async (done) => {
        const eventName = 'test';
        const eventData = 'green';

        eventBroker.event$(eventName).subscribe((data) => {
            expect(data).toBe(eventData);
            done();
        });

        eventBroker.dispatch({
            type: eventName,
            data: eventData,
        });
    }, 100);

    it('should trigger subscription multiple times on event dispatches', async (done) => {
        const eventName = 'test';
        const eventData = 'green';

        const maxEvents = 3;
        let numEvents = 0;

        eventBroker.event$(eventName).subscribe((data) => {
            numEvents++;
            if (numEvents === maxEvents) {
                expect(data).toBe(eventData);
                done();
            }
        });

        for (let i = 0; i < maxEvents; i++) {
            eventBroker.dispatch({
                type: eventName,
                data: eventData,
            });
        }
    }, 200);

    it('should trigger subscription up to max # times if option is provided', async (done) => {
        const eventName = 'test';
        const eventData = 'green';

        const maxEvents = 3;
        const maxOptions = 2;
        let numEvents = 0;

        eventBroker
            .event$(eventName, { maxTimes: maxOptions })
            .subscribe((data) => {
                numEvents++;
                expect(data).toBe(eventData);
                if (numEvents > maxOptions) {
                    expect(false).toBeTruthy();
                }
            });

        for (let i = 0; i < maxEvents; i++) {
            eventBroker.dispatch({
                type: eventName,
                data: eventData,
            });
        }

        setTimeout(() => done(), 200);
    });

    it('should dispatch event with decorator on class method', async (done) => {
        const eventName = 'test';

        class Test {
            @DispatchOnReturn({
                eventBroker: eventBroker,
                type: eventName,
            })
            getColor() {
                return 'green';
            }
        }

        eventBroker.event$(eventName).subscribe((color) => {
            expect(color).toBeTruthy();
            expect(typeof color).toBe('string');
            done();
        });

        new Test().getColor();
    }, 200);

    it('should dispatch event with decorator on class method and map result', async (done) => {
        const eventName = 'test';

        class Test {
            @DispatchOnReturn({
                eventBroker: eventBroker,
                type: eventName,
                mapReturnValue: (data) => data.color,
            })
            getColor() {
                return {
                    color: 'green',
                };
            }
        }

        eventBroker.event$(eventName).subscribe((color) => {
            expect(color).toBeTruthy();
            expect(typeof color).toBe('string');
            done();
        });

        new Test().getColor();
    }, 200);


    it('should await event with decorator when promise is returned', async (done) => {

        const eventName = 'test';

        class Test {
            @DispatchOnReturn({
                eventBroker: eventBroker,
                type: eventName,
            })
            getColor() {
                return Promise.resolve('green');
            }
        }

        eventBroker.event$(eventName).subscribe((color) => {
            expect(color).toBeTruthy();
            expect(typeof color).toBe('string');
            done();
        });

        new Test().getColor();

    }, 200);

    it('should await event with decorator when observable is returned', async (done) => {

        const eventName = 'test';

        class Test {
            @DispatchOnReturn({
                eventBroker: eventBroker,
                type: eventName,
            })
            getColor() {
                return of('green');
            }
        }

        eventBroker.event$(eventName).subscribe((color) => {
            expect(color).toBeTruthy();
            expect(typeof color).toBe('string');
            done();
        });

        new Test().getColor();

    }, 200);

});
