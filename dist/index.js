'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// src/applications/app.helper.ts
var NOT_LOADED = "NOT_LOADED";
var NOT_BOOTSTRAPPED = "NOT_BOOTSTRAPPED";
var NOT_MOUNTED = "NOT_MOUNTED";
var MOUNTED = "MOUNTED";

// src/applications/apps.ts
var apps = [];
function registerApplication(appName, loadApp, activeWhen) {
  const registration = {
    appName,
    loadApp,
    activeWhen
  };
  if (apps.find((i) => i.appName === appName))
    return;
  apps.push({
    status: NOT_LOADED,
    ...registration
  });
  reroute();
}
function getAppChanges() {
  const appsToUnLoad = [];
  const appsToUnmount = [];
  const appsToLoad = [];
  const appsToMount = [];
  apps.forEach((app) => {
    const appShouldBeActive = shouldBeActive(app);
    switch (app.status) {
      case NOT_LOADED:
        appsToLoad.push(app);
        break;
      case NOT_BOOTSTRAPPED:
      case NOT_MOUNTED:
        if (!appShouldBeActive) {
          appsToUnLoad.push(app);
        } else {
          appsToMount.push(app);
        }
      case MOUNTED:
        appsToUnmount.push(app);
    }
  });
  return { appsToLoad, appsToMount, appsToUnLoad, appsToUnmount };
}
function shouldBeActive(app) {
  return app.activeWhen(location);
}

// src/lifecycles/load.ts
async function toLoadPromise(app) {
  if (app.status !== NOT_LOADED)
    return;
  const lifecycles = await app.loadApp();
  app.status = NOT_BOOTSTRAPPED;
  app.bootstrap = lifecycles.bootstrap;
  app.mount = lifecycles.mount;
  app.unmount = lifecycles.unmount;
  return app;
}

// src/navigation/reroute.ts
function reroute() {
  const {
    appsToLoad,
    appsToMount,
    appsToUnLoad,
    appsToUnmount
  } = getAppChanges();
  const started2 = isStarted();
  if (!started2) {
    loadApps();
    appsToMount.forEach((app) => {
      app.bootstrap(app.appName);
      app.mount(app.appName);
    });
  }
  function loadApps() {
    return Promise.resolve().then(() => {
      const loadPromises = appsToLoad.map(toLoadPromise);
      Promise.all(loadPromises).then((values) => {
        return values;
      });
    });
  }
}

// src/start.ts
var started = false;
function start() {
  started = true;
  reroute();
}
function isStarted() {
  return started;
}

exports.registerApplication = registerApplication;
exports.start = start;
//# sourceMappingURL=index.js.map