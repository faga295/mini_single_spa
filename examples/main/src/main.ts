import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { registerApplication, start } from 'single-spa';

// 手动加载子应用打包出来的文件
const loadScript = async (url:any) => {
  await new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script)
  });
}
registerApplication(
  'singleVue',
  async () => {
    console.log('loadscript');
    // 加载模块
    await loadScript('http://127.0.0.1:10000/dist/my-vue-app.umd.cjs'); // vue打包出来的应用核心
    // 生命周期  singleVue上有bootstrap，mount，unmount方法，打包的时候打到singleVue上去的
    return window.singleVue;
  },
  location => location.pathname.startsWith('/vue') // 激活标识
)
start();

createApp(App).mount('#app')
