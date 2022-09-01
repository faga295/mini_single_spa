import { getAppChanges } from '../applications/apps';
import { toLoadPromise } from '../lifecycles/load';
import { isStarted } from '../start';
import { getProps } from '../lifecycles/props.helper';
export function reroute(){
    const {
        appsToLoad,
        appsToMount,
        appsToUnLoad,
        appsToUnmount
    } = getAppChanges();
    const started = isStarted();
    if(!started) {
        loadApps();
        appsToMount.forEach((app => {
            
            app.bootstrap(app.appName)
            app.mount(app.appName)
        }))
    }
    function loadApps(){
        return Promise.resolve().then(() => {
            const loadPromises = appsToLoad.map(toLoadPromise)
            Promise.all(loadPromises).then((values)=>{
               return values;
            })
        })
    }
    function update(){
        
    }
    
    
}