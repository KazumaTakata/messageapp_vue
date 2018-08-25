// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBars,
  faPlus,
  faSearch,
  faUserCircle,
  faTimes,
  faPhone,
  faComment,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(
  faBars,
  faPlus,
  faSearch,
  faUserCircle,
  faTimes,
  faPhone,
  faComment
);

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  store,
  router,
  components: { App },
  template: "<App/>",
});
