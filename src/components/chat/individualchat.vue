<template>
  <div>
    <div class="inner__chat__container" v-bind:class="{active: this.$store.state.view.isActiveChatmenu }">
      <ul>
        <template v-if="this.$store.state.chat.talks.length>0">
          <li v-for="(chat, index) in this.$store.state.chat.talks" v-bind:key="index">
            <div v-if="showtime(index)" class="time__hr">
              <span class="time__span">
                {{showday(index)}}
                <!--Padding is optional-->
              </span>
            </div>
            <div class="chat_item" v-bind:class="chatbubblestyle(chat.which)">
              <div>
                <img class="profile-img" v-bind:src="getphoto(chat.friendid,  chat.which)"> {{getname(chat.friendid, chat.which)}}
              </div>
              <div class="time__container">
                {{chat.time}}
              </div>

              <div v-bind:ref="index" v-bind:contenteditable="editableindex === index" v-bind:class="{underline: editableindex === index}" @input="updateeditable" class="bubble__container">
                <span v-bind:class="{underline: editableindex === index}">
                  {{chat.content}}
                </span>
              </div>

              <div v-if="chat.which == 0" class="chat_hover_menu">
                <template v-if="chat.which  == 0">
                  <button v-bind:id="index" v-on:click="edittalk(index)">
                    <font-awesome-icon icon="edit" />
                  </button>
                </template>
              </div>
              <div v-if="chat.filepath != undefined">

                <div>
                  <h6>
                    FILE
                  </h6>
                  <div class="file__container">
                    {{chat.filepath.split("/")[chat.filepath.split("/").length -1]}}
                  </div>
                  <a class="file_anchor" :href="chat.filepath" download target="_blank">
                    <font-awesome-icon icon="download" />
                  </a>
                  <button v-on:click="previewfile(index, chat.filepath)" class="file_anchor">
                    <font-awesome-icon icon="eye" />
                  </button>
                </div>
                <div v-if="activepreview == index">
                  <img class="preview_image" :ref="'img'+ index" alt="">
                  <highlight-code lang="go" class="code">{{previewtext}}</highlight-code>
                </div>

              </div>
            </div>
          </li>
        </template>
        <template v-else>
          There is no talk with {{this.$store.state.friend.acitvename}}.
        </template>

      </ul>
    </div>
  </div>
</template>


<script>
import hljs from 'highlight.js'

import axios from 'axios'
var moment = require('moment')
hljs.initHighlightingOnLoad()
export default {
  data() {
    return {
      activepreview: '',
      previewtext: '',
      editableindex: null,
      editedtalk: ''
    }
  },
  computed: {},
  methods: {
    updateeditable: function(event) {
      this.editedtalk = event.target.innerText
    },
    edittalk: function(index) {
      if (this.editableindex == index) {
        this.editableindex = null
        // this.updatechat(index)
      } else {
        if (this.editableindex != null) {
          // this.updatechat(this.editableindex)
        }
        this.editableindex = index
        setTimeout(() => {
          this.$refs[index][0].focus()
        }, 0)
      }
    },
    updatechat: async function(index) {
      const home_url = `http://localhost:8181`
      const _url = `/api/talk`
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
    previewfile: async function(index, url) {
      if (index == this.activepreview) {
        this.activepreview = ''
      } else {
        this.activepreview = index

        try {
          let result = await axios({
            method: 'get',
            url: url,
            responseType: 'arraybuffer',
            headers: { 'x-access-token': this.$store.state.token }
          })
          let type = result.headers['content-type'].split('/')[0]
          if (type == 'image') {
            var prefix = 'data:' + result.headers['content-type'] + ';base64,'
            let base64img =
              prefix + new Buffer.from(result.data, 'binary').toString('base64')
            this.$refs['img24'][0].src = base64img
            this.previewtext = ''
            console.log(base64img)
          } else if (type == 'text') {
            this.previewtext = new Buffer.from(result.data, 'binary').toString()
          } else if (type == 'application') {
            this.previewtext = new Buffer.from(result.data, 'binary').toString()
          } else {
            this.previewtext = 'This file can not be displayed.'
          }
        } catch (err) {
          console.log(err)
        }
      }
    },
    showday: function(index) {
      return moment(
        this.$store.state.chat.talks[index].time.split(',')[0],
        'MM-DD-YYYY'
      ).format('DD/MM/YYYY')
    },
    showtime: function(index) {
      if (index != 0) {
        let time = this.$store.state.chat.talks[index - 1].time
        let timenext = this.$store.state.chat.talks[index].time
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
    chatbubblestyle: function(person) {
      return person == 0 ? 'mechat' : 'youchat'
    },
    getphoto: function(id, which) {
      if (which == 0 || which === true) {
        return this.$store.state.myState.photourl
      } else {
        let photourl = this.$store.state.friend.friends.filter(
          f => f.id == id
        )[0].photourl
        return photourl
      }
    },
    getname: function(id, which) {
      if (which == 0 || which === true) {
        return this.$store.state.myState.name
      } else {
        let name = this.$store.state.friend.friends.filter(f => f.id == id)[0]
          .name
        return name
      }
    }
  }
}
</script>


<style lang="scss" scoped>
@import '../../scss/color.scss';
@import '../../scss/button.scss';
@import '../../scss/chat.scss';

.preview_image {
  object-fit: cover;
  width: 100%;
}
.underline {
  background: white !important;
  color: $font-color;
}

.file__preview {
  font-size: 3rem;
  width: 100px;
  margin-left: auto;
}
.time__span {
  font-size: 20px;
  position: relative;
  top: 7px;
  background-color: $font-color;
  padding: 10px 10px;
  margin: 10px;
}
.code {
  text-align: initial;
}

.time__hr {
  width: 100%;
  height: 20px;
  margin: 20px;
  border-bottom: 1px solid $font-color;
  text-align: center;
}
button {
  background: none;
  border: none;
  outline: none;
}
.chat_hover_menu {
  margin-left: auto;
  width: 30px;
}

.chat_item:hover > .chat_hover_menu {
  opacity: 1;
}
.fa-star path,
.fa-comment path,
.fa-edit path {
  stroke: red;
  stroke-width: 20;
}
</style>