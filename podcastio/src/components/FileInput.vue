<template>
    <div>
        <div>
            {{audioTitle}}
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
                audioTitle: ''
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

                if (files && files[0]) {
                    let filename = files[0].name

                    if (filename && filename.lastIndexOf('.') <= 0) {
                        return //return alert('Please add a valid image!')
                    }

                    const fileReader = new FileReader()
                    fileReader.addEventListener('load', () => {
                        console.log(fileReader)
                        this.audioTitle = "File Selected"
                    })
                    fileReader.readAsDataURL(files[0])

                    this.$emit('input', files[0])
                }
            },

            removeFile() {
                this.audioTitle = ''
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