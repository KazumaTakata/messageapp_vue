<template>
    <div>
        <div class="panel" v-bind:class="{active: this.$store.state.isActiveCreateGroup}">
            <button v-on:click="close" class="closebutton">
                <font-awesome-icon icon="times" />
            </button>
            <div class="form__container">
                <h2>Create New Group !!</h2>
                <div>
                    <input v-model="groupname" placeholder="name" type="text">
                    <p>{{nofindmessage}}</p>
                </div>
                <div>
                    <textarea v-model="groupdescription" placeholder="description"></textarea>
                </div>
                <div class="result__container">
                    <button v-on:click="creategroup" class="basicbutton">CREATE</button>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import axios from 'axios'
export default {
  data() {
    return {
      friendaddmessage: '',
      groupname: '',
      groupdescription: '',
      searchusername: '',
      searchuserid: '',
      searchuserphotourl: 'http://localhost:8181/img/defaultprofile.jpg',
      nofindmessage: '',
      previewimageurl: this.$store.state,
      profilephoto: ''
    }
  },

  methods: {
    creategroup: async function() {
      const home_url = `http://localhost:8181`
      const group_url = '/api/group'
      const url = home_url + group_url

      try {
        let result = await axios({
          method: 'post',
          url: url,
          data: {
            groupname: this.groupname,
            groupdescription: this.groupdescription
          },
          headers: { 'x-access-token': this.$store.state.token }
        })
        this.friendaddmessage = 'New Group Created !!'
      } catch (err) {
        console.log(err)
        this.friendaddmessage = 'Failed to create new group.'
      }
    },
    close: function(e) {
      this.$store.commit('toggleGroup')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../scss/color.scss';
@import '../../scss/form.scss';
@import '../../scss/button.scss';
</style>