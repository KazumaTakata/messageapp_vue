<template>
  <div>
    <template v-if="videolist.length != 0">
      <ol>
        <li v-on:click="videoopen" v-for="(item, index) in videolist" v-bind:key="index" v-bind:id="index">
          <div>
            <img class="profile-img" v-bind:src="getphoto(item.friendid)"> {{getname(item.friendid)}}
          </div>
          <div>
            {{item.time}}
          </div>

        </li>
      </ol>
    </template>
    <template v-else>
      <p>There is no recorded video.</p>
    </template>
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
            <button class="videobutton" v-on:click="playbutton" type="button">
              <font-awesome-icon icon="play" />
            </button>
          </li>
          <li>
            <button class="videobutton" v-on:click="stopbutton" type="button">
              <font-awesome-icon icon="stop" />
            </button>
          </li>
          <li class="progress">
            <progress ref="progress" id="progress" value="0" min="0">
              <span ref="progressbar" id="progress-bar"></span>
            </progress>
          </li>
          <li>
            <button class="videobutton" v-on:click="upvolume" type="button">Vol+</button>
          </li>
          <li>
            <button class="videobutton" v-on:click="downvolume" type="button">Vol-</button>
          </li>

        </ul>

        <div class="video__comment">
          Note
        </div>
        <div>
          {{videolist[activeindex].textcontent}}
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
  },
  mounted: function() {},
  methods: {
    upvolume: function() {
      this.alterVolume('+', this.$refs.video_local)
      this.alterVolume('+', this.$refs.video_remote)
    },
    downvolume: function() {
      this.alterVolume('-', this.$refs.video_local)
      this.alterVolume('-', this.$refs.video_remote)
    },
    alterVolume: function(dir, video) {
      var currentVolume = Math.floor(video.volume * 10) / 10
      if (dir === '+') {
        if (currentVolume < 1) video.volume += 0.1
      } else if (dir === '-') {
        if (currentVolume > 0) video.volume -= 0.1
      }
    },
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
      let that = this

      this.$refs.progress.addEventListener('click', function(e) {
        var pos = (e.pageX - this.offsetLeft) / this.offsetWidth
        that.$refs.video_local.currentTime =
          pos * that.$refs.video_local.duration
        that.$refs.video_remote.currentTime =
          pos * that.$refs.video_remote.duration
      })
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

      try {
        let result = await axios({
          method: 'get',
          url: url,
          headers: { 'x-access-token': this.$store.state.token }
        })
        console.log(result)
        this.videolist = result.data
      } catch (err) {}
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

ol {
  margin: 10px;
  li:hover {
    background: $hover-color;
    color: white;
  }
}

li * {
  pointer-events: none;
}
ul {
  list-style: none;
}

li:hover {
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

.videobutton {
  background: transparent;
  outline: none;
  border: none;
  font-size: 1rem;
  color: white;
}

.videobutton:hover {
  color: $hover-color;
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

  button,
  progress {
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