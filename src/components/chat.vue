<template>
  <div>
    <div id="chat__container">
      <div class="friendnamecontainer">
        <h2>{{this.chattitle}}</h2>
        <button v-on:click="openmenu" class="header_menubutton">
          <font-awesome-icon icon="bars" />
        </button>
      </div>
      <router-view></router-view>
      <div class="menu__container" v-bind:class="{active: this.$store.state.isActiveChatmenu}">
        <div id="icon__container">
          <button v-on:click="talklist" class="icon_button_black">
            <font-awesome-icon icon="search" />
          </button>
          <template v-if="this.$store.state.individualorgroup =='group' ">
            <button v-on:click="memberlist " class="icon_button_black">
              <font-awesome-icon icon="user-circle" />
            </button>
            <button v-on:click="starlist " class="icon_button_black">
              <font-awesome-icon icon="star" />
            </button>
          </template>

        </div>
        <template v-if="menustate=='search'">
          <template v-if="this.$store.state.individualorgroup =='individual' ">
            <IndividualSearch></IndividualSearch>
          </template>
          <template v-else>
            <GroupSearch></GroupSearch>
          </template>
        </template>
        <template v-else-if=" menustate=='member' ">
          <template v-if="this.$store.state.individualorgroup =='group' ">
            <div class="text__container subheader">
              GROUP DESCRIPTION
            </div>
            <div class="text__container">
              {{getgroupdescription()}}
            </div>
            <div class="text__container subheader margin10">
              GROUP MEMBER
            </div>
            <ul>
              <li v-for="(member, index) in groupmember " v-bind:key="index ">
                <div>
                  <img class="profile-img" v-bind:src="member.photourl ">
                </div>
                <div>
                  {{member.name}}
                </div>
              </li>
            </ul>
          </template>
        </template>
        <template v-else-if=" menustate=='star' ">
          <ul>
            <li v-for="(chat, index) in staredchat" v-bind:key="index ">
              <div class="text__container subheader">{{chat.star}} stared</div>
              <div class="profile__container margin10">
                <img class="profile-img" v-bind:src="getphoto(chat.senderid)">
                <div class="name__container">
                  {{getname(chat.senderid)}}
                  <div class="time__container">
                    {{chat.time}}
                  </div>
                </div>
                <div class="bubble__container">
                  {{chat.content}}
                </div>
              </div>
            </li>
          </ul>
        </template>
      </div>
    </div>
    <div id="chatinput__container">
      <input v-model="chatinput" type="text" id="chatinput">
      <button v-on:click="addchat " class="addbutton">
        SEND
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import IndividualChat from './chat/individualchat'
import IndividualSearch from './menu/individualsearch'
import GroupSearch from './menu/groupsearch'
export default {
  components: { IndividualChat, IndividualSearch, GroupSearch },
  data() {
    return {
      chatinput: '',
      websocket: '',
      query_input: '',
      query_result: [],
      menustate: 'search',
      groupmember: []
    }
  },
  computed: {
    chattitle() {
      if (this.$store.state.individualorgroup == 'group') {
        return this.$store.state.acitvegroupname
      } else {
        return this.$store.state.acitvename
      }
    },
    staredchat() {
      let grouptalks = this.$store.state.grouptalks
      let staredtalks = grouptalks.filter(talk => talk.star > 0)
      return staredtalks
    }
  },
  methods: {
    getgroupdescription() {
      let group = this.$store.state.groups.find(
        g => g._id == this.$store.state.activegroupid
      )
      return group.groupdescription
    },
    getfriendnameandphoto: async function() {
      const home_url = `http://localhost:8181`
      const search_url = `/api/group/member/${this.$store.state.activegroupid}`
      const url = home_url + search_url

      try {
        let result = await axios({
          method: 'get',
          url: url,
          headers: { 'x-access-token': this.$store.state.token }
        })
        console.log(result)
        this.groupmember = result.data
      } catch (err) {
        console.log(err)
      }
    },
    memberlist: async function() {
      this.menustate = 'member'
      let groupmember = await this.getfriendnameandphoto()
    },
    talklist() {
      this.menustate = 'search'
    },
    starlist() {
      this.menustate = 'star'
    },
    openmenu: function(event) {
      console.log(event)
      this.$store.commit('togglechatmenu')
    },
    getphoto: function(id) {
      if (id == this.$store.state.myState.id) {
        return this.$store.state.myState.photourl
      }
      let photourl = this.$store.state.friends.filter(f => f.id == id)[0]
        .photourl
      return photourl
    },
    getname: function(id) {
      if (id == this.$store.state.myState.id) {
        return this.$store.state.myState.name
      }
      let name = this.$store.state.friends.filter(f => f.id == id)[0].name
      return name
    },
    addchat: function() {
      let currentroute = this.$router.currentRoute
      if (currentroute.fullPath.split('/')[2] == 'individual') {
        var d = new Date()

        this.$store.commit('pushtalk', {
          content: this.chatinput,
          which: 0,
          friendid: this.$store.state.activefriendid,
          time: d.toLocaleString()
        })

        let sendobj = {
          type: 'talk',
          myId: this.$store.state.token,
          friendId: this.$store.state.activefriendid,
          time: d.toLocaleString(),
          content: this.chatinput
        }

        this.websocket.send(JSON.stringify(sendobj))
      } else if (currentroute.fullPath.split('/')[2] == 'group') {
        let d = new Date()

        let insertobj = {
          content: this.chatinput,
          senderid: this.$store.state.myState.id,
          groupid: this.$store.state.activegroupid,
          time: d.toLocaleString()
        }

        this.$store.commit('pushgrouptalk', insertobj)

        let sendobj = {
          type: 'grouptalk',
          content: this.chatinput,
          myId: this.$store.state.token,
          groupid: this.$store.state.activegroupid,
          time: d.toLocaleString()
        }

        this.websocket.send(JSON.stringify(sendobj))
      }
    },

    chatbubblestyle: function(person) {
      return person == 0 ? 'mechat' : 'youchat'
    }
  },
  created() {
    this.websocket = this.$store.state.websocket_chat
    this.websocket.onmessage = jsonmessage => {
      console.log('message: ', jsonmessage.data)
      let parseddata = JSON.parse(event.data)
      if (parseddata.groupid != undefined) {
        this.$store.commit('pushgrouptalk', {
          content: parseddata.content,
          senderid: parseddata.id,
          time: parseddata.time
        })
      } else {
        if (parseddata.id == this.$store.state.activefriendid) {
          this.$store.commit('pushtalk', {
            content: parseddata.content,
            friendid: parseddata.id,
            time: parseddata.time,
            which: 1
          })
        }
      }
    }
  }
}
</script >



<style lang="scss" scoped>
@import '../scss/color.scss';
@import '../scss/button.scss';
@import '../scss/chat.scss';
@import '../scss/basic.scss';
#icon__container {
  color: $font-color;
  padding: 5px 0px;
}

.subheader {
  background: $main-color;
  color: white;
}

li {
  padding: 0px;
}

.profile-img-small {
  width: 20px;
  height: 20px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid rgb(73, 53, 53);
}
</style>
