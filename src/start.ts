import { reroute } from './navigation/reroute';

// 判断是否启动
let started:boolean = false;

export function start(){
    started = true;
    // 启动应用
    reroute();
}

export function isStarted(){
    return started;
}