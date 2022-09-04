import { Application } from '../types/application';
import { NOT_MOUNTED } from '../applications/app.helper';
import * as singleSpa from '../index'
export function toUnmountPromise(app:Application){
    return Promise.resolve().then(()=>{
        app.status = NOT_MOUNTED;
        app.unmount({name: app.appName});
        return app;
    })
    
}