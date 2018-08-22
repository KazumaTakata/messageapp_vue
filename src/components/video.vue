<template>
  <div>
    <div id="video__container">
      <div class="friendnamecontainer">
        {{this.$store.state.acitvename}}
      </div>
      <div id="video__innercontainer">
        <video width="130" height="100" muted ref="video" id="mevideo"></video>
        <video width="500" height="420" ref="video2" id="youvideo"></video>
        <button v-on:click="createPeerConnection" id="callbutton">
          <font-awesome-icon icon="phone" />
        </button>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      test: 'test',
      websocket: ''
    }
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

    this.webSocket = new WebSocket('ws://localhost:8183')

    this.webSocket.onopen = event => {
      console.log('open')
      this.webSocket.send(
        JSON.stringify({ pingid: this.$store.state.myState.id })
      )
    }

    this.webSocket.onmessage = jsonmessage => {
      let message = JSON.parse(jsonmessage.data)

      if (message.type === 'offer') {
        pc = new RTCPeerConnection(pc_config, pc_constraints)
        pc.addStream(localStream)
        pc.onicecandidate = event => {
          console.log('handleIceCandidate event: ', event)
          if (event.candidate) {
            // sendMessage({
            //   type: 'candidate',
            //   label: event.candidate.sdpMLineIndex,
            //   id: event.candidate.sdpMid,
            //   candidate: event.candidate.candidate
            // })
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
          // this.$refs.video2.srcObject =  event.stream
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
      } else if (message === 'bye' && isStarted) {
        handleRemoteHangup()
      }
    }
  },
  methods: {
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



<style>
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
  padding: 15px;
  outline: none;
}

#callbutton:hover {
  transform: scale(1.1);
}
</style>


