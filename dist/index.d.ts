declare function start(): void;

declare type LoadApp = () => Promise<LifeCycles>;
declare type ActiveWhen = (location: Location) => boolean;
interface LifeCycles {
    bootstrap?: any;
    mount?: any;
    unmount?: any;
}

declare function registerApplication(appName: string, loadApp: LoadApp, activeWhen: ActiveWhen): void;

export { registerApplication, start };
