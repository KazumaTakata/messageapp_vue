<template>
    <div>
        <div class="inner__chat__container" v-bind:class="{active: this.$store.state.isActiveChatmenu }">
            <ul>
                <li v-for="(chat, index) in this.chats" v-bind:key="index">
                    <div class="profile__container">
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
                    <div class="responce__container">
                        <li v-for="(responce, index) in chat.response" class="responce-li" v-bind:key="index">
                            <div class="profile__container">
                                <img class="profile-img-small" v-bind:src="getphoto(responce.senderid)">
                                <div class="name__container">
                                    {{getname(responce.senderid)}}
                                    <div class="time__container-small">
                                        {{responce.time}}
                                    </div>
                                </div>

                                <div class="bubble__container-small">
                                    {{responce.content}}
                                </div>
                            </div>
                        </li>
                    </div>
                    <div class="feedback__container">
                        <template v-if="chat.star > 0">
                            <font-awesome-icon icon="star" /> {{chat.star}}
                        </template>
                        <template v-if="String(index)===activeresponceindex">
                            <input type="text" v-model="responcemessage">
                            <button v-on:click="addchat " class="addbutton">
                                RESPONCE
                            </button>
                        </template>
                    </div>
                    <div class="chat_hover_menu">
                        <button v-bind:id="index" v-on:click="addresponce">
                            <font-awesome-icon icon="comment" />
                        </button>
                        <button v-bind:id="index" v-on:click="addstar">
                            <font-awesome-icon icon="star" />
                        </button>
                    </div>

                </li>
            </ul>
        </div>
    </div>
</template>


<script>
import axios from 'axios'
export default {
  data() {
    return {
      activeresponceindex: '',
      responcemessage: '',
      websocket: ''
    }
  },
  created() {
    this.websocket = this.$store.state.websocket_chat
  },
  computed: {
    chats() {
      return this.$store.state.grouptalks
    }
  },
  methods: {
    addchat: function() {
      let d = new Date()
      let sendobj = {
        type: 'grouptalk',
        content: this.responcemessage,
        myId: this.$store.state.token,
        groupid: this.$store.state.activegroupid,
        time: d.toLocaleString(),
        chatindex: this.activeresponceindex
      }

      this.websocket.send(JSON.stringify(sendobj))
    },
    addresponce: function(event) {
      let chatindex = event.currentTarget.id
      this.activeresponceindex = chatindex
    },
    addstar: async function(event) {
      console.log(event.currentTarget.id)
      let chatindex = event.currentTarget.id
      let groupid = this.$store.state.activegroupid

      const home_url = `http://localhost:8181`
      const _url = `/api/group/talk/star`
      const url = home_url + _url

      try {
        let result = await axios({
          method: 'post',
          url: url,
          data: {
            groupid,
            chatindex
          },
          headers: { 'x-access-token': this.$store.state.token }
        })
        console.log(result)
        this.groupmember = result.data
      } catch (err) {
        console.log(err)
      }
    },
    chatbubblestyle: function(person) {
      return person == 0 ? 'mechat' : 'youchat'
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
    }
  }
}
</script>


<style lang="scss" scoped>
@import '../../scss/color.scss';
@import '../../scss/button.scss';
@import '../../scss/chat.scss';

.responce-li {
  padding: 10px;
  padding-left: 30px;
}

.profile__container {
  text-align: left;
}

.feedback__container {
  text-align: left;
  color: $main-color;

  input {
    width: 60%;
    font-size: 0.5rem;
  }
}

.name__container {
  line-height: 25px;
  margin-left: 10px;
  font-size: 0.7rem;
}
.chat_hover_menu {
  top: 10px;
  height: 20px;
  width: 80px;
  background: white;
  opacity: 0;
  position: relative;
  border-radius: 10px;
  box-shadow: 1px 1px 3px $border-color;

  button {
    border: none;
    outline: none;
    background: transparent;
    color: $main-color;
    font-size: 1rem;
  }
  button:hover {
    color: $sidebar-background;
  }
}
.profile__container:hover ~ .chat_hover_menu,
.chat_hover_menu:hover,
.feedback__container:hover ~ .chat_hover_menu,
.responce__container:hover ~ .chat_hover_menu {
  opacity: 1;
}

li {
  padding: 10px;
}
</style>