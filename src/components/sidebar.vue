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
        <li v-for="(item, index) in sidebarItems" v-on:click="modeclick(item)" v-bind:key="index">
          <router-link v-bind:to="'/' + item + '/individual'">{{item}}</router-link>
        </li>
      </ul>
    </div>

    <EditProfile></EditProfile>
    <Login></Login>
    <AddFriend></AddFriend>
    <CreateGroup></CreateGroup>
    <div class="notification" v-bind:class="{active: this.$store.state.view.isActiveNotification}">
      <div class="notification_title">
        notification
      </div>
      <ul>
        <li v-for="(item, index) in this.$store.state.notificationlist" v-bind:key="index">
          {{item}}
        </li>
      </ul>
    </div>
  </div>
</template>


<script>
import AddFriend from './panel/addfriend'
import Login from './panel/login'
import EditProfile from './panel/editprofile'
import CreateGroup from './panel/creategroup'
import axios from 'axios'

export default {
  components: {
    Login,
    EditProfile,
    AddFriend,
    CreateGroup
  },
  data() {
    return {
      sidebarItems: ['chat', 'video', 'feed'],
      sidebarActive: false,
      isActive: true,
      websocket_video: '',
      websocket_chat: ''
    }
  },

  methods: {
    modeclick(mode) {
      this.$store.commit('changemode', mode)
    },
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
  },
  created() {
    this.websocket_video = new WebSocket('ws://localhost:8183')
    this.$store.commit('setwebsocket_video', this.websocket_video)
    this.websocket_chat = new WebSocket('ws://localhost:8084')
    this.$store.commit('setwebsocket_chat', this.websocket_chat)

    this.websocket_video.addEventListener('message', jsondata => {
      let parseddata = JSON.parse(jsondata.data)
      if (parseddata.type == 'call') {
        let name = this.$store.state.friend.friends.filter(
          f => f.id == parseddata.sender
        )[0].name
        let message = 'call from ' + name
        this.$store.commit('pushtonotificationlist', message)

        setTimeout(() => {
          this.$store.commit('popnotificationlist')
        }, 10000)

        this.$store.commit('pushcomingcall', parseddata.sender)

        setTimeout(() => {
          this.$store.commit('popcomingcall', parseddata.sender)
        }, 10000)
      } else if (parseddata.type == 'loginuser') {
        this.$store.commit('setvideoactivemember', parseddata.loginuser)
      }
    })
    this.websocket_chat.addEventListener('message', jsondata => {
      let parseddata = JSON.parse(jsondata.data)
      let type = parseddata.type

      if (type == 'loginuserlist') {
        this.$store.commit('makefriendlogin', parseddata.loginfriendids)
      } else if (type == 'newloginuser') {
        let loginuserid = parseddata.loginuserid
        this.$store.commit('makefriendlogin', [loginuserid])
      } else if (type == 'newchat') {
        let name = this.$store.state.friend.friends.filter(
          f => f.id == parseddata.id
        )[0].name
        let message = 'chat from ' + name
        this.$store.commit('pushtonotificationlist', message)

        setTimeout(() => {
          this.$store.commit('popnotificationlist')
        }, 5000)
      } else if (type == 'logout') {
        let logoutuserid = parseddata.logoutuserid
        this.$store.commit('makefriendlogout', logoutuserid)
      } else if (type == 'logingroupuserlist') {
        let logingroupusers = parseddata.logingroupfriendids
        this.$store.commit('setlogingroupmember', logingroupusers)
      } else if (type == 'newlogingroupuser') {
        let logingroupuserid = parseddata.logingroupuserid
        this.$store.commit('addgroupmemberlogin', logingroupuserid)
      } else if (type == 'logoutgroup') {
        let logoutgroupuserid = parseddata.logoutgroupuserid
        this.$store.commit('rmgroupmemberlogout', logoutgroupuserid)
      }
    })
  }
}
</script>

<style lang="scss" scoped>
@import '../scss/color.scss';
@import '../scss/form.scss';
@import '../scss/button.scss';

.notification {
  position: absolute;
  bottom: 0px;
  right: 10px;
  background: white;
  z-index: 10;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  border: 1px solid $border-color;
  box-shadow: 1px 1px 4px black;
  color: black;

  .notification_title {
    border-bottom: 1px solid $border-color;
    padding: 5px;
    background: $main-color;
    color: white;
  }

  ul {
    list-style: none;
    top: 0;
    li {
      padding: 14px;
      color: black;
      border-bottom: 1px solid $border-color;
      font-weight: 500;
    }
    li:hover {
      color: white;
    }
  }
}

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
  color: white;
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
