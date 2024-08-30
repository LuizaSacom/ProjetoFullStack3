const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true, 
    minlength: 3,  
    match: /^[a-zA-Z0-9_]+$/ 
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6 
  }
});


userSchema.pre('save', async function(next) {
  if (!this.isModified('password') && !this.isNew) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


userSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};


module.exports = mongoose.model('User', userSchema);
