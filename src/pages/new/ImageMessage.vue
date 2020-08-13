<template>
  <q-page-container>
    <q-page class="bg-dark text-white">
      <q-toolbar class="z-max">
        <q-btn
          dense
          flat
          aria-label="Back"
          icon="arrow_back"
          @click="$router.go(-1)"
        />
        <q-space />
        <div v-if="!cropped" class="absolute-center text-body1">
          Cortar imagem
        </div>
        <q-btn
          v-else
          color="accent"
          :label="filter.filters[filter.index]"
          class="q-mb-xs"
          @click="filter.index = filter.filters[filter.index + 1] ? filter.index + 1 : 0"
        />
        <q-space />
        <q-btn
          v-if="!cropped"
          dense
          round
          color="positive"
          aria-label="Crop"
          icon="crop"
          style="margin-left: 43%; margin-top: 10px;"
          @click="cropImage"
        />
        <q-btn
          v-else
          dense
          round
          color="positive"
          aria-label="Send"
          icon="send"
          @click="send"
        />
      </q-toolbar>

      <div class="fit absolute-top column justify-center items-center overflow-hidden">
        <vue-cropper
          v-if="!cropped"
          ref="cropper"
          drag-mode="none"
          :src="file"
          :auto-crop-area="1"
          :background="false"
          :min-crop-box-height="img.cropHeight"
          :min-crop-box-width="img.cropWidth"
          :view-mode="2"
        />
        <div v-else>
          <div
            class="overflow-hidden relative-position"
            :style="{width: img.width + 'px', height: img.height + 'px'}"
          >
            <div class="content-editable absolute-center z-top full-width">
              <div
                v-if="showEditable"
                contenteditable
                :class="[`text-${text.colors[text.iColor]}`, `bg-${text.colors[text.iBG]}` ,`text-${text.styles[text.iStyle]}`, `text-${text.aligns[text.iAlign]}`]"
                :style="{'font-family': text.families[text.iFamily], 'font-size': text.size + 'px'}"
                @paste="paste($event)"
                @keydown="setInput"
                @touchmove="move"
              />
            </div>
            <img
              :src="cropped"
              :class="['cropped-image fixed', filter.filters[filter.index]]"
              @load="setSizes"
            >
          </div>
        </div>
      </div>

      <q-page-sticky
        v-if="cropped"
        position="bottom-left"
        :offset="[5, 45]"
      >
        <q-fab
          v-model="showFab"
          color="secondary"
          icon="title"
          direction="right"
          ref="fab"
          padding="sm"
          @show="addEditable"
          @hide="preventFabHide"
        >
          <q-fab-action
            color="primary"
            icon="text_format"
            style="margin-left: -6px;"
            @click="text.iFamily = text.families[text.iFamily + 1] ? text.iFamily + 1 : 0"
          />
          <q-fab-action
            color="primary"
            icon="format_size"
            @click="text.size = text.size > 60 ? 16 : text.size + 4"
          />
          <q-fab-action
            color="primary"
            icon="invert_colors"
            @click="text.iColor = text.colors[text.iColor + 1] ? text.iColor + 1 : 0"
          />
          <q-fab-action
            color="primary"
            icon="check_box_outline_blank"
            @click="text.iBG = text.colors[text.iBG + 1] ? text.iBG + 1 : 0"
          />
          <q-fab-action
            color="primary"
            :icon="filterText.styles[text.iStyle]"
            @click="text.iStyle = text.styles[text.iStyle + 1] ? text.iStyle + 1 : 0"
          />
          <q-fab-action
            color="primary"
            :icon="filterText.aligns[text.iAlign]"
            @click="text.iAlign = text.aligns[text.iAlign + 1] ? text.iAlign + 1 : 0"
          />
        </q-fab>
      </q-page-sticky>

      <q-btn
        dense
        aria-label="Commentary"
        icon="edit"
        class="absolute-bottom q-ml-sm q-mb-sm z-max"
        style="background-color: rgba(0, 0, 0, 0.3);"
        @click="showFooter"
      />

      <div
        v-show="showcommentary"
        class="footer-commentary fixed-bottom q-py-xs q-pl-xl q-pr-sm z-top"
      >
        <q-input
          dark
          dense
          rounded
          standout
          autogrow
          placeholder="Adicione uma mensagem..."
          maxlength="255"
          v-model="media.commentary"
          @click="() => true"
        >
          <template v-slot:append>
            <q-icon
              v-if="media.commentary"
              name="clear"
              @click="media.commentary=null; $el.querySelector('.footer-commentary textarea').focus()"
              class="cursor-pointer"
            />
          </template>
        </q-input>
      </div>
    </q-page>
  </q-page-container>
