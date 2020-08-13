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
          {{notifications.length}} {{notifications.length === 1 ? 'Mensagem' : 'Mensagens'}}
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
      <q-list bordered>
        <q-expansion-item
          v-for="(notification, i) in notifications"
          :key="i"
          expand-separator
          :icon="notification.readed_at ? 'drafts' : 'email'"
          :label="notification.subject"
          @click="read(notification.id)"
        >
          <q-card>
            <q-card-section class="q-pb-xl">
              {{notification.message}}
              <div class="absolute-bottom-right">
                <q-btn
                  flat
                  icon="delete"
                  color="negative"
                  @click.stop="remove(notification.id)"
                />
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </q-list>

      <div v-if="!notifications.length" class="absolute-center text-body1">
        Nenhuma mensagem.
      </div>
    </q-page-container>
  </div>
</template>

<script>
export default {
  name: 'Notifications',
  data: function () {
    return {
      notifications: []
    }
  },
  created () {
    this.notifications = this.$store.state.pages.notifications
  },
  methods: {
    read: function (id) {
      const notification = this.notifications[this.notifications.findIndex(n => n.id === id)]
      if (!notification.readed_at) {
        this.$axios.put(`notification/${notification.id}/readed`)
          .then(response => {
            this.$store.commit('pages/readedNotification', response.data.notification)
          })
      }
    },
    remove: function (id) {
      const notification = this.notifications[this.notifications.findIndex(n => n.id === id)]
      this.$q.dialog({
        message: 'Excluir esta mensagem?',
        cancel: 'Cancelar',
        ok: 'Confirmar'
      }).onOk(() => {
        this.$axios.delete(`notification/${notification.id}`)
          .then(response => {
            this.$store.commit('pages/removeNotification', notification)
          })
      })
    }
  }
}
</script>
