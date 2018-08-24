<template>
  <div>
    <button v-bind:class="{active: sidebarActive}" v-on:click="sidebaropen" id='menu_button'>
      <font-awesome-icon icon="plus" />
    </button>
    <div id="sidebar" v-bind:class="{active: isActive}">
      <button v-on:click="searchopen" class="icon_button">
        <font-awesome-icon icon="search" />
      </button>
      <button v-on:click="profileopen" class="icon_button">
        <font-awesome-icon icon="user-circle" />
      </button>
      <ul>
        <li v-for="(item, index) in sidebarItems" v-bind:key="index">
          <router-link v-bind:to="item">{{item}}</router-link>
        </li>
      </ul>
    </div>

    <EditProfile></EditProfile>
    <Login></Login>
    <AddFriend></AddFriend>
  </div>
</template>


<script>
import AddFriend from './panel/addfriend'
import Login from './panel/login'
import EditProfile from './panel/editprofile'
import axios from 'axios'

export default {
  components: {
    Login,
    EditProfile,
    AddFriend
  },
  data() {
    return {
      sidebarItems: ['chat', 'video', 'feed'],
      sidebarActive: false,
      isActive: true
    }
  },

  methods: {
    sidebaropen: function(event) {
      this.isActive = !this.isActive
      this.sidebarActive = !this.sidebarActive
    },
    searchopen: function(event) {
      this.$store.commit('toggleaddfriend')
    },
    profileopen: function(event) {
      this.$store.commit('toggleprofile')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/color.scss';
@import '../scss/form.scss';
@import '../scss/button.scss';

.selectfile__container {
  margin: 30px;
}

#sidebar {
  position: absolute;
  width: 210px;
  height: 100vh;
  background: $sidebar-background;
  left: 0;
  z-index: 1;
  transition: 0.4s;
}
h1 {
  font-size: 3rem;
}

#sidebar.active {
  left: -210px;
}

ul {
  position: relative;
  top: 50px;
}

li {
  padding: 30px 0;
  color: white;
}

li:hover {
  background: $hover-color;
}

a {
  text-decoration: none;
  color: white;
}

p {
  margin: 20px;
}
img {
  height: 100px;
  width: 100px;
  border-radius: 50%;
  object-fit: cover;
}
</style>
