import { Plugins } from '@capacitor/core'

const { PushNotifications } = Plugins

if (!localStorage.getItem('fcmtoken')) {
  // Register with Apple / Google to receive push via APNS/FCM
  PushNotifications.register()

  // On succcess, we should be able to receive notifications
  PushNotifications.addListener('registration',
    token => {
      // console.log(token.value)
      localStorage.setItem('fcmtoken', token.value)
    }
  )

  // Some issue with your setup and push will not work
  PushNotifications.addListener('registrationError',
    error => {
      console.error('Error on registration: ' + JSON.stringify(error))
    }
  )
}

// Show us the notification payload if the app is open on our device
// PushNotifications.addListener('pushNotificationReceived',
//   notification => {
//     console.log(JSON.stringify(notification))
//   }
// )

// Method called when tapping on a notification
// PushNotifications.addListener('pushNotificationActionPerformed',
//   notification => {
//     console.log(JSON.stringify(notification))
//   }
// )
