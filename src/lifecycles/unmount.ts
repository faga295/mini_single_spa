import { Application } from '../types/application';
import { NOT_MOUNTED } from '../applications/app.helper';
export function toUnmountPromise(app:Application){
    return Promise.resolve().then(()=>{
        app.status = NOT_MOUNTED;
        app.unmount({name: app.appName});
        return app;
    })
    
}