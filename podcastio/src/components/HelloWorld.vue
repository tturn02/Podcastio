<template>
  <v-container>
    <v-layout
      text-xs-center
      wrap
    >
    <v-flex xs12 mb4>
    {{text}}
    </v-flex>
    <file-input
    accept="audio/*"
    ref="fileInput"
    @input="getUploadedFile">
      
    </file-input>
    <v-btn @click="onSubmit()">Submit
    </v-btn>
    </v-layout>
  </v-container>
</template>

<script>

import FileInput from '../components/FileInput.vue'
import axios from 'axios'

  export default {
    components: {FileInput},
    data() {
            return {
                audio: '',
                title: '',
                description: '',
                text: ''
            }
        },

    methods: {
            getUploadedFile(e) {
                this.audio = e
            },
            onSubmit() {
                 let formData = new FormData()
                 formData.set('audio', this.audio)
                 formData.set('title', "the end")

                 axios.post('http://localhost:3000/upload', formData)
                       .then(response => {
                         console.log(response)
                          this.formatResponse(response.data)
                        })
                       .catch(error => {
                            console.log(error)
                        })
            },
          formatResponse(data){
            data.results.forEach(obj => {
              this.text += obj.alternatives[0].transcript
            });
          }
        }
  }
</script>

<style>

</style>
