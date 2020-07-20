import { QEventBrokerBase } from './QEventBrokerBase';
import { Subject } from 'rxjs';

export class QEventBroker extends QEventBrokerBase {
    protected defineEventSubject() {
        return new Subject();
    }
}
