import { getAppChanges, shouldBeActive } from '../applications/apps';
import { toLoadPromise } from '../lifecycles/load';
import { isStarted } from '../start';
import { getProps } from '../lifecycles/props.helper';
import { toUnloadPromise } from '../lifecycles/unload';
import { toUnmountPromise } from '../lifecycles/unmount';
import { Application, appChange } from '../types/application';
import { toBootstrapPromise } from '../lifecycles/bootstrap';
import { tomountPromise } from '../lifecycles/mount';
// 由于rerout不管是loadapp或者是update都是在放在微任务，
// 但reroute又是同步的，因此需要判断appChange是否还在进行，
// 如果还在进行，就需要暂时存放reroute参数
let appChangeUnderway = false;
let peopleWaitingOnAppChange:appChange[] = []

// 主要逻辑
export function reroute(eventArgument?:any){
    // 如果微任务还没进行完就先把参数存下来
    if (appChangeUnderway) {
        return peopleWaitingOnAppChange.push({
                eventArgument
        })
    }
    appChangeUnderway = true;
    // 获取组件状态
    const {
        appsToLoad,
        appsToMount,
        appsToUnLoad,
        appsToUnmount
    } = getAppChanges();
    
    const started = isStarted();
    if(!started) {
        return loadApps();
    }
    return update();
    // 第一次 加载script
    async function loadApps(){
        const loadPromises = Promise.all(appsToLoad.map(toLoadPromise))
        await loadPromises;
        
        finishUpAndReturn();
        return;
    }
    // 更新组件
    async function update(){
            // unload 源码中实际上没有做什么有意义的东西，我这里也没有做什么东西
            appsToUnLoad.map(toUnloadPromise);
            // 先卸载application
            const unmountPromises = appsToUnmount.map(toUnmountPromise);
            const unmountAllPromises= Promise.all(unmountPromises)
            const mountPromises = appsToMount.map(async app => {
                return tryToBootstrapAndMount(app,unmountAllPromises);
            })
            await mountPromises;
            // 调用之前被存放了的reroute
            finishUpAndReturn()
            
    }
    async function tryToBootstrapAndMount(app:Application,unmountPromise:Promise<Application[]>){
        // 由于是微任务，在执行这个函数的时候，可能这个时候路由已经切换了，因此还需要判断是否需要挂载
        if (shouldBeActive(app)){
            await toBootstrapPromise(app)
            await unmountPromise
            // 这里也还需要再判断
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