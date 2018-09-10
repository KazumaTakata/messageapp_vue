<template>
  <div>
    <div class="inner__chat__container" v-bind:class="{active: this.$store.state.view.isActiveChatmenu }">
      <ul>
        <template v-if="this.$store.state.chat.grouptalks.length > 0">
          <li v-for="(chat, index) in this.$store.state.chat.grouptalks" v-bind:key="index">
            <div v-if="showtime(index)" class="time__hr">
              <span class="time__span">
                {{showday(index)}}
                <!--Padding is optional-->
              </span>
            </div>
            <div class="profile__container">
              <img class="profile-img" v-bind:src="getphoto(chat.senderid)">
              <div class="name__container">
                {{getname(chat.senderid)}}
                <div class="time__container">
                  {{chat.time}}
                </div>
              </div>
              <div v-bind:contenteditable="editableindex === index" v-bind:class="{underline: editableindex === index}" @input="updateeditable" class="bubble__container">
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
            <div v-if="chat.filepath != undefined">
              <div class="profile__container">
                <h6>
                  FILE
                </h6>
                <div class="file__container">
                  {{chat.filepath.split("/")[chat.filepath.split("/").length -1]}}
                </div>

                <a :href="chat.filepath" download="sample.txt">
                  <font-awesome-icon icon="download" />
                </a>
              </div>
            </div>
            <div class="chat_hover_menu">
              <button v-bind:id="index" v-on:click="addresponce">
                <font-awesome-icon icon="comment" />
              </button>
              <button v-bind:id="index" v-on:click="addstar">
                <font-awesome-icon icon="star" />
              </button>
              <template v-if="ifmychat(chat.senderid)">
                <button v-bind:id="index" v-on:click="edittalk(index)">
                  <font-awesome-icon icon="edit" />
                </button>
              </template>
            </div>

          </li>
        </template>
        <template v-else>
          There is no talk.
        </template>
      </ul>
    </div>
  </div>
</template>


<script>
import axios from 'axios'
var moment = require('moment')
export default {
  data() {
    return {
      activeresponceindex: '',
      responcemessage: '',
      websocket: '',
      editableindex: null,
      editedtalk: ''
    }
  },
  created() {
    this.websocket = this.$store.state.websocket_chat
  },
  computed: {},
  methods: {
    ifmychat(id) {
      return id == this.$store.state.myState.id
    },
    updateeditable: function(event) {
      this.editedtalk = event.target.innerText
    },
    ifeditable: function(index) {},
    edittalk: function(index) {
      if (this.editableindex == index) {
        this.editableindex = null
        this.updatechat(index)
      } else {
        if (this.editableindex != null) {
          this.updatechat(this.editableindex)
        }
        this.editableindex = index
      }
    },
    updatechat: async function(index) {
      const home_url = `http://localhost:8181`
      const _url = `/api/group/talk`
      const url = home_url + _url

      try {
        let result = await axios({
          method: 'put',
          url: url,
          data: {
            index,
            content: this.editedtalk,
            groupid: this.$store.state.friend.activegroupid
          },
          headers: { 'x-access-token': this.$store.state.token }
        })
        console.log(result)
        // this.$store.commit('plusonestargroup', chatindex)
      } catch (err) {
        console.log(err)
      }
    },
    showday: function(index) {
      return moment(
        this.$store.state.chat.grouptalks[index].time.split(',')[0],
        'MM-DD-YYYY'
      ).format('DD/MM/YYYY')
    },
    showtime: function(index) {
      if (index != 0) {
        let time = this.$store.state.chat.grouptalks[index - 1].time
        let timenext = this.$store.state.chat.grouptalks[index].time
        if (
          moment(time.split(',')[0], 'MM-DD-YYYY').date() !=
          moment(timenext.split(',')[0], 'MM-DD-YYYY').date()
        ) {
          return true
        } else {
          return false
        }
      }
    },
    addchat: function() {
      let d = new Date()
      let sendobj = {
        type: 'grouptalk',
        content: this.responcemessage,
        myId: this.$store.state.token,
        groupid: this.$store.state.friend.activegroupid,
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
      let groupid = this.$store.state.friend.activegroupid

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
        this.$store.commit('plusonestargroup', chatindex)
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
      let friend = this.$store.state.friend.friends.filter(f => f.id == id)[0]
      if (friend != undefined) {
        return friend.photourl
      }

      let groupmember = this.$store.state.friend.groupmember.filter(
        f => f.id == id
      )[0]
      if (groupmember != undefined) {
        return groupmember.photourl
      }
    },
    getname: function(id) {
      if (id == this.$store.state.myState.id) {
        return this.$store.state.myState.name
      }
      let friend = this.$store.state.friend.friends.filter(f => f.id == id)[0]
      if (friend != undefined) {
        return friend.name
      }

      let groupmember = this.$store.state.friend.groupmember.filter(
        f => f.id == id
      )[0]
      if (groupmember != undefined) {
        return groupmember.name
      }
    }
  }
}
</script>


<style lang="scss" scoped>
@import '../../scss/color.scss';
@import '../../scss/button.scss';
@import '../../scss/chat.scss';

.time__span {
  font-size: 20px;
  position: relative;
  top: 7px;
  background-color: $font-color;
  padding: 0 10px;
}

.time__hr {
  width: 100%;
  height: 20px;
  margin: 20px;
  border-bottom: 1px solid $font-color;
  text-align: center;
}

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
    font-size: 0.9rem;
  }
}

.name__container {
  line-height: 25px;
  margin-left: 10px;
  font-size: 0.7rem;
}
.chat_hover_menu {
  top: 10px;
  height: 30px;
  width: 120px;
  background: white;
  opacity: 0;
  position: relative;
  border-radius: 10px;
  box-shadow: 1px 1px 3px $border-color;

  button {
    padding: 5px;
    border: none;
    outline: none;
    background: transparent;
    font-size: 1rem;
    color: white;
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
.fa-star path,
.fa-comment path,
.fa-edit path {
  stroke: red;

  stroke-width: 20;
}

li {
  padding: 10px;
  border-bottom: 1px solid $border-color;
}
</style>