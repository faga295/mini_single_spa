// src/applications/app.helper.ts
var NOT_LOADED = "NOT_LOADED";
var NOT_BOOTSTRAPPED = "NOT_BOOTSTRAPPED";
var BOOTSTRAPPED = "BOOTSTRAPPED";
var NOT_MOUNTED = "NOT_MOUNTED";
var MOUNTED = "MOUNTED";

// src/untils/runtime-env.ts
var isInBrowser = typeof window !== "undefined";

// src/navigation/navagation-events.ts
function urlReroute() {
  reroute();
}
function patchUpdateState(updateState, methodName) {
  return function() {
    const urlBefore = window.location.href;
    updateState.apply(this, arguments);
    const urlAfter = window.location.href;
    if (urlBefore !== urlAfter)
      urlReroute();
  };
}
function addListeners() {
  if (isInBrowser) {
    window.addEventListener("hashchange", urlReroute);
    window.addEventListener("popstate", urlReroute);
  }
  window.history.pushState = patchUpdateState(
    window.history.pushState);
  window.history.replaceState = patchUpdateState(
    window.history.replaceState);
}

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
  addListeners();
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
        break;
      case MOUNTED:
        if (!appShouldBeActive)
          appsToUnmount.push(app);
        break;
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

// src/lifecycles/unload.ts
function toUnloadPromise(app) {
  app.status = NOT_MOUNTED;
}

// src/lifecycles/unmount.ts
function toUnmountPromise(app) {
  return Promise.resolve().then(() => {
    app.status = NOT_MOUNTED;
    app.unmount({ name: app.appName });
    return app;
  });
}

// src/lifecycles/bootstrap.ts
function toBootstrapPromise(app) {
  return Promise.resolve().then(() => {
    if (app.status !== BOOTSTRAPPED)
      return app;
    app.status = BOOTSTRAPPED;
    return app.bootstrap();
  });
}

// src/lifecycles/mount.ts
function tomountPromise(app) {
  return Promise.resolve().then(() => {
    app.status = MOUNTED;
    app.mount({ name: app.appName });
    return app;
  });
}

// src/navigation/reroute.ts
var appChangeUnderway = false;
var peopleWaitingOnAppChange = [];
function reroute(eventArgument) {
  if (appChangeUnderway) {
    return peopleWaitingOnAppChange.push({
      eventArgument
    });
  }
  appChangeUnderway = true;
  const {
    appsToLoad,
    appsToMount,
    appsToUnLoad,
    appsToUnmount
  } = getAppChanges();
  console.log(appsToLoad, appsToMount, appsToUnLoad, appsToUnmount);
  const started2 = isStarted();
  if (!started2) {
    return loadApps();
  }
  return update();
  async function loadApps() {
    const loadPromises = Promise.all(appsToLoad.map(toLoadPromise));
    await loadPromises;
    finishUpAndReturn();
    return;
  }
  async function update() {
    appsToUnLoad.map(toUnloadPromise);
    const unmountPromises = appsToUnmount.map(toUnmountPromise);
    const unmountAllPromises = Promise.all(unmountPromises);
    const mountPromises = appsToMount.map(async (app) => {
      return tryToBootstrapAndMount(app, unmountAllPromises);
    });
    await mountPromises;
    finishUpAndReturn();
  }
  async function tryToBootstrapAndMount(app, unmountPromise) {
    if (shouldBeActive(app)) {
      await toBootstrapPromise(app);
      await unmountPromise;
      shouldBeActive(app) ? tomountPromise(app) : app;
    } else {
      await unmountPromise;
      return app;
    }
  }
  function finishUpAndReturn() {
    appChangeUnderway = false;
    if (!peopleWaitingOnAppChange.length)
      return;
    reroute(peopleWaitingOnAppChange[0].eventArgument);
    peopleWaitingOnAppChange.shift();
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

export { registerApplication, start };
//# sourceMappingURL=index.mjs.map