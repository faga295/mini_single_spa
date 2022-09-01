import { Application } from '../types/application';
import * as singleSpa from '../index'
export function getProps(app:Application){
    return {
        name:app.appName,
        singleSpa
    }
}