<template>
  <q-page-container>
    <q-page
      :class="['text-white', `bg-${color.colors[color.index]}-10`]"
      @click="focusOnDiv"
    >
      <q-toolbar class="z-max">
        <q-btn
          dense
          flat
          aria-label="Back"
          icon="arrow_back"
          @click.stop="$router.go(-1)"
        />
        <q-space />
        <div class="row">
          <q-btn
            dense
            flat
            aria-label="Palette"
            icon="palette"
            @click="color.index = color.colors[color.index + 1] ? color.index + 1 : 0"
          />
          <q-btn
            dense
            flat
            aria-label="Text"
            icon="text_format"
            @click="family.index = family.families[family.index + 1] ? family.index + 1 : 0"
          />
        </div>
        <q-space />
        <q-btn
          dense
          round
          color="positive"
          aria-label="Send"
          icon="send"
          @click.stop="send"
        />
      </q-toolbar>

      <div class="q-px-xs fit absolute-top-left column justify-center items-center">
        <div
          v-if="!media.youtube"
          class="content-editable full-width text-center"
        >
          <div
            contenteditable
            :class="media.textSize"
            :style="{'font-family': family.families[family.index]}"
            @paste="paste($event)"
            @input="setInput($event)"
          />
        </div>
        <q-video
          v-else
          :src="`https://www.youtube.com/embed/${media.youtube}?controls=0&fs=0&rel=0&showinfo=0`"
        />
      </div>

      <q-btn
        dense
        aria-label="Commentary"
        icon="edit"
        class="absolute-bottom q-ml-sm q-mb-sm z-max"
        style="background-color: rgba(0, 0, 0, 0.3);"
        @click.stop="showFooter"
      />

      <div
        v-show="showcommentary"
        class="fixed-bottom q-py-xs q-pl-xl q-pr-sm footer-commentary"
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
          @click.stop="() => true"
        >
          <template v-slot:append>
            <q-icon
              v-if="media.commentary"
              name="clear"
              @click.stop="media.commentary=null; $el.querySelector('.footer-commentary textarea').focus()"
              class="cursor-pointer"
            />
          </template>
        </q-input>
      </div>
    </q-page>
  </q-page-container>
</template>

<script>
import FCM from 'assets/js/FCM.js'

export default {
  name: 'TextMessage',
  data: () => ({
    media: {
      color: null,
      family: null,
      message: null,
      textSize: 'text-h3',
      commentary: null
    },
    color: {
      index: 0,
      colors: ['grey', 'red', 'blue-grey', 'pink', 'green', 'brown', 'purple', 'deep-orange', 'light-green', 'deep-purple', 'orange', 'teal', 'indigo', 'cyan', 'amber', 'blue', 'yellow', 'light-blue', 'lime']
    },
    family: {
      index: 0,
      families: ['Roboto', 'Lobster', 'Pacifico', 'Great Vibes', 'Architects Daughter']
    },
    showcommentary: false
  }),
  mounted () {
    this.focusOnDiv()
  },
  methods: {
    focusOnDiv: function () {
      if (this.$el.querySelector('[contenteditable]')) {
        this.$el.querySelector('[contenteditable]').focus()
        // select all the content in the element
        document.execCommand('selectAll', false, null)
        // collapse selection to the end
        document.getSelection().collapseToEnd()
      }
    },
    paste: function (e) {
      e.preventDefault()
      var text = (e.originalEvent || e).clipboardData.getData('text/plain')
      document.execCommand('insertHTML', false, text)
    },
    setInput: function (e) {
      if (e.target.innerText.length <= 512) {
        this.media.message = e.target.innerText

        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/im
        const match = this.media.message.match(regExp)
        if (match && match[2].length === 11) {
          this.$set(this.media, 'youtube', match[2])
          this.media.message = null
          this.media.textSize = null
        } else {
          const length = this.media.message.length
          let textSize = 'text-subtitle1'

          if (length <= 60) {
            textSize = 'text-h3'
          } else if (length > 60 && length <= 120) {
            textSize = 'text-h4'
          } else if (length > 120 && length <= 180) {
            textSize = 'text-h5'
          } else if (length > 180 && length <= 240) {
            textSize = 'text-h6'
          }

          this.$set(this.media, 'textSize', textSize)
        }
      } else {
        this.$el.querySelector('[contenteditable]').innerText = this.media.message
        this.$q.notify({
          type: 'negative',
          position: 'top',
          message: 'Limite de 255 caracteres'
        })
      }
    },
    showFooter: function () {
      this.showcommentary = !this.showcommentary
      if (this.showcommentary) {
        setTimeout(() => {
          this.$el.querySelector('.footer-commentary textarea').focus()
        }, 50)
      }
    },
    send: function () {
      if (this.media.youtube) {
        this.$q.loading.show()

        if (this.media.commentary && this.media.commentary.replace(/\s/g, '').length > 0) {
          this.$set(this.media, 'commentary', this.media.commentary.replace(/\s{2,}/g, ' ').trim())
        } else {
          this.media.commentary = null
        }

        this.$axios.post('post/page/' + this.$route.params.pageId, {
          youtube: this.media.youtube,
          commentary: this.media.commentary
        })
          .then(response => {
            // Notificar
            FCM.notify(this.$route.params.pageTopic, {
              title: this.$route.params.pageName,
              body: this.media.commentary || 'Youtube vídeo',
              image: `https://img.youtube.com/vi/${this.media.youtube}/mqdefault.jpg`,
              sound: 'default'
            })

            this.$router.replace({ path: 'page', query: { id: this.$route.params.pageId } })
          })
      } else if (this.media.message && this.media.message.replace(/\s/g, '').length > 0) {
        this.$q.loading.show()

        this.media.color = this.color.colors[this.color.index]
        this.media.family = this.family.families[this.family.index]

        this.$set(this.media, 'message', this.media.message.trim())

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
              body: this.media.message,
              sound: 'default'
            })

            this.$router.replace({ path: 'page', query: { id: this.$route.params.pageId } })
          })
      } else {
        this.$q.notify({
          type: 'negative',
          position: 'top',
          message: 'Texto é obrigatório.'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.content-editable {
  outline: none;
  max-height: 80vh;
  overflow-y: auto;
  padding: 15px 0;
  text-shadow: 2px 2px rgba(0, 0, 0, 0.3);

  [contenteditable="true"]:empty::before {
    color: rgba(255, 255, 255, 0.3);
    content: "Texto ou link do YouTube";
  }

  [contenteditable="true"]:active,
  [contenteditable="true"]:focus {
    border: none;
    outline: none;
  }
}
</style>
