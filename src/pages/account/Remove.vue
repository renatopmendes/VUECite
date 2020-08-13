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
          Excluir Conta
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
      <q-banner class="bg-negative text-white text-center">
        Ao excluir sua conta você perderá todos os seus posts, páginas e contatos.
      </q-banner>

      <q-page>
        <q-form
          @submit="remove"
          class="fixed-center text-center"
          style="width:90%;"
        >
          <q-input
            filled
            required
            minlength="8"
            label="Senha"
            :type="isPwd ? 'password' : 'text'"
            v-model="password"
          >
            <template v-slot:append>
              <q-icon
                :name="!isPwd ? 'visibility' : 'visibility_off'"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

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
  name: 'Remove',
  data: function () {
    return {
      password: null,
      isPwd: true
    }
  },
  methods: {
    remove: function () {
      this.$axios.post('auth/forcedelete', { password: this.password })
        .then(response => {
          this.$store.commit('pages/clearNotifications')
          localStorage.clear()
          this.$router.replace('/')
        })
    }
  }
}
</script>
