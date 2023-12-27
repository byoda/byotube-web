import Api from '@/services/Api'

export default {
  signIn(url,credentials) {
    return Api().post(url, credentials)
  },
  signUp(data) {
    return Api().post('auth/register', data)
  },
  updateUserDetails(data) {
    return Api().put('auth/updatedetails', data)
  },
  uploadUserAvatar(data) {
    return Api().put('auth/avatar', data)
  },
  updatePassword(data) {
    return Api().put('auth/updatepassword', data)
  },
  me(token) {
    return Api().post('auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
  }
}
