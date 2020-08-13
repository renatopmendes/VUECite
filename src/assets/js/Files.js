import { Plugins, FilesystemDirectory } from '@capacitor/core'
const { Filesystem } = Plugins

const Files = function () {
  this.getSrc = (folder = 'Cache') => {
    return Filesystem.getUri({
      directory: FilesystemDirectory[folder],
      path: '/'
    }).then(result => {
      return Capacitor.convertFileSrc(result.uri)
    }, (err) => {
      alert(err)
    })
  }

  this.deleteFile = function (path, folder = 'Cache') {
    return Filesystem.deleteFile({
      directory: FilesystemDirectory[folder],
      path: path
    })
  }

  this.stat = function (path, folder = 'Cache') {
    return Filesystem.stat({
      directory: FilesystemDirectory[folder],
      path: path
    })
  }
}

export default new Files()
