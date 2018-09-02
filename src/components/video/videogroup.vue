<template>
    <div>
        <div id="video__container">
            <div class="friendnamecontainer">
                <h2>{{this.$store.state.friend.acitvegroupname}}</h2>
            </div>
            <div class="mode__container">
                <button v-on:click="tolivemode" class="basicbutton-white">
                    LIVE
                </button>
                <button v-on:click="toarchivemode" class="basicbutton-white">
                    ARCHIVE
                </button>
            </div>
            <div class="text__container margin10">
                <h3>Group Member</h3>
            </div>
            <ul>
                <li v-for="(member, index) in this.$store.state.friend.groupmember" v-bind:key="index">
                    <div>
                        <img class="profile-img-small" v-bind:src="member.photourl ">
                    </div>
                    <h4>{{member.name}}</h4>
                </li>
            </ul>
            <div class="text__container margin10">
                <button v-on:click="startchat" class="basicbutton-white">
                    JOIN CHAT
                </button>
            </div>

            <div v-if="fullscreenmode" class="fullscreen">
                <h2>Group Video Chat In {{this.$store.state.friend.acitvegroupname}}</h2>
                <button v-on:click="videoclose" class="closebutton">
                    <font-awesome-icon icon="times" />
                </button>
                <div class="inner__fullscreen">
                    <template v-for="(member, index) in groupmemberwithoutme">
                        <div v-bind:key="index">
                            <h2>{{member.name}}</h2>
                            <video width="500" height="420" v-bind:ref="member.id" v-bind:key="index">
                            </video>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import axios from 'axios'
