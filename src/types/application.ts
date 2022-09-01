export type LoadApp = () => Promise<LifeCycles>
export type ActiveWhen = (location:Location) => boolean
// type lifeCycle = () => 
export interface LifeCycles{
    bootstrap?: any,
    mount?: any,
    unmount?: any
}

export interface Application extends LifeCycles {
    status: string,
    appName: string,
    loadApp: LoadApp,
    activeWhen: ActiveWhen
}