</template>

<script>
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'
import canvasTxt from 'canvas-txt'
import { dom } from 'quasar'

import FCM from 'assets/js/FCM.js'

export default {
  name: 'ImageMessage',
  components: {
    VueCropper
  },
  data: () => ({
    file: null,
    media: {},
    result: null,
    cropped: null,
    img: {
      cropWidth: 0,
      cropHeight: 0,
      width: 0,
      height: 0
    },
    showcommentary: false,
    showFab: false,
    showEditable: false,
    filter: {
      index: 0,
      filters: ['filtro', 'rock', 'eureka', 'london', 'flipflop', 'copper', 'lofi', 'night', 'rock', 'karl', 'gold', 'silver', 'butterfly', 'introvert'
      ]
    },
    filterText: {
      styles: ['title', 'format_bold', 'format_italic'],
      aligns: ['format_align_left', 'format_align_center', 'format_align_right']
    },
    text: {
      size: 16,
      iFamily: 0,
      iColor: 0,
      iBG: 20,
      iStyle: 0,
      iAlign: 0,
      families: ['Roboto', 'Lobster', 'Pacifico', 'Great Vibes', 'Architects Daughter'],
      colors: ['white', 'grey-10', 'red-10', 'blue-grey-10', 'pink-10', 'green-10', 'brown-10', 'purple-10', 'deep-orange-10', 'light-green-10', 'deep-purple-10', 'orange-10', 'teal-10', 'indigo-10', 'cyan-10', 'amber-10', 'blue-10', 'yellow-10', 'light-blue-10', 'lime-10', 'none'],
      styles: ['normal', 'bold', 'italic'],
      aligns: ['left', 'center', 'right']
    }
  }),
  created () {
    const url = URL.createObjectURL(this.$route.params.file)
    this.file = url
    setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 5000)

    this.img.cropWidth = dom.width(document.body) / 2
    this.img.cropHeight = dom.width(document.body) / 3
  },
  methods: {
    showFooter: function () {
      this.showcommentary = !this.showcommentary
      if (this.showcommentary) {
        setTimeout(() => {
          this.$el.querySelector('.footer-commentary textarea').focus()
        }, 50)
      }
    },
    cropImage: function () {
      const result = this.$refs.cropper.getCroppedCanvas({
        maxWidth: 720,
        maxHeight: 1024,
        imageSmoothingQuality: 'high'
      })

      if (result.width < this.img.cropWidth || result.height < this.img.cropHeight) {
        this.$q.notify({
          type: 'negative',
          position: 'top',
          message: 'Imagem muito pequena, escolha uma imagem maior.'
        })

        this.$router.go(-1)
      } else {
        this.result = result
        this.cropped = result.toDataURL('image/png')
      }
    },
    setSizes: function (e) {
      this.img.width = e.target.offsetWidth
      this.img.height = e.target.offsetHeight
    },
    focusOnDiv: function () {
      this.$el.querySelector('[contenteditable]').focus()
      // select all the content in the element
      document.execCommand('selectAll', false, null)
      // collapse selection to the end
      document.getSelection().collapseToEnd()
    },
    addEditable: function (e) {
      this.showEditable = true
      this.$nextTick(() => {
        const image = this.$el.querySelector('.cropped-image')
        const editable = this.$el.querySelector('[contenteditable]')
        editable.style.maxWidth = dom.width(image) - 10 + 'px'
        editable.style.maxHeight = dom.height(image) - 10 + 'px'
      })
    },
    preventFabHide: function (e) {
      if (e) {
        this.showFab = false
        this.showEditable = false
      } else {
        this.$refs.fab.show()
      }
    },
    paste: function (e) {
      e.preventDefault()
      var text = (e.originalEvent || e).clipboardData.getData('text/plain')
      document.execCommand('insertHTML', false, text)
    },
    setInput: function (e) {
      if (e.keyCode === 13) {
        e.preventDefault()
        document.execCommand('insertHTML', false, '<br><br>')
      }
    },
    move: function (e) {
      // grab the location of touch
      const touchLocation = e.targetTouches[0]
      // assign box new coordinates based on the touch.
      e.target.parentNode.style.left = touchLocation.pageX - dom.width(e.target) + this.img.width / 2 + 'px'
      e.target.parentNode.style.top = touchLocation.pageY - dom.offset(e.path[2]).top + 'px'
    },
    send: function () {
      this.$q.loading.show()

      const canvas = this.result
      const ctx = canvas.getContext('2d')
      const cropped = this.$el.querySelector('.cropped-image')
      ctx.filter = dom.style(cropped, 'filter')
      ctx.drawImage(cropped, 0, 0, canvas.width, canvas.height)
      ctx.filter = 'none'

      if (this.showEditable) {
        const proportion = (canvas.width / cropped.width).toFixed(0)
        const text = this.$el.querySelector('[contenteditable]')

        // square
        ctx.fillStyle = dom.style(text, 'background-color')
        ctx.fillRect((dom.offset(text).left - dom.offset(cropped).left) * proportion, (dom.offset(text).top - dom.offset(cropped).top) * proportion, dom.width(text) * proportion, dom.height(text) * proportion)

        // font
        ctx.fillStyle = dom.style(text, 'color')
        ctx.shadowOffsetX = 1
        ctx.shadowOffsetY = 1
        ctx.shadowBlur = 1
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'

        canvasTxt.font = this.text.families[this.text.iFamily]
        canvasTxt.fontSize = this.text.size * proportion
        canvasTxt.lineHeight = this.text.size * proportion
        canvasTxt.align = this.text.aligns[this.text.iAlign]
        if (this.text.iStyle === 1) {
          canvasTxt.fontWeight = 'bold'
          canvasTxt.fontStyle = ''
        } else if (this.text.iStyle === 2) {
          canvasTxt.fontStyle = 'italic'
          canvasTxt.fontWeight = ''
        } else {
          canvasTxt.fontWeight = ''
          canvasTxt.fontStyle = ''
        }

        const mgLeft = this.text.iAlign - 2
        canvasTxt.drawText(ctx, text.innerText, (dom.offset(text).left - dom.offset(cropped).left - mgLeft) * proportion, (dom.offset(text).top - dom.offset(cropped).top + 2) * proportion, dom.width(text) * proportion, dom.height(text) * proportion)

        this.media.message = text.innerText
      }

      this.media.image = canvas.toDataURL('image/png')

      if (this.media.commentary && this.media.commentary.replace(/\s/g, '').length > 0) {
        this.$set(this.media, 'commentary', this.media.commentary.replace(/\s{2,}/g, ' ').trim())
      } else {
        this.media.commentary = null
      }

      this.$axios.post('post/page/' + this.$route.params.pageId, this.media)
        .then(response => {
          // Notificar
          FCM.notify(this.$route.params.pageTopic, {
            title: this.$route.params.pageName,
            body: this.media.commentary || this.media.message || 'Nova imagem',
            image: process.env.PATH + this.$route.params.pageId + '/' + response.data.post.id + '/' + response.data.post.image,
            sound: 'default'
          })

          this.$router.replace({ path: 'page', query: { id: this.$route.params.pageId } })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../css/filters.scss";

.cropped-image {
  max-height: 90vh;
  max-width: 100%;
}

.content-editable {
  font-size: 0;
  line-height: 1;
  outline: none;

  [contenteditable="true"] {
    display: inline-block;
    padding: 2px;
    text-shadow: 1px 1px rgba(0, 0, 0, 0.3);

    &:empty::before {
      color: rgba(255, 255, 255, 0.7);
      content: "Digite aqui e arraste";
    }

    &:active,
    &:focus {
      border: none;
      outline: none;
    }
  }
}
</style>
