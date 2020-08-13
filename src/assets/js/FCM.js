import Vue from 'vue'

const vue = new Vue()

const FCM = function () {
  this.notify = (topic, notification) => {
    vue.$axios.post('https://fcm.googleapis.com/fcm/send', {
      to: `/topics/${topic}`,
      priority: 'high',
      notification: notification,
      android: {
        notification: {
          sound: 'default'
        }
      },
      apns: {
        payload: {
          aps: {
            sound: 'default'
          }
        }
      }
    }, {
      baseURL: '',
      headers: {
        Authorization: 'key=AAAA6fwQiwU:APA91bGss4hbdPDUPyY7GinyVw1EwOEPjD2_1QJ0QGyfQwcpPsIjUNhwxr03lpCNigLDMngeot553QJat2BT138eR4r7LFh7W6gxHKQe1HTp7sEYjnyiC5Vr-jYXzYy5LlEPNLQWL0ng'
      }
    })
  }
}

export default new FCM()
