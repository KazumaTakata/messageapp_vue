<template>
<div>
    <div id="video__container">
        <div class="friendnamecontainer">
          {{this.$store.state.acitvename}}
        </div>
        <div id="video__innercontainer">
            <video width="130" height="100"  muted ref="video" id="mevideo" ></video>
             <video width="500" height="420"  ref="video2" id="youvideo" ></video>
            <button v-on:click="createPeerConnection" id="callbutton">
                <font-awesome-icon icon="phone"/>
            </button>
        </div>    
    </div> 
</div>
</template>


<script>
var webSocket = new WebSocket('ws://localhost:8183')

export default {
  data() {
    return {
      test: 'test'
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

    webSocket.onmessage = jsonmessage => {
      let message = JSON.parse(jsonmessage.data)

      if (message.type === 'offer') {
        pc = new RTCPeerConnection(pc_config, pc_constraints)
        pc.addStream(localStream)
        pc.onicecandidate = function(event) {
          console.log('handleIceCandidate event: ', event)
          if (event.candidate) {
            sendMessage({
              type: 'candidate',
              label: event.candidate.sdpMLineIndex,
              id: event.candidate.sdpMid,
              candidate: event.candidate.candidate
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
        doAnswer()
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
    createPeerConnection: function(event) {
      console.log(this.test)
      console.log('clicked')
      try {
        // document.getElementById("videoContainer").appendChild(video)

        pc = new RTCPeerConnection(pc_config, pc_constraints)
        pc.addStream(localStream)
        pc.onicecandidate = event => {
          console.log('handleIceCandidate event: ', event)
          if (event.candidate) {
            sendMessage({
              type: 'candidate',
              label: event.candidate.sdpMLineIndex,
              id: event.candidate.sdpMid,
              candidate: event.candidate.candidate
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
        function(sessionDescription) {
          pc.setLocalDescription(sessionDescription)
          sendMessage(sessionDescription)
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

function sendMessage(message) {
  console.log('Sending message: ', message)
  webSocket.send(JSON.stringify(message))
}

function doAnswer() {
  console.log('Sending answer to peer.')
  pc.createAnswer(
    function(sessionDescription) {
      pc.setLocalDescription(sessionDescription)
      sendMessage(sessionDescription)
    },
    onSignalingError,
    sdpConstraints
  )
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


