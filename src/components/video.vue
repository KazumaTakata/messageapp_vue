<template>
  <div>
    <div id="video__container">
      <div class="friendnamecontainer">
        <h2>{{this.$store.state.acitvename}}</h2>
      </div>
      <div class="mode__container">
        <button v-on:click="tolivemode" class="basicbutton-white">
          LIVE
        </button>
        <button v-on:click="toarchivemode" class="basicbutton-white">
          ARCHIVE
        </button>
      </div>
      <template v-if="liveorarchive">
        <div id="video__innercontainer">

          <div class="video_frame">
            <video width="130" height="100" muted ref="video" id="mevideo"></video>
            <video width="500" height="420" ref="video2" id="youvideo"></video>

            <template v-if="!callcomming">
              <template v-if="offering">
                <div class="calling">
                  {{this.callingmessage}} {{this.$store.state.acitvename}}
                </div>
              </template>
              <template v-if="talking">
                <button v-on:click="hangup" id="callbutton">
                  <font-awesome-icon icon="times" />
                </button>
              </template>
              <template v-else>
                <button v-on:click="offercall" id="callbutton">
                  <font-awesome-icon icon="phone" />
                </button>
              </template>
            </template>
            <template v-else>
              <div class="callcomming__container">
                <button v-on:click="responsecallaccept" class="callcommingbutton accept">
                  <font-awesome-icon icon="phone" />
                </button>
                <button v-on:click="responsecallreject" class="callcommingbutton reject">
                  <font-awesome-icon icon="times" />
                </button>
              </div>
            </template>
          </div>
        </div>
        <template v-if="callcomming">
          <p>incoming call ...</p>
        </template>
        <p>
          Do you record this video chat?
        </p>

        <div class="text__container">
          <div class="onoffswitch">
            <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="myonoffswitch">
            <label class="onoffswitch-label" for="myonoffswitch">
              <span class="onoffswitch-inner"></span>
              <span class="onoffswitch-switch"></span>
            </label>
          </div>
          <!-- <button ref="startstopbutton" v-on:click="startrecording" class="basicbutton-white">
            {{startstoptext}}
          </button>

          <button v-on:click="saverecording" class="basicbutton-white">
            SAVE
          </button> -->
        </div>
        <!-- <div class="recordfeedback">
          {{recordfeedbackmessage}}
        </div> -->
        <!-- <textarea v-model="textcontent" class="videotextarea"></textarea> -->
      </template>
      <template v-else>
        <VideoList></VideoList>
      </template>

    </div>
  </div>
</template>


