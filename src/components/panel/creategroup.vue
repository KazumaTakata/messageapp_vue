<template>
    <div>
        <div class="panel" v-bind:class="{active: this.$store.state.view.isActiveCreateGroup}">
            <button v-on:click="close" class="closebutton">
                <font-awesome-icon icon="times" />
            </button>
            <div class="form__container">
                <h3 class="white-title">Create New Group !!</h3>
                <div>
                    <input v-model="groupname" placeholder="name" type="text">
                    <p>{{groupnamewarning}}</p>
                </div>
                <div>
                    <textarea v-model="groupdescription" placeholder="description"></textarea>
                    <p>{{groupdescriptionwarning}}</p>
                </div>
                <div class="result__container">
                    <button v-on:click="creategroup" class="basicbutton">CREATE</button>
                    <div class="margin10">
                        {{this.friendaddmessage}}
                    </div>
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
      groupnamewarning: '',
      groupdescription: '',
      groupdescriptionwarning: '',
      searchusername: '',
      searchuserid: '',
      searchuserphotourl: 'http://localhost:8181/img/defaultprofile.jpg',
      nofindmessage: '',
      profilephoto: ''
    }
  },

  methods: {
    creategroup: async function() {
      this.groupdescriptionwarning = ''
      this.groupnamewarning = ''
      if (this.groupname != '' && this.groupdescription != '') {
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
          let result5 = await axios({
            method: 'get',
            url: `http://localhost:8181/api/group`,
            headers: { 'x-access-token': this.$store.state.token }
          })

          this.$store.commit('setgroup', result5.data)
        } catch (err) {
          console.log(err)
          this.friendaddmessage = 'Failed to create new group.'
        }
      } else {
        if (this.groupname == '') {
          this.groupnamewarning = 'Name should not be empty.'
        }

        if (this.groupdescription == '') {
          this.groupdescriptionwarning = 'Description should not be empty.'
        }
      }
    },
    close: function(e) {
      this.$store.commit('toggleGroup')
      this.friendaddmessage = ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../scss/color.scss';
@import '../../scss/form.scss';
@import '../../scss/button.scss';
@import '../../scss/basic.scss';
</style>