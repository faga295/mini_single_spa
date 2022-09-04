import { getAppChanges, shouldBeActive } from '../applications/apps';
import { toLoadPromise } from '../lifecycles/load';
import { isStarted } from '../start';
import { getProps } from '../lifecycles/props.helper';
import { toUnloadPromise } from '../lifecycles/unload';
import { toUnmountPromise } from '../lifecycles/unmount';
import { Application, appChange } from '../types/application';
import { toBootstrapPromise } from '../lifecycles/bootstrap';
import { tomountPromise } from '../lifecycles/mount';
let appChangeUnderway = false;
let peopleWaitingOnAppChange:appChange[] = []

export function reroute(eventArgument?:any){
     
    if (appChangeUnderway) {
        return peopleWaitingOnAppChange.push({
                eventArgument
        })
    }
    appChangeUnderway = true;
    const {
        appsToLoad,
        appsToMount,
        appsToUnLoad,
        appsToUnmount
    } = getAppChanges();
    
    console.log(appsToLoad,appsToMount,appsToUnLoad,appsToUnmount);
    
    
    const started = isStarted();
    if(!started) {
        return loadApps();
    }
    return update();
    async function loadApps(){
        const loadPromises = Promise.all(appsToLoad.map(toLoadPromise))
        await loadPromises;
        
        finishUpAndReturn();
        return;
    }
    async function update(){
            appsToUnLoad.map(toUnloadPromise);

            const unmountPromises = appsToUnmount.map(toUnmountPromise);
            const unmountAllPromises= Promise.all(unmountPromises)
            // const loadThenMountPromises = appsToLoad.map((app) => {
            //     return toLoadPromise(app).then(app => {
            //         if(!app) return;
            //         return tryToBootstrapAndMount(app,unmountAllPromise)
            //     })
            // })
            
            const mountPromises = appsToMount.map(async app => {
                return tryToBootstrapAndMount(app,unmountAllPromises);
            })
            await mountPromises;
            
            finishUpAndReturn()
            
    }
    async function tryToBootstrapAndMount(app:Application,unmountPromise:Promise<Application[]>){
        if (shouldBeActive(app)){
            await toBootstrapPromise(app)
            await unmountPromise
            shouldBeActive(app) ? tomountPromise(app):app
            
        } else {
            await unmountPromise;
            return app;
        }
    }
    function finishUpAndReturn() {
        appChangeUnderway = false;
        if(!peopleWaitingOnAppChange.length) return;
        reroute(peopleWaitingOnAppChange[0].eventArgument);
        peopleWaitingOnAppChange.shift();

    }
}