import VideoList from './videolist'
export default {
  components: { VideoList },
  data() {
    return {
      test: 'test',
      webSocket: '',
      callcomming: false,
      talking: false,
      offering: false,
      responced: false,
      callcommingid: '',
      callingmessage: 'Calling to',
      recordfeedbackmessage: '',
      recordedBlobs_local: [],
      recordedBlobs_remote: [],
      mediaRecorder_local: null,
      mediaRecorder_remote: null,
      remotestream: null,
      liveorarchive: true,
      startstoptext: 'START',
      textcontent: '',
      recordEnabled: false,
      groupmember: [],
      fullscreenmode: false
    }
  },
  computed: {
    groupmemberwithoutme: function() {
      let arr = this.$store.state.friend.groupmember.filter(item => {
        return item.id != this.$store.state.myState.id
      })
      return arr
    }
  },
  beforeDestroy() {
    this.stop()
  },
  mounted() {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(mediaStream => {
        localStream = mediaStream
        this.$refs.video.srcObject = mediaStream
        this.$refs.video.play()
      })
      .catch(error => console.error('getUserMedia() error:', error))

    this.webSocket = this.$store.state.websocket_video
    if (
      this.$store.state.callcoming.includes(
        this.$store.state.friend.activefriendid
      )
    ) {
      this.callcomming = true
      this.talking = true
      setTimeout(() => {
        if (!this.responced) {
          this.callcomming = false
          this.talking = false
        }
      }, 10000)
    }

    this.webSocket.onmessage = jsonmessage => {
      let message = JSON.parse(jsonmessage.data)
      if (message.data.type === 'offer') {
        pc[message.senderid] = new RTCPeerConnection(pc_config, pc_constraints)
        pc[message.senderid].addStream(localStream)
        pc[message.senderid].onicecandidate = event => {
          console.log('handleIceCandidate event: ', event)
          if (event.candidate) {
            this.sendMessage({
              data: {
                type: 'candidate',
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate
              },
              senderid: this.$store.state.myState.id,
              id: message.senderid
            })
          } else {
            console.log('End of candidates.')
          }
        }
        pc[message.senderid].onaddstream = event => {
          console.log('Remote stream added.')

          this.$refs[message.senderid][0].srcObject = event.stream
          this.remotestream = event.stream
          this.$refs[message.senderid][0].play()

          this.startRecording()
        }

        pc[message.senderid].setRemoteDescription(
          new RTCSessionDescription(message.data)
        )
        this.doAnswer(message.senderid)
      } else if (message.data.type === 'answer') {
        pc[message.senderid].setRemoteDescription(
          new RTCSessionDescription(message.data)
        )
      } else if (message.data.type === 'candidate') {
        var candidate = new RTCIceCandidate({
          sdpMLineIndex: message.data.label,
          candidate: message.data.candidate
        })
        pc[message.senderid].addIceCandidate(candidate)
      } else if (message.data.type === 'bye') {
        this.handleRemoteHangup()
      }
    }
  },
  methods: {
    videoclose: function(event) {
      this.fullscreenmode = false
      let keys = Object.keys(pc)
      this.stop()
    },
    startchat: function() {
      this.fullscreenmode = true
      let member = this.$store.state.friend.groupmember
      this.createPeerConnection()
    },
    getfriendnameandphoto: async function() {
      const home_url = `http://localhost:8181`
      const search_url = `/api/group/member/${
        this.$store.state.friend.activegroupid
      }`
      const url = home_url + search_url

      try {
        let result = await axios({
          method: 'get',
          url: url,
          headers: { 'x-access-token': this.$store.state.token }
        })
        console.log(result)
        this.$store.commit('setsetgroupmember', result.data)
        this.groupmember = result.data
      } catch (err) {
        console.log(err)
      }
    },
    tolivemode() {
      this.liveorarchive = true
      this.$nextTick(() => {
        this.$refs.video.srcObject = localStream
        this.$refs.video.play()
      })
    },

    toarchivemode() {
      this.liveorarchive = false
    },
    handleRemoteHangup() {
      this.stop()
    },
    saveRecording() {
      if (this.recordEnabled) {
        const blob_local = new Blob(this.recordedBlobs_local, {
          type: 'video/webm'
        })
        const blob_remote = new Blob(this.recordedBlobs_remote, {
          type: 'video/webm'
        })
        let d = new Date()
        const home_url = `http://localhost:8181`
        const url = home_url + '/api/video'
        let formData = new FormData()
        formData.append('video', blob_local, 'local')
        formData.append('video', blob_remote, 'remote')
        formData.append('textcontent', this.textcontent)
        formData.append('friendid', this.$store.state.friend.activefriendid)
        formData.append('time', d.toLocaleString())
        axios
          .post(url, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'x-access-token': this.$store.state.token
            }
          })
          .then(res => {
            console.log(res.data.videourl)
          })
          .catch(function() {
            console.log('FAILURE!!')
          })
      }
    },
    stopRecording() {
      if (this.recordEnabled) {
        this.mediaRecorder_local.stop()
        this.mediaRecorder_remote.stop()
        console.log('Recorded Blobs: ', this.recordedBlobs_local)
        // recordedVideo.controls = true
      }
    },
    startRecording() {
      if (this.recordEnabled) {
        this.recordedBlobs_local = []
        this.recordedBlobs_remote = []
        let options = { mimeType: 'video/webm;codecs=vp9' }
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          console.log(options.mimeType + ' is not Supported')
          options = { mimeType: 'video/webm;codecs=vp8' }
          if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            console.log(options.mimeType + ' is not Supported')
            options = { mimeType: 'video/webm' }
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
              console.log(options.mimeType + ' is not Supported')
              options = { mimeType: '' }
            }
          }
        }
        try {
          this.mediaRecorder_local = new MediaRecorder(localStream, options)
          this.mediaRecorder_remote = new MediaRecorder(
            this.remotestream,
            options
          )
        } catch (e) {
          console.error(`Exception while creating MediaRecorder: ${e}`)
          alert(
            `Exception while creating MediaRecorder: ${e}. mimeType: ${
              options.mimeType
            }`
          )
          return
        }
        console.log(
          'Created MediaRecorder',
          this.mediaRecorder_local,
          'with options',
          options
        )
        this.mediaRecorder_local.ondataavailable = this.handleDataAvailable
        this.mediaRecorder_local.start(10) // collect 10ms of data

        this.mediaRecorder_remote.ondataavailable = this.handleDataAvailable_remote
        this.mediaRecorder_remote.start(10)
        console.log('MediaRecorder started', this.mediaRecorder_local)
      }
    },
    handleDataAvailable(event) {
      if (event.data && event.data.size > 0) {
        this.recordedBlobs_local.push(event.data)
      }
    },
    handleDataAvailable_remote(event) {
      if (event.data && event.data.size > 0) {
        this.recordedBlobs_remote.push(event.data)
      }
    },

    hangup() {
      this.stop()
      let sendobj = {
        data: {
          type: 'bye'
        },
        id: this.$store.state.friend.activefriendid
      }
      this.webSocket.send(JSON.stringify(sendobj))
    },

    stop() {
      let keys = Object.keys(pc)
      if (keys.length > 0) {
        this.stopRecording()
        this.saveRecording()
        for (let i = 0; i < keys.length; i++) {
          pc[keys[i]].close()
        }

        pc = {}
      }

      this.talking = false
      this.responced = false
    },
    offercall(event) {
      this.offering = true
      this.callingmessage = 'Calling to'

      setTimeout(() => {
        this.offering = false
      }, 10000)

      let sendobj = {
        data: {
          type: 'call',
          sender: this.$store.state.myState.id
        },
        id: this.$store.state.friend.activefriendid
      }
      this.webSocket.send(JSON.stringify(sendobj))
    },
    responsecallaccept(event) {
      this.responced = true

      this.talking = true
      this.callcomming = false
      let sendobj = {
        data: {
          type: 'responce',
          res: 'accept',
          sender: this.$store.state.myState.id
        },
        id: this.$store.state.friend.activefriendid
      }
      this.webSocket.send(JSON.stringify(sendobj))
    },
    responsecallreject(event) {
      this.responced = true
      this.callcomming = false
      this.talking = false
      let sendobj = {
        data: {
          type: 'responce',
          res: 'reject',
          sender: this.$store.state.myState.id
        },
        id: this.$store.state.friend.activefriendid
      }
      this.webSocket.send(JSON.stringify(sendobj))
    },
    sendMessage(message) {
      console.log('Sending message: ', message)
      this.webSocket.send(JSON.stringify(message))
    },
    doAnswer(senderid) {
      console.log('Sending answer to peer.')
      pc[senderid].createAnswer(
        sessionDescription => {
          pc[senderid].setLocalDescription(sessionDescription)
          this.sendMessage({
            data: sessionDescription,
            id: senderid,
            senderid: this.$store.state.myState.id
          })
        },
        onSignalingError,
        sdpConstraints
      )
    },

    createPeerConnection() {
      let groupmember = this.$store.state.friend.groupmember
      for (let i = 0; i < groupmember.length; i++) {
        let memberid = groupmember[i].id

        try {
          pc[memberid] = new RTCPeerConnection(pc_config, pc_constraints)
          pc[memberid].addStream(localStream)
          pc[memberid].onicecandidate = event => {
            console.log('handleIceCandidate event: ', event)
            if (event.candidate) {
              this.sendMessage({
                data: {
                  type: 'candidate',
                  label: event.candidate.sdpMLineIndex,
                  id: event.candidate.sdpMid,
                  candidate: event.candidate.candidate
                },
                id: memberid,
                senderid: this.$store.state.myState.id
              })
            } else {
              console.log('End of candidates.')
            }
          }
          pc[memberid].onaddstream = event => {
            console.log('Remote stream added.')
            this.$refs[memberid][0].srcObject = event.stream
            this.remotestream = event.stream
            this.$refs[memberid][0].play()
            this.startRecording()
          }
        } catch (e) {
          console.log(
            'Failed to create PeerConnection, exception: ' + e.message
          )
          alert('Cannot create RTCPeerConnection object.')
          return
        }
        pc[memberid].createOffer(
          sessionDescription => {
            pc[memberid].setLocalDescription(sessionDescription)
            this.sendMessage({
              data: sessionDescription,
              id: memberid,
              senderid: this.$store.state.myState.id
            })
          },
          onSignalingError,
          sdpConstraints
        )
      }
    }
  }
}

