const crypto = require('crypto');
const { Sequelize, DataTypes } = require('sequelize');
const db = new Sequelize(
  process.env.DATABASE_URL || 'postgres://localhost:5432/youknowforkids', {logging : false}
);

const User = db.define("User",{
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    get() {
      return () => this.getDataValue('password');
    }
  },
  salt: {
    type: DataTypes.STRING,
    get() {
      return () => this.getDataValue('salt');
    }
  }
});

/**
*  Instance Methods
*/

User.prototype.confirmPwd = function (pwdToCheck){
  return User.encryptPassword(pwdToCheck, this.salt()) === this.password();
};

/**
*  Class Methods
*/

User.generateSalt = function(){
  return crypto.randomBytes(16).toString('base64');
};

User.encryptPassword = function(plainPW, salt){
  return crypto.createHash('RSA-SHA256').update(plainPW).update(salt).digest('hex');
};

/**
 * hooks
 */

const setSaltAndPassword = user => {
  if (user.changed('password')){
    user.salt = User.generateSalt();
    user.password = User.encryptPassword(user.password(), user.salt());
  }
};

User.beforeCreate(setSaltAndPassword);
User.beforeUpdate(setSaltAndPassword);
User.beforeBulkCreate(users => {users.forEach(setSaltAndPassword);});

module.exports = {User, db};
