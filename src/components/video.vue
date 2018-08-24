<template>
  <div>
    <div id="video__container">
      <div class="friendnamecontainer">
        <h2>{{this.$store.state.acitvename}}</h2>
      </div>
      <div id="video__innercontainer">
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
      <template v-if="callcomming">
        <p>incoming call ...</p>
      </template>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      test: 'test',
      webSocket: '',
      callcomming: false,
      talking: false,
      offering: false,
      responced: false,
      callcommingid: '',
      callingmessage: 'Calling to'
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

    // this.webSocket.onopen = event => {
    //   console.log('open')
    //   this.webSocket.send(
    //     JSON.stringify({ pingid: this.$store.state.myState.id })
    //   )
    // }

    this.webSocket.addEventListener('message', jsondata => {
      let message = JSON.parse(jsondata.data)
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
    })
  },
  methods: {
    handleRemoteHangup() {
      this.stop()
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
      pc.close()
      pc = null
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

.calling {
  position: absolute;
  top: 50%;
  left: 50%;
  color: white;
  transform: translate(-50%, -50%);
}

.friendnamecontainer {
  padding: 10px;
  border-bottom: 1px solid $border-color;
}
#video__container {
  min-width: 600px;
  margin: 0 auto;
  height: 100vh;
  position: relative;
}

#video__innercontainer {
  width: 500px;
  position: absolute;

  height: 420px;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
}

#youvideo {
  background: black;
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 10px;
  outline: none;
}

#mevideo {
  border-radius: 10px;
  position: absolute;
  z-index: 3;
  left: 370px;
  top: 320px;
}

#callbutton {
  position: absolute;
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
}

#callbutton:hover {
  transform: scale(1.1);
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
  color: greenyellow;
  border-color: greenyellow;
}
.reject {
  color: red;
  border-color: red;
}

.callcomming__container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>


