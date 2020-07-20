import {QEventBrokerBase} from "./QEventBrokerBase";
import {BehaviorSubject} from "rxjs";

export class QEventBehaviorBroker extends QEventBrokerBase {

    protected defineEventSubject() {
        return new BehaviorSubject(null);
    }

}