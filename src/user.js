class user {
  constructor(user) {
    this.id = user.id
    this.displayName = user.nickname ? user.nickname : user.user.globalName
  }
}

module.exports = user