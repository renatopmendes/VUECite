<template>
  <div>
    <q-header>
      <q-toolbar class="bg-dark">
        <q-btn
          dense
          flat
          aria-label="Back"
          icon="arrow_back"
          @click="$router.go(-1)"
        />
        <q-space />
        <div class="text-body1">
          Notificar
        </div>
        <q-space />
        <q-btn
          dense
          flat
          aria-label="Home"
          icon="home"
          to="/"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page>
        <q-form
          class="q-pa-md absolute-center full-width text-center"
          @submit="send"
        >
          <q-input
            autofocus
            filled
            required
            minlength="3"
            maxlength="32"
            label="Título"
            v-model="notification.subject"
          />

          <br />

          <q-input
            filled
            required
            minlength="10"
            label="Mensagem"
            type="textarea"
            v-model="notification.message"
          />

          <q-btn
            round
            aria-label="OK"
            color="positive"
            icon="done"
            type="submit"
            class="q-mt-xl"
          />
        </q-form>
      </q-page>
    </q-page-container>
  </div>
</template>

<script>
export default {
  name: 'Notification',
  data: function () {
    return {
      notification: {}
    }
  },
  created () {
    const account = this.$storage.getObj('account')
    if (account.role < 9) {
      this.$router.replace('/')
    }
  },
  methods: {
    send: function () {
      this.$q.loading.show()

      if (this.$route.query.user) {
        this.$axios.post(`notification/user/${this.$route.query.user}`, this.notification)
      } else {
        this.$axios.post('notification/user', this.notification)
      }
    }
  }
}
</script>
