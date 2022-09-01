import { Application, LifeCycles } from '../types/application';
import { NOT_LOADED, NOT_BOOTSTRAPPED } from '../applications/app.helper';
export async function toLoadPromise(app:Application){
    if (app.status !== NOT_LOADED) return;
    const lifecycles:LifeCycles = await app.loadApp();
    app.status = NOT_BOOTSTRAPPED;
    app.bootstrap = lifecycles.bootstrap;
    app.mount = lifecycles.mount;
    app.unmount = lifecycles.unmount;
    return app;
}