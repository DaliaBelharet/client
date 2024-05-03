const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema(
  { 
   
    pseudo: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 55,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      validate: [isEmail],
      lowercase: true,
      unique: true,
      trim: true,
    },

    resetToken:{
      type: String,
    },
    resetTokenExpiration:{
      type: Date,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      minlength: 6
    },
    
    phoneNumber: {
      type: String,
    },
    otpCode: {
      type: String,
    },
    otpCodeExpiration:{
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
},
  
)


userSchema.pre("save", async function(next) {
  try {
    
    if (!this.isModified("password")) {
      return next();
    }

    
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.pre("save", async function(next) {
  try {
    if (!this.isModified("secretAnswer") || !this.secretAnswer) {
      return next();
    }

    const salt = await bcrypt.genSalt();
    const hashedSecretAnswer = await bcrypt.hash(this.secretAnswer, salt);
    this.secretAnswer = hashedSecretAnswer;
    next();
  } catch (error) {
    next(error);
  }
});




userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });

  
  if (user) {
    
    const hashedPasswordProvided = await bcrypt.hash(password, 10);
    

    const auth = await bcrypt.compare(password, user.password);
    
  
    if (auth) {
      return user;
    }
    throw Error('Mot de passe incorrect');
  }
  throw Error('Email incorrect');
};



const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;