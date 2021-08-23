import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import moment from 'moment';
import 'moment/dist/locale/ru.js';
import App from './App.vue';
import pages from './pages';
import localeRU from '../locales/intterra-ru-RU.json';
import OperationsService from './FieldService';

moment.locale('ru');

const i18n = createI18n({
  locale: 'ru', // set locale
  fallbackLocale: 'ru',
  messages: {
    ru: {
      ...localeRU,
    },
  },
});

// @ts-ignore
const app = createApp(App);

app
  .use(pages)
  .use(i18n);

app.config.globalProperties.$moment = moment;
app.provide('operationsService', new OperationsService());

app.mount('#app');
