<template>
  <q-avatar :size="size + 'px'">
    <img
      :src="file || avatar"
      @error="unexist"
    >
  </q-avatar>
</template>

<script>
import Files from 'assets/js/Files.js'

export default {
  name: 'Avatar',
  props: {
    id: {
      type: Number,
      default: () => null
    },
    avatar: {
      type: String,
      default: () => null
    },
    download: {
      type: String,
      default: () => null
    },
    size: {
      type: Number,
      default: () => 48
    }
  },
  data: () => ({
    file: null
  }),
  async created () {
    if (this.avatar.search('base64') === -1) {
      const path = this.download ? await Files.getSrc(this.download) + '/' : process.env.PATH
      this.file = path + this.id + '/' + this.avatar
    }
  },
  methods: {
    unexist: function () {
      if (this.download) {
        const dataDir = `${this.download.toLowerCase()}Directory`

        fetch(process.env.API + 'avatar/' + this.id + '/' + this.avatar, { mode: 'cors' })
          .then(response => response.blob())
          .then(blob => {
            window.resolveLocalFileSystemURL(cordova.file[dataDir], dirEntry => {
              dirEntry.getDirectory(this.id.toString(), { create: true }, subDirEntry => {
                subDirEntry.getFile(this.avatar, { create: true, exclusive: false }, fileEntry => {
                  fileEntry.createWriter(fileWriter => {
                    fileWriter.onwriteend = () => {
                      URL.revokeObjectURL(url)
                      console.log('Successful file write...')
                    }
                    fileWriter.onerror = function (e) {
                      console.log('Failed file write: ' + e.toString())
                    }

                    const url = URL.createObjectURL(blob)
                    this.file = url

                    fileWriter.write(blob)
                  })
                }, function (errorCreate) {
                  console.error(errorCreate)
                })
              }, function (errorSubDir) {
                console.error(errorSubDir)
              })
            }, function (errorLoad) {
              console.error(errorLoad)
            })
          })
          .catch(function (err) {
            console.error('Failed retrieving information', err)
          })
      }
    }
  }
}
</script>
