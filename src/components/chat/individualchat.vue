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
                        <div v-bind:class="chatbubblestyle(chat.which)">
                            <div>
                                <img class="profile-img" v-bind:src="getphoto(chat.friendid,  chat.which)"> {{getname(chat.friendid, chat.which)}}
                            </div>
                            <div class="time__container">
                                {{chat.time}}
                            </div>
                            <div class="bubble__container">
                                <span>
                                    {{chat.content}}
                                </span>
                            </div>
                            <div v-if="chat.filepath != undefined">
                                <!-- <div class="file__preview">
                                <font-awesome-icon icon="file" />
                            </div> -->
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
      
    }
  },
  computed: {},
  methods: {
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
  padding: 0 10px;
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
</style>