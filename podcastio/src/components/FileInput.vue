<template>
    <div>
        <div>
            <h3>{{audioTitle}}</h3>
            {{audioLength}}
        </div>
        <div>
            <audio id="audio" controls="controls">
            </audio>
        </div>
        <div>
            <v-btn raised @click="onPickFile" v-if="!audioTitle">
                {{ selectLabel }}
            </v-btn>
            <v-btn raised class="error" @click="removeFile" v-else>
                {{ removeLabel }}
            </v-btn>
            <input
                    type="file"
                    ref="audio"
                    name="audio"
                    :accept="accept"
                    @change="onFilePicked"
            >
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            value: {
                type: String
            },
            accept: {
                type: String,
                default: '*'
            },
            selectLabel: {
                type: String,
                default: 'Select Audio File'
            },
            removeLabel: {
                type: String,
                default: 'Remove'
            }
        },

        data() {
            return {
                audioTitle: '',
                audioLength: 0,
            }
        },

        watch: {
            value(v) {
                this.audioTitle = v
            }
        },

        mounted() {
            this.audioTitle = this.value
        },

        methods: {
            onPickFile() {
                this.$refs.audio.click()
            },

            onFilePicked(event) {
                const files = event.target.files || event.dataTransfer.files
                 const fileReader = new FileReader()
                if (files && files[0]) {
                    let filename = files[0].name
                   
                    fileReader.readAsDataURL(files[0])

                    if (filename && filename.lastIndexOf('.') <= 0) {
                        return alert('Please add a valid image!')
                    }
                    this.audioTitle = files[0].name
                    this.$emit('input', files[0])
                }
                    var app = this;

                    fileReader.addEventListener("load", function(){
                        var source = document.getElementById('audio');
                        source.src = fileReader.result
                        source.controls = true
                        source.addEventListener('loadedmetadata', function() {
                            console.log(", for: " + source.duration + "seconds.");
                            var seconds = Math.ceil(source.duration)
                            app.audioLength = seconds
                            app.$emit('audioLength',app.audioLength)
                        });

                    })

                    
            },

            removeFile() {
                this.audioTitle = ''
                var source = document.getElementById('audio');
                source.src = ""
            }
        }
    }
</script>

<style scoped>
    input[type=file] {
        position: absolute;
        left: -99999px;
    }
</style>