<script>
import axios from 'axios'
import VideoList from './video/videolist'
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
      textcontent: ''
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
      this.$store.state.callcoming.includes(this.$store.state.activefriendid)
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
      if (message.type === 'call') {
        if (message.sender == this.$store.state.activefriendid) {
          this.callcommingid = message.sender
          this.callcomming = true
          this.talking = true
          setTimeout(() => {
            if (!this.responced) {
              this.callcomming = false
              this.talking = false
            }
          }, 10000)
        }
      } else if (message.type == 'responce') {
        if (message.res == 'accept') {
          this.offering = false
          this.talking = true
          this.createPeerConnection()
        } else {
          this.callingmessage = 'Rejected by'
        }
      } else if (message.type === 'offer') {
        pc = new RTCPeerConnection(pc_config, pc_constraints)
        pc.addStream(localStream)
        pc.onicecandidate = event => {
          console.log('handleIceCandidate event: ', event)
          if (event.candidate) {
            this.sendMessage({
              data: {
                type: 'candidate',
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate
              },
              id: this.$store.state.activefriendid
            })
          } else {
            console.log('End of candidates.')
          }
        }
        pc.onaddstream = event => {
          console.log('Remote stream added.')

          this.$refs.video2.srcObject = event.stream
          this.remotestream = event.stream
          this.$refs.video2.play()
        }

        pc.setRemoteDescription(new RTCSessionDescription(message))
        this.doAnswer()
      } else if (message.type === 'answer') {
        pc.setRemoteDescription(new RTCSessionDescription(message))
      } else if (message.type === 'candidate') {
        var candidate = new RTCIceCandidate({
          sdpMLineIndex: message.label,
          candidate: message.candidate
        })
        pc.addIceCandidate(candidate)
      } else if (message.type === 'bye') {
        this.handleRemoteHangup()
      }
    }
  },
  methods: {
    saverecording() {
      if (this.recordedBlobs_local.length != 0) {
        this.saveRecording()
      } else {
        this.recordfeedbackmessage = 'There is no recorded video.'
      }
    },
    startrecording() {
      if (this.remotestream != null) {
        if (this.startstoptext == 'START') {
          this.startRecording()
          this.startstoptext = 'STOP'
          this.recordfeedbackmessage = 'RECORDING'
        } else {
          this.stopRecording()
          this.startstoptext = 'START'
          this.recordfeedbackmessage = 'RECORDED'
        }
      } else {
        this.recordfeedbackmessage = 'You are not talking.'
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
      formData.append('friendid', this.$store.state.activefriendid)
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
    },
    stopRecording() {
      this.mediaRecorder_local.stop()
      this.mediaRecorder_remote.stop()
      console.log('Recorded Blobs: ', this.recordedBlobs_local)
      // recordedVideo.controls = true
    },
    startRecording() {
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
      // recordButton.textContent = 'Stop Recording'
      // playButton.disabled = true
      // downloadButton.disabled = true
      // mediaRecorder.onstop = handleStop
      this.mediaRecorder_local.ondataavailable = this.handleDataAvailable
      this.mediaRecorder_local.start(10) // collect 10ms of data

      this.mediaRecorder_remote.ondataavailable = this.handleDataAvailable_remote
      this.mediaRecorder_remote.start(10)
      console.log('MediaRecorder started', this.mediaRecorder_local)
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
        id: this.$store.state.activefriendid
      }
      this.webSocket.send(JSON.stringify(sendobj))
    },

    stop() {
      if (pc != null) {
        pc.close()
        pc = null
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
        id: this.$store.state.activefriendid
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
        id: this.$store.state.activefriendid
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
        id: this.$store.state.activefriendid
      }
      this.webSocket.send(JSON.stringify(sendobj))
    },
    sendMessage(message) {
      console.log('Sending message: ', message)
      this.webSocket.send(JSON.stringify(message))
    },
    doAnswer() {
      console.log('Sending answer to peer.')
      pc.createAnswer(
        sessionDescription => {
          pc.setLocalDescription(sessionDescription)
          this.sendMessage({
            data: sessionDescription,
            id: this.$store.state.activefriendid
          })
        },
        onSignalingError,
        sdpConstraints
      )
    },

    createPeerConnection(event) {
      console.log(this.test)
      console.log('clicked')
      try {
        // document.getElementById("videoContainer").appendChild(video)

        pc = new RTCPeerConnection(pc_config, pc_constraints)
        pc.addStream(localStream)
        pc.onicecandidate = event => {
          console.log('handleIceCandidate event: ', event)
          if (event.candidate) {
            this.sendMessage({
              data: {
                type: 'candidate',
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate
              },
              id: this.$store.state.activefriendid
            })
          } else {
            console.log('End of candidates.')
          }
        }
        pc.onaddstream = event => {
          console.log('Remote stream added.')
          this.$refs.video2.srcObject = event.stream
          this.remotestream = event.stream
          this.$refs.video2.play()
        }
      } catch (e) {
        console.log('Failed to create PeerConnection, exception: ' + e.message)
        alert('Cannot create RTCPeerConnection object.')
        return
      }

      pc.createOffer(
        sessionDescription => {
          pc.setLocalDescription(sessionDescription)
          this.sendMessage({
            data: sessionDescription,
            id: this.$store.state.activefriendid
          })
        },
        onSignalingError,
        sdpConstraints
      )
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
var pc

function onSignalingError(error) {
  console.log('Failed to create signaling message : ' + error.name)
}

var OrigPeerConnection = window.RTCPeerConnection
</script>



<style lang="scss" scoped>
@import '../scss/color.scss';
@import '../scss/form.scss';
@import '../scss/button.scss';
@import '../scss/basic.scss';
@import '../scss/switchbutton.scss';
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


