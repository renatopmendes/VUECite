<template>
  <div class="fixed-top bg-dark">
    <swiper
      ref="swip"
      class="swiper vertical text-white"
      :options="swiperOptionv"
      @slide-change-transition-start="changeStart"
      @slide-change-transition-end="change"
    >
      <swiper-slide
        v-for="(page, i) in pages"
        :key="i"
      >
        <swiper
          :ref="'swip' + i"
          class="swiper"
          :options="swiperOptionh"
          @slide-change-transition-start="changeStart"
          @slide-change-transition-end="change(i)"
        >
          <swiper-slide
            v-for="(post, j) in page.posts"
            :key="j"
          >
            <div
              v-if="post.video"
              class="fit backdrop column justify-center items-center"
              :style="'background-image: url('+path+page.id+'/'+post.id+'/'+post.image+')'"
            >
              <div class="backdrop__filter fit fixed" />
              <div
                class="snapshot"
                :style="'background-image: url('+path+page.id+'/'+post.id+'/'+post.image+')'"
              >
                <q-spinner
                  color="white"
                  size="3em"
                  class="loading"
                />
              </div>

              <video
                :src="path+page.id+'/'+post.id+'/'+post.video"
                :autoplay="i === 0 && j === 0 && startV === 0 && startH === 0"
                loop
                preload="auto"
                :class="['invisible absolute-center full-width', `video${i}${j}`]"
                @canplay="playVideo"
                @click="controlVideo($event.target)"
              />
            </div>

            <div
              v-else-if="post.image"
              class="fit backdrop column justify-center items-center"
              :style="'background-image: url('+path+page.id+'/'+post.id+'/'+post.image+')'"
            >
              <div class="backdrop__filter fit fixed" />
              <q-img
                :src="path+page.id+'/'+post.id+'/'+post.image"
                spinner-color="white"
              />
            </div>

            <div
              v-else-if="post.message"
              :class="['message fit q-my-lg q-px-md column justify-center items-center', `bg-${post.color}-10`, post.textSize]"
              :style="{'font-family': post.family}"
            >{{post.message}}</div>

            <div
              v-else-if="post.youtube"
              class="fit backdrop column justify-center items-center"
              :style="'background-image: url(https://img.youtube.com/vi/'+post.youtube+'/mqdefault.jpg)'"
            >
              <div class="backdrop__filter fit fixed" />
              <div
                class="youtube q-my-xl"
                :style="'background-image: url(https://img.youtube.com/vi/'+post.youtube+'/mqdefault.jpg)'"
              >
                <q-spinner
                  color="white"
                  size="3em"
                  class="loading"
                />
                <iframe
                  :src="`https://www.youtube.com/embed/${post.youtube}?autoplay=0&controls=0&fs=0&rel=0&showinfo=0`"
                  frameborder="0"
                  :class="`yt${i}${j}`"
                ></iframe>
              </div>
            </div>

            <div
              class="absolute-bottom-left q-ml-sm q-mb-xl text-left"
              @click="$router.currentRoute.name!=='page' && $router.currentRoute.name!=='profile' ? $router.push({ path: 'profile', query: { id: page.id } }) : null"
            >
              <avatar
                :id="page.id"
                :avatar="page.avatar"
                :download="download"
              />
              <div
                class="text-white ellipsis"
                style="text-shadow: 2px 2px rgba(0, 0, 0, 0.3); width: 80vw;"
              >
                {{page.name}}
              </div>
            </div>

            <div
              class="absolute q-mr-sm q-mb-xl text-right"
              style="bottom: 75px; right: 0; text-shadow: 2px 2px rgba(0, 0, 0, 0.3);"
            >
              <q-icon
                color="white"
                name="visibility"
                style="font-size: 1.7em; margin-bottom: -4px;"
              />
              <div class="text-white text-center">
                {{post.views > 10000000 ? Math.floor(post.views / 1000000) + 'M' : (post.views > 10000 ? Math.floor(post.views / 1000) + 'K' : post.views)}}
              </div>
            </div>

            <div
              class="absolute-bottom-right q-mr-sm q-mb-xl text-right"
              style="text-shadow: 2px 2px rgba(0, 0, 0, 0.3);"
            >
              <div>
                <q-icon
                  v-if="!post.video"
                  color="white"
                  name="share"
                  class="q-mb-md"
                  style="font-size: 1.7em;"
                  @click="share"
                />
              </div>

              <q-icon
                v-if="!post.youtube"
                color="white"
                name="get_app"
                style="font-size: 1.7em;"
                @click="makeDownload"
              />
            </div>

            <div
              v-if="post.commentary"
              class="commentary absolute-bottom q-px-sm bg-dark text-white"
            >
              <div
                class="text-center"
                v-touch-swipe.mouse.up="$event => {$el.querySelector(`.commentary-${i}-${j}`).classList.remove('ellipsis')}"
                v-touch-swipe.mouse.down="$event => {$el.querySelector(`.commentary-${i}-${j}`).classList.add('ellipsis')}"
              >
                ...
              </div>
              <div :class="['commentary__text ellipsis', `commentary-${i}-${j}`]">
                {{post.commentary}}
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

