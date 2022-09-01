import type { LoadApp, Application,ActiveWhen } from '../types/application'
import { NOT_LOADED, NOT_BOOTSTRAPPED, NOT_MOUNTED, MOUNTED } from './app.helper';
import { reroute } from '../navigation/reroute';
const apps:Application[] = [];
export function registerApplication(appName: string, loadApp: LoadApp, activeWhen: ActiveWhen){
    const registration = {
        appName,
        loadApp,
        activeWhen
    }
    if(apps.find(i => i.appName === appName)) return;
    apps.push({
        status: NOT_LOADED,
        ...registration
    })
    reroute();
}
export function getAppChanges():Record<string,Application[]> {
    const appsToUnLoad:Application[] = [];
    const appsToUnmount:Application[] = [];
    const appsToLoad:Application[] = [];
    const appsToMount:Application[] = [];
    apps.forEach(app => {
        const appShouldBeActive = shouldBeActive(app);
        switch (app.status) {
            case NOT_LOADED:
                appsToLoad.push(app)
                break;

            case NOT_BOOTSTRAPPED:
            case NOT_MOUNTED:
                if(!appShouldBeActive){
                    appsToUnLoad.push(app);
                } else {
                    appsToMount.push(app);
                }
            case MOUNTED:
                appsToUnmount.push(app)
        }
    })
    return {appsToLoad, appsToMount, appsToUnLoad, appsToUnmount}
}
export function shouldBeActive(app: Application){
    return app.activeWhen(location);
}