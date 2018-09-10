// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import Toasted from "vue-toasted";
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
  faStar,
  faPlay,
  faStop,
  faFile,
  faDownload,
  faEye,
  faEdit,
  faHome,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import hljs from "highlight.js";
import "highlight.js/styles/default.css";
import VueHighlightJS from "vue-highlight.js";

library.add(
  faEdit,
  faBars,
  faPlus,
  faSearch,
  faUserCircle,
  faTimes,
  faPhone,
  faComment,
  faStar,
  faPlay,
  faStop,
  faFile,
  faDownload,
  faEye,
  faHome
);
hljs.initHighlightingOnLoad();
Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.use(VueHighlightJS);
Vue.use(Toasted);
Vue.config.productionTip = false;

Vue.component("editable", {
  template: `
    <div contenteditable="true" @blur="emitChange">
      {{ content }}
    </div>
  `,
  props: ["content"],
  methods: {
    emitChange(ev) {
      this.$emit("update", ev.target.textContent);
    },
  },
});
/* eslint-disable no-new */
new Vue({
  el: "#app",
  store,
  router,
  components: { App },
  template: "<App/>",
});