import Avatar from 'components/Avatar.vue'

import { dom } from 'quasar'

import canvasTxt from 'canvas-txt'

import { Plugins } from '@capacitor/core'

export default {
  name: 'Carousel',
  components: {
    Avatar,
    Swiper,
    SwiperSlide
  },
  props: {
    pages: {
      type: Array,
      default: () => []
    },
    startV: {
      type: Number,
      default: () => 0
    },
    startH: {
      type: Number,
      default: () => 0
    },
    pause: {
      type: Boolean,
      default: () => false
    },
    admob: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {
      path: null,
      download: null,
      swiperOptionv: {
        direction: 'vertical',
        preloadImages: false,
        spaceBetween: 1
      },
      swiperOptionh: {
        preloadImages: false,
        spaceBetween: 1
      },
      activeV: 0,
      activeH: 0
    }
  },
  created () {
    this.path = process.env.PATH
  },
  mounted () {
    if (this.pages.length === 1) {
      this.$refs.swip.$swiper.allowSlidePrev = false
      this.$refs.swip.$swiper.allowSlideNext = false
    }
    if (this.pages[0].posts.length === 1) {
      this.$refs.swip0[0].$swiper.allowSlidePrev = false
      this.$refs.swip0[0].$swiper.allowSlideNext = false
    }

    this.$refs.swip.$swiper.slideTo(this.startV, 0, false)
    this.$refs['swip' + this.startV][0].$swiper.slideTo(this.startH, 0, false)
    this.activeV = this.startV
    this.activeH = this.startH
    this.change()
  },
  watch: {
    startV: function (value) {
      this.$refs.swip.$swiper.slideTo(value, 0, false)
      this.activeV = this.startV
      this.activeH = this.startH
      this.change()
    },
    startH: function (value) {
      this.$refs['swip' + this.startV][0].$swiper.slideTo(value, 0, false)
      this.activeV = this.startV
      this.activeH = this.startH
      this.change()
    },
    pause: function (bool) {
      if (this.pages[this.activeV].posts[this.activeH].video && this.$el.querySelector(`.video${this.activeV}${this.activeH}`)) {
        const video = this.$el.querySelector(`.video${this.activeV}${this.activeH}`)
        if (!bool) {
          video.pause()
          video.currentTime = 0
        } else {
          video.play()
        }
      }

      if (!bool && this.pages[this.activeV].posts[this.activeH].youtube) {
        const yt = this.$el.querySelector(`.yt${this.activeV}${this.activeH}`)
        const src = yt.src
        yt.src = ''
        yt.src = src
      }
    },
    admob: function (bool) {
      if (bool) {
        if (this.pages[this.activeV].posts[this.activeH].video && this.$el.querySelector(`.video${this.activeV}${this.activeH}`)) {
          const video = this.$el.querySelector(`.video${this.activeV}${this.activeH}`)
          video.pause()
          video.currentTime = 0
        }

        if (this.pages[this.activeV].posts[this.activeH].youtube) {
          const yt = this.$el.querySelector(`.yt${this.activeV}${this.activeH}`)
          const src = yt.src
          yt.src = ''
          yt.src = src
        }
      }
    }
  },
  methods: {
    changeStart: function (index = null) {
      const i = index || this.$refs.swip.$swiper.activeIndex
      const j = this.$refs['swip' + i][0].$swiper.activeIndex

      if (this.pages[this.activeV].posts[this.activeH].video) {
        const video = this.$el.querySelector(`.video${this.activeV}${this.activeH}`)
        video.pause()
        // video.currentTime = 0
      }

      if (this.pages[this.activeV].posts[this.activeH].youtube) {
        const yt = this.$el.querySelector(`.yt${this.activeV}${this.activeH}`)
        const src = yt.src
        yt.src = ''
        yt.src = src
      }

      this.activeV = i
      this.activeH = j
    },
    change: function (index = null) {
      if (this.pages[this.activeV].posts[this.activeH].video && this.$el.querySelector(`.video${this.activeV}${this.activeH}`)) {
        const video = this.$el.querySelector(`.video${this.activeV}${this.activeH}`)
        video.play()
      }

      if (index !== null) {
        this.$emit('updateH', { v: this.activeV, h: this.activeH })
      } else {
        this.$emit('updateV', { v: this.activeV, h: this.activeH })
      }
    },
    playVideo: function (e) {
      e.target.classList.remove('invisible')
    },
    controlVideo: function (video) {
      if (video.paused) {
        video.play()
      } else {
        video.pause()
      }
    },
    share: function () {
      this.$q.notify({
        type: 'info',
        position: 'top',
        message: 'Processando...'
      })

      if (this.pages[this.activeV].posts[this.activeH].youtube) {
        Plugins.Share.share({
          text: this.pages[this.activeV].posts[this.activeH].commentary ? '"Cite app: ' + this.pages[this.activeV].posts[this.activeH].commentary : '"Cite app: ',
          url: `https://youtu.be/${this.pages[this.activeV].posts[this.activeH].youtube}`,
          dialogTitle: 'Compartilhar vídeo do youtube'
        })
      } else if (!this.pages[this.activeV].posts[this.activeH].image) {
        const canvas = this.canvasFromMessage()
        const ctx = canvas.getContext('2d')
        const img = new Image()
        img.src = 'cite-share.png'
        img.onload = () => {
          let shareSize = Math.floor(canvas.width > canvas.height ? (canvas.width * 0.08) : (canvas.height * 0.07))
          shareSize = shareSize < 100 ? shareSize : 100
          ctx.drawImage(img, canvas.width - (shareSize + 5), canvas.height - shareSize, shareSize, shareSize)

          Plugins.FileSharer.share({
            filename: 'shared.png',
            base64Data: canvas.toDataURL().replace('data:image/png;base64,', ''),
            contentType: 'image/png'
          }).then(() => {
            document.querySelector('.removelater').remove()
          }).catch(erro => {
            document.querySelector('.removelater').remove()
            this.$q.notify({
              type: 'negative',
              position: 'top',
              message: 'Erro ao compartilhar'
            })
          })
        }
      } else {
        fetch(process.env.API + 'media/' + this.pages[this.activeV].id + '/' + this.pages[this.activeV].posts[this.activeH].id + '/' + this.pages[this.activeV].posts[this.activeH].image, { mode: 'cors' })
          .then(response => response.blob())
          .then(blob => {
            const reader = new FileReader()
            reader.onload = () => {
              const img = new Image()
              img.src = reader.result

              img.onload = () => {
                const canvas = document.createElement('canvas')
                canvas.width = img.width
                canvas.height = img.height
                const ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0)

                const fSize = Math.floor(canvas.width > canvas.height ? (canvas.width * 0.04) : (canvas.height * 0.03))
                ctx.font = `${fSize}px Roboto`
                ctx.fillStyle = 'white'
                ctx.shadowOffsetX = 2
                ctx.shadowOffsetY = 2
                ctx.shadowBlur = 0
                ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
                ctx.textAlign = 'left'
                const pageName = this.pages[this.activeV].name
                ctx.fillText(pageName, 5, canvas.height - 5)

                const img2 = new Image()
                img2.src = 'cite-share.png'
                img2.onload = () => {
                  let shareSize = Math.floor(canvas.width > canvas.height ? (canvas.width * 0.08) : (canvas.height * 0.07))
                  shareSize = shareSize < 100 ? shareSize : 100
                  ctx.drawImage(img2, canvas.width - (shareSize + 5), canvas.height - shareSize, shareSize, shareSize)

                  Plugins.FileSharer.share({
                    filename: 'shared.png',
                    base64Data: canvas.toDataURL().replace('data:image/png;base64,', ''),
                    contentType: 'image/png'
                  }).catch(erro => {
                    this.$q.notify({
                      type: 'negative',
                      position: 'top',
                      message: 'Erro ao compartilhar'
                    })
                  })
                }
              }
            }
            reader.readAsDataURL(blob)
          })
      }
    },
    makeDownload: function () {
      this.$q.notify({
        type: 'info',
        position: 'top',
        message: 'Processando...'
      })

      if (this.pages[this.activeV].posts[this.activeH].video) {
        const path = process.env.API + 'media/' + this.pages[this.activeV].id + '/' + this.pages[this.activeV].posts[this.activeH].id + '/'
        const media = this.pages[this.activeV].posts[this.activeH].video
        const pageId = this.pages[this.activeV].id.toString()
        const self = this
        fetch(path + media, { mode: 'cors' })
          .then(response => response.blob())
          .then(blob => {
            const destin = this.$q.platform.is.android ? 'file:///storage/emulated/0/' : 'cordova.file.documentsDirectory'
            window.resolveLocalFileSystemURL(destin, dirEntry => {
              dirEntry.getDirectory(pageId, { create: true }, subDirEntry => {
                subDirEntry.getFile(media, { create: true, exclusive: false }, fileEntry => {
                  fileEntry.createWriter(fileWriter => {
                    fileWriter.onwriteend = () => {
                      self.$q.notify({
                        type: 'positive',
                        position: 'top',
                        message: 'Download realizado'
                      })
                    }
                    fileWriter.onerror = function (e) {
                      self.$q.notify({
                        type: 'negative',
                        position: 'top',
                        message: 'Erro ao fazer download'
                      })
                    }

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
      } else if (this.pages[this.activeV].posts[this.activeH].image) {
        const path = process.env.API + 'media/' + this.pages[this.activeV].id + '/' + this.pages[this.activeV].posts[this.activeH].id + '/'
        const media = this.pages[this.activeV].posts[this.activeH].image
        const pageId = this.pages[this.activeV].id.toString()
        const self = this
        fetch(path + media, { mode: 'cors' })
          .then(response => response.blob())
          .then(blob => {
            const destin = this.$q.platform.is.android ? 'file:///storage/emulated/0/' : 'cordova.file.documentsDirectory'
            window.resolveLocalFileSystemURL(destin, dirEntry => {
              dirEntry.getDirectory(pageId, { create: true }, subDirEntry => {
                subDirEntry.getFile(media, { create: true, exclusive: false }, fileEntry => {
                  fileEntry.createWriter(fileWriter => {
                    const reader = new FileReader()

                    reader.onloadend = () => {
                      fileWriter.onwriteend = () => {
                        self.$q.notify({
                          type: 'positive',
                          position: 'top',
                          message: 'Download realizado'
                        })
                      }
                      fileWriter.onerror = function (e) {
                        self.$q.notify({
                          type: 'negative',
                          position: 'top',
                          message: 'Erro ao fazer download'
                        })
                      }

                      const img = new Image()
                      img.src = reader.result

                      img.onload = () => {
                        const canvas = document.createElement('canvas')
                        canvas.width = img.width
                        canvas.height = img.height
                        const ctx = canvas.getContext('2d')
                        ctx.drawImage(img, 0, 0)

                        const fSize = Math.floor(canvas.width > canvas.height ? (canvas.width * 0.04) : (canvas.height * 0.03))
                        ctx.font = `${fSize}px Roboto`
                        ctx.fillStyle = 'white'
                        ctx.shadowOffsetX = 2
                        ctx.shadowOffsetY = 2
                        ctx.shadowBlur = 0
                        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
                        ctx.textAlign = 'left'
                        const pageName = this.pages[this.activeV].name
                        ctx.fillText(pageName, 5, canvas.height - 5)

                        const img2 = new Image()
                        img2.src = 'cite-share.png'
                        img2.onload = () => {
                          let shareSize = Math.floor(canvas.width > canvas.height ? (canvas.width * 0.08) : (canvas.height * 0.07))
                          shareSize = shareSize < 100 ? shareSize : 100
                          ctx.drawImage(img2, canvas.width - (shareSize + 5), canvas.height - shareSize, shareSize, shareSize)

                          fileWriter.write(this.b64toBlob(canvas.toDataURL()))
                        }
                      }
                    }

                    reader.readAsDataURL(blob)
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
      } else {
        const canvas = this.canvasFromMessage()
        const ctx = canvas.getContext('2d')
        const img = new Image()
        img.src = 'cite-share.png'
        img.onload = () => {
          let shareSize = Math.floor(canvas.width > canvas.height ? (canvas.width * 0.08) : (canvas.height * 0.07))
          shareSize = shareSize < 100 ? shareSize : 100
          ctx.drawImage(img, canvas.width - (shareSize + 5), canvas.height - shareSize, shareSize, shareSize)

          const pageId = this.pages[this.activeV].id.toString()
          const destin = this.$q.platform.is.android ? 'file:///storage/emulated/0/' : 'cordova.file.documentsDirectory'
          window.resolveLocalFileSystemURL(destin, dirEntry => {
            dirEntry.getDirectory(pageId, { create: true }, subDirEntry => {
              subDirEntry.getFile('download.png', { create: true, exclusive: false }, fileEntry => {
                fileEntry.createWriter(fileWriter => {
                  fileWriter.onwriteend = () => {
                    document.querySelector('.removelater').remove()
                    this.$q.notify({
                      type: 'positive',
                      position: 'top',
                      message: 'Download realizado'
                    })
                  }
                  fileWriter.onerror = function (e) {
                    document.querySelector('.removelater').remove()
                    this.$q.notify({
                      type: 'negative',
                      position: 'top',
                      message: 'Erro ao fazer download'
                    })
                  }

                  canvas.toBlob(function (blob) {
                    fileWriter.write(blob)
                  }, 'image/png')
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
        }
      }
    },
    canvasFromMessage: function () {
      const div = document.createElement('div')
      div.setAttribute('class', 'invisibile q-pb-md q-px-md full-width column justify-center items-center')
      div.classList.add(`bg-${this.pages[this.activeV].posts[this.activeH].color}-10`)
      div.classList.add(this.pages[this.activeV].posts[this.activeH].textSize)
      div.classList.add('removelater')
      const child = document.createElement('div')
      child.classList.add('full-width')
      child.innerText = this.pages[this.activeV].posts[this.activeH].message
      div.append(child)
      document.body.append(div)

      const sizes = [dom.width(div), dom.height(div), dom.width(div) / 2]
      div.style.minHeight = sizes[2] + 'px'

      const canvas = document.createElement('canvas')
      canvas.width = sizes[0]
      canvas.height = sizes[1] < sizes[2] ? sizes[2] : sizes[1]
      const ctx = canvas.getContext('2d')

      ctx.fillStyle = dom.style(div, 'background-color')
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#fff'
      ctx.shadowOffsetX = 2
      ctx.shadowOffsetY = 2
      ctx.shadowBlur = 2
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
      ctx.textAlign = 'center'
      canvasTxt.font = this.pages[this.activeV].posts[this.activeH].family
      canvasTxt.fontSize = parseInt(dom.style(div, 'font-size'))
      canvasTxt.lineHeight = parseInt(dom.style(div, 'line-height'))
      canvasTxt.drawText(ctx, child.innerText, dom.offset(child).left - dom.offset(div).left, dom.offset(child).top - dom.offset(div).top, dom.width(child), dom.height(child))

      const fSize = Math.floor(canvas.width > canvas.height ? (canvas.width * 0.03) : (canvas.height * 0.03))
      ctx.font = `${fSize}px Roboto`
      ctx.fillStyle = 'white'
      ctx.shadowOffsetX = 2
      ctx.shadowOffsetY = 2
      ctx.shadowBlur = 0
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
      ctx.textAlign = 'left'
      const pageName = this.pages[this.activeV].name
      ctx.fillText(pageName, 5, canvas.height - 5)

      return canvas
    },
    b64toBlob: function (dataURI) {
      var byteString = atob(dataURI.split(',')[1])
      var ab = new ArrayBuffer(byteString.length)
      var ia = new Uint8Array(ab)

      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }
      return new Blob([ab], { type: 'image/png' })
    }
  }
}
</script>

<style lang="scss" scoped>
.backdrop {
  background-position: center center;
  background-repeat: none;
  background-size: cover;

  &__filter {
    backdrop-filter: blur(8px);
  }

  video {
    z-index: 0;
  }
}

.message {
  text-shadow: 2px 2px rgba(0, 0, 0, 0.3);
  white-space: pre-line;
  word-break: break-word;
}

.youtube,
.snapshot {
  background-position: center center;
  background-repeat: none;
  background-size: cover;
  overflow: hidden;
  position: relative;
  width: 100%;

  &::after {
    padding-top: 56.25%;
    display: block;
    content: "";
  }

  .loading {
    position: absolute;
    left: 45%;
    top: 40%;
  }

  iframe {
    left: 0;
    top: 0;
    position: absolute;
    width: 100%;
    height: 100%;
  }
}

.commentary__text {
  max-height: 25vh;
  overflow-y: auto;
}
</style>

<style lang="scss">
.swiper {
  height: 100vh;
  width: 100%;

  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    background-color: #1d1d1d;
  }

  .swiper.vertical {
    background-color: #1d1d1d;
  }
}
</style>
