<template>
    <div>
        <ul>
            <li v-on:click="videoopen" v-for="(item, index) in videolist" v-bind:key="index" v-bind:id="index">
                <div>
                    <img class="profile-img" v-bind:src="getphoto(item.friendid)"> {{getname(item.friendid)}}
                </div>
                <div>
                    {{item.time}}
                </div>

            </li>
        </ul>
        <template v-if=" videotoggle ">
            <div class="video__container">
                <button v-on:click="videoclose" class="closebutton">
                    <font-awesome-icon icon="times" />
                </button>
                <div class="inner__video__container">
                    <video ref="video_local" id="gum" v-bind:src="videolist[activeindex].video_local"></video>
                    <video ref="video_remote" id="gum" v-bind:src="videolist[activeindex].video_remote"></video>
                </div>
                <ul id="video-controls" class="controls">
                    <li>
                        <button id="playpause" v-on:click="playbutton" type="button">Play/Pause</button>
                    </li>
                    <li>
                        <button id="stop" v-on:click="stopbutton" type="button">Stop</button>
                    </li>
                    <li class="progress">
                        <progress ref="progress" id="progress" value="0" min="0">
                            <span ref="progressbar" id="progress-bar"></span>
                        </progress>
                    </li>
                    <!-- <li>
                        <button id="mute" type="button">Mute/Unmute</button>
                    </li> -->
                    <li>
                        <button id="volinc" type="button">Vol+</button>
                    </li>
                    <li>
                        <button id="voldec" type="button">Vol-</button>
                    </li>
                    <!-- <li>
                        <button id="fs" type="button">Fullscreen</button>
                    </li> -->
                </ul>

                <div class="video__comment">
                    Note
                </div>
                <div>
                    ofiewjfoewjfoewajoifejwa
                </div>
            </div>
        </template>
    </div>
</template>


<script>
import axios from 'axios'
export default {
  data() {
    return {
      videolist: [],
      whichvideo: '',
      videotoggle: false,
      activeindex: 0
    }
  },
  created() {
    this.getVideoList()

    // this.$refs.video_local.ontimeupdate = () => {
    //   this.$refs.progress.value = this.$refs.video_local.currentTime
    //   this.$refs.progressbar.style.width =
    //     Math.floor(
    //       this.$refs.video_local.currentTime /
    //         this.$refs.video_local.duration *
    //         100
    //     ) + '%'
    // }
  },
  mounted: function() {},
  methods: {
    progressbarinit: function(event) {
      this.$refs.video_local.ontimeupdate = () => {
        try {
          this.$refs.progress.max = this.$refs.video_local.duration
          this.$refs.progress.value = this.$refs.video_local.currentTime
        } catch (err) {
          console.log(err)
        }

        this.$refs.progressbar.style.width =
          Math.floor(
            this.$refs.video_local.currentTime /
              this.$refs.video_local.duration *
              100
          ) + '%'
      }
    },

    playbutton: function(event) {
      this.progressbarinit()
      console.log(event)
      this.$refs.video_local.play()
      this.$refs.video_remote.play()
    },
    stopbutton: function(event) {
      this.$refs.video_local.pause()
      this.$refs.video_remote.pause()
    },
    videoopen: function(event) {
      //   console.log(event.target.id)
      this.videotoggle = true
      this.activeindex = Number(event.target.id)
      //   this.whichvideo = String(event.target.id)
    },
    videoclose: function(event) {
      console.log(event.target.id)
      this.videotoggle = false
      this.whichvideo = ''
    },
    getVideoList: async function(event) {
      const home_url = `http://localhost:8181`
      const url = home_url + `/api/video/${this.$store.state.activefriendid}`

      let result = await axios({
        method: 'get',
        url: url,
        headers: { 'x-access-token': this.$store.state.token }
      })
      console.log(result)
      this.videolist = result.data
    },
    getphoto: function(id) {
      let photourl = this.$store.state.friends.filter(f => f.id == id)[0]
        .photourl
      return photourl
    },
    getname: function(id) {
      let name = this.$store.state.friends.filter(f => f.id == id)[0].name
      return name
    }
  }
}
</script>


<style lang="scss" scoped>
@import '../../scss/color.scss';
@import '../../scss/form.scss';
@import '../../scss/button.scss';
@import '../../scss/photo.scss';

li {
  padding: 20px;
}

li * {
  pointer-events: none;
}
ul {
  list-style: none;
}

li:hover {
  background: $hover-color;
  //   color: white;
}

.controls {
  list-style: none;
  display: flex;

  .progress {
    width: 50%;
  }
}

progress span {
  width: 0%;
  height: 100%;
  display: inline-block;
  background-color: #2a84cd;
}

progress {
  width: 100%;
}

.video__container {
  top: 0;
  left: 0;
  position: fixed;
  height: 100vh;
  background: black;
  width: 100%;
  z-index: 10;
  color: white;

  button {
    pointer-events: auto;
  }
  .inner__video__container {
    display: flex;

    video {
      width: 50%;
      height: auto;
    }

    .video__comment {
    }
  }
}
</style>