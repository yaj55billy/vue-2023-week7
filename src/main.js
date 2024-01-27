import './assets/styles/main.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

import { Field, Form, ErrorMessage, defineRule, configure } from 'vee-validate';
import * as AllRules from '@vee-validate/rules';

import { localize, setLocale } from '@vee-validate/i18n';
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json';

import App from './App.vue';
import router from './router';

Object.keys(AllRules).forEach((rule) => {
  defineRule(rule, AllRules[rule]);
});
configure({
  generateMessage: localize({ zh_TW: zhTW }),
  validateOnInput: true,
});
setLocale('zh_TW');

const pinia = createPinia();
const app = createApp(App);
app.directive('thousands', {
  mounted(el, binding) {
    const number = binding.value;
    el.innerText = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },
  updated(el, binding) {
    const number = binding.value;
    el.innerText = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },
});
app.component('Loading', Loading);
app.component('VField', Field);
app.component('VForm', Form);
app.component('ErrorMessage', ErrorMessage);
app.use(router);
app.use(pinia);
app.mount('#app');
