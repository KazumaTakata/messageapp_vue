<template>
  <div>
    <div id="chat__container">
      <div class="friendnamecontainer">
        <h2>{{this.$store.state.acitvename}}</h2>
        <button v-on:click="openmenu" class="header_menubutton">
          <font-awesome-icon icon="bars" />
        </button>
      </div>
      <IndividualChat></IndividualChat>
      <div class="menu__container" v-bind:class="{active: this.$store.state.isActiveChatmenu}">
        <input v-model="query_input" v-on:keyup.enter="elasticsearchtalk" type="text">
        <ul>
          <li v-for="(result, index) in this.query_result" v-bind:key="index">
            <div>
              <img class="profile-img" v-bind:src="getphoto( result.friendid, result.which )"> {{getname(result.friendid, result.which)}}
            </div>
            <div class="time__container">
              {{result.time}}
            </div>
            <div>
              {{result.content}}
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div id="chatinput__container">
      <input v-model="chatinput" type="text" id="chatinput">
      <button v-on:click="addchat" class="addbutton">
        SEND
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import IndividualChat from './chat/individualchat'
export default {
  components: { IndividualChat },
  data() {
    return {
      chatinput: '',
      websocket: '',
      query_input: '',
      query_result: []
    }
  },
  computed: {
    chats() {
      console.log('ee')
      return this.$store.state.talks
    }
  },
  methods: {
    elasticsearchtalk: async function(event) {
      console.log(this.query_input)
      const home_url = `http://localhost:8181`
      const search_url = `/api/elastic/talk/${
        this.$store.state.activefriendid
      }/${this.query_input}`
      const url = home_url + search_url

      try {
        let result = await axios({
          method: 'get',
          url: url,
          headers: { 'x-access-token': this.$store.state.token }
        })
        result.data.sort(function(a, b) {
          return Date.parse(a.time) - Date.parse(b.time)
        })

        console.log(result)
        this.query_result = result.data
      } catch (err) {
        console.log(err)
      }
    },
    openmenu: function(event) {
      console.log(event)
      this.$store.commit('togglechatmenu')
    },
    getphoto: function(id, which) {
      if (which == 0 || which === true) {
        return this.$store.state.myState.photourl
      } else {
        let photourl = this.$store.state.friends.filter(f => f.id == id)[0]
          .photourl
        return photourl
      }
    },
    getname: function(id, which) {
      if (which == 0 || which === true) {
        return this.$store.state.myState.name
      } else {
        let name = this.$store.state.friends.filter(f => f.id == id)[0].name
        return name
      }
    },
    addchat: function() {
      var d = new Date()

      this.$store.commit('pushtalk', {
        content: this.chatinput,
        which: 0,
        friendid: this.$store.state.activefriendid,
        time: d.toLocaleString()
      })

      let sendobj = {
        myId: this.$store.state.token,
        friendId: this.$store.state.activefriendid,
        time: d.toLocaleString(),
        content: this.chatinput
      }

      this.websocket.send(JSON.stringify(sendobj))
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
</script >



<style lang="scss" scoped>
@import '../scss/color.scss';
@import '../scss/button.scss';
@import '../scss/chat.scss';
</style>