navigator.getUserMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia

var constraints = { video: true, audio: true }
var localStream
var pc_config =
  webrtcDetectedBrowser === 'firefox'
    ? { iceServers: [{ url: 'stun:23.21.150.121' }] }
    : { iceServers: [{ url: 'stun:stun.l.google.com:19302' }] }
var pc_constraints = { optional: [{ DtlsSrtpKeyAgreement: true }] }
var sdpConstraints = {}

// collect garbage before unloading browser's window

var peerSockets = []
var pc = {}

function onSignalingError(error) {
  console.log('Failed to create signaling message : ' + error.name)
}

var OrigPeerConnection = window.RTCPeerConnection
</script>



<style lang="scss" scoped>
@import '../../scss/color.scss';
@import '../../scss/form.scss';
@import '../../scss/button.scss';
@import '../../scss/basic.scss';
@import '../../scss/switchbutton.scss';

ul {
  display: flex;
  justify-content: center;
  li {
    padding: 0px 30px;
  }
}

.fullscreen {
  position: fixed;
  height: 100vh;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 4;
  background: black;

  h2 {
    background: black;
    color: white;
    margin: 0;
    padding: 20px;
  }
}

.inner__fullscreen {
  display: grid;
  grid-template-columns: 50% 50%;
  height: 100vh;
  width: 100%;
  video {
    background: black;
    color: white;
    width: 100%;
  }
}

