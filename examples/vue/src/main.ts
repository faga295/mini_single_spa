// @ts-nocheck
import { h,createApp } from 'vue';
import singleSpaVue from 'single-spa-vue';
import App from './App.vue';
console.log(singleSpaVue);

const vueLifecycles = singleSpaVue({
  createApp,
  appOptions: {
    render() {
        return h(App,{
            name: this.name,
        mountParcel: this.mountParcel,
        singleSpa: this.singleSpa,
        })
    }
  },
  handleInstance: (app) => app
});
console.log(vueLifecycles);

export const bootstrap = vueLifecycles.bootstrap;
export const mount = vueLifecycles.mount;
export const unmount = vueLifecycles.unmount;

