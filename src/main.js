import Vue from 'vue';
import BootstrapVue from "bootstrap-vue";
import Eagle from 'eagle.js';
import scrollReveal from "scrollReveal";
import EntityLink from './component/EntityLink.vue';
import FollowUpQuestion from './component/FollowUpQuestion.vue';
import StyledText from './component/StyledText.vue';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import 'eagle.js/dist/eagle.css';
import 'plottable/plottable.css';
import App from './App.vue';

Vue.prototype.$sr = scrollReveal({ reset: true });
Vue.use(Eagle)
Vue.use(BootstrapVue)
Vue.component('styled-text', StyledText);
Vue.component('entity-link', EntityLink);
Vue.component('follow-up', FollowUpQuestion);

new Vue({
  el: '#app',
  render: h => h(App)
})
