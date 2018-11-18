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
    @input="getUploadedFile"
    @audioLength="setAudioLength">
      
    </file-input>
    <v-flex
    shrink
        style="width: 60px">
      <v-text-field
          v-model="clip[0]"
          class="mt-0"
          hide-details
          single-line
          type="number"
        ></v-text-field>
      </v-flex>

      <v-flex>
        <v-range-slider
          v-model="clip"
          :max="audioLength"
          :min="0"
          :step="1"
        ></v-range-slider>
      </v-flex>

      <v-flex
        shrink
        style="width: 60px"
      >
        <v-text-field
          v-model="clip[1]"
          class="mt-0"
          hide-details
          single-line
          type="number"
        ></v-text-field>
      </v-flex>
    <v-flex x12>
      <v-btn @click="onSubmit()" style="float: right">Submit
      </v-btn>
    </v-flex>
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
                text: '',
                audioLength: 0,
                clip: [0,0]
            }
        },

    methods: {
            getUploadedFile(e) {
                this.audio = e
            },
            setAudioLength(e){
              this.audioLength = e
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
