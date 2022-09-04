import { Application } from '../types/application';
import { MOUNTED } from '../applications/app.helper';
export function tomountPromise(app:Application){
    return Promise.resolve().then(()=>{
        app.status = MOUNTED;
        app.mount({name:app.appName})
        return app;
    })
}