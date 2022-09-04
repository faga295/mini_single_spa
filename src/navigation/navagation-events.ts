import { reroute } from './reroute';
import { isInBrowser } from '../untils/runtime-env';
function urlReroute(){
    // maybe need some argument
    reroute();
}
// 加强pushstate和replacestate
function patchUpdateState(updateState:any, methodName:string){
    return function(){
        const urlBefore = window.location.href;
        const result = updateState.apply(this,arguments);
        const urlAfter = window.location.href;
        if(urlBefore !== urlAfter) urlReroute();
    }
}
// 添加事件监听
export function addListeners(){
    if (isInBrowser) {
        window.addEventListener("hashchange",urlReroute);
        window.addEventListener("popstate",urlReroute);
    }
    // pushState｜replaceState 并不能触发popstate,因此我们应该重写它们
    window.history.pushState = patchUpdateState(
        window.history.pushState,
        "pushState"
    )
    window.history.replaceState = patchUpdateState(
        window.history.replaceState,
        "replaceState"
    )  
}