ul {
  list-style: none;
}
.videotextarea {
  width: 80%;
  resize: none;
  outline: none;
  height: 200px;
  font-size: 1.3rem;
  color: $font-color;
  padding: 10px;
  border-radius: 10px;
}

.recordfeedback {
  margin: 20px;
}
.mode__container {
  margin: 30px;
}

.calling {
  position: absolute;
  top: 50%;
  left: 50%;
  color: white;
  transform: translate(-50%, -50%);
}

.friendnamecontainer {
  background: $main-color;
  height: 50px;
  top: 0px;

  h2 {
    margin: 0px;
    padding: 6px;
    color: white;
  }
  border-bottom: 1px solid $border-color2;
  border-left: 1px solid $border-color2;
}

#video__container {
  min-width: 600px;
  margin: 0 auto;
  height: 100vh;
  position: relative;
}

#video__innercontainer {
  position: relative;
}

.video_frame {
  position: relative;
  width: 80%;
  margin: 0 auto;
}

#youvideo {
  background: black;
  width: 100%;
  border-radius: 10px;
  outline: none;
}

#mevideo {
  border-radius: 10px;
  position: absolute;
  z-index: 3;
  right: 0;
  bottom: 5px;
}

#callbutton {
  position: absolute;
  z-index: 2;
  background: transparent;
  color: white;
  font-size: 1.5rem;
  border: 1px solid white;
  bottom: 20px;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  outline: none;
}

#callbutton:hover {
  color: $hover-color;
  border: 1px solid $hover-color;
}

.callcommingbutton {
  z-index: 3;
  background: transparent;
  color: white;
  font-size: 1.5rem;
  border: 1px solid white;
  bottom: 10px;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  padding: 15px;
  outline: none;
  margin: 30px;
}

.accept {
  color: rgb(52, 202, 109);
  border-color: rgb(52, 202, 109);
}

.profile-img-small {
  width: 20px;
  height: 20px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid rgb(73, 53, 53);
}

.reject {
  color: $main-color;
  border-color: $main-color;
}

.callcomming__container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>