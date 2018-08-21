<template>
  <div id="app">
    <SideBar/>
    <div class="friendlist__container">
      <FriendList/>
    </div>
    <div class="detail__container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import FriendList from "./components/friendlist";
import Chat from "./components/chat";
import SideBar from "./components/sidebar";

export default {
  name: "App",
  components: {
    FriendList,
    Chat,
    SideBar
  }
};
</script>

<style lang="scss">
@import "./scss/color.scss";
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.friendlist__container {
  position: absolute;
  height: 100vh;
  border-right: 2px solid $border-color;
}

body,
html {
  margin: 0 !important;
  padding: 0 !important;
}

.detail__container {
  margin-left: 210px;
  // min-width: 600px;
}

ul {
  margin: 0;
  padding: 0;
}
</style>
