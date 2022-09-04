import { Application } from '../types/application';
import { BOOTSTRAPPED } from '../applications/app.helper';
export function toBootstrapPromise(app:Application){
    return Promise.resolve().then(()=>{
        if (app.status!==BOOTSTRAPPED) return app;
        app.status = BOOTSTRAPPED;
        return app.bootstrap();
    })
    
}