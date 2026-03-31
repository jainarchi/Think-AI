import mongoose from "mongoose";
import bcrypt from "bcryptjs"


const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      unique: [true, "username must be unique"],
      trim: true,
      minlength: 3,
      maxlength: 50,

    },
    email: {
      type: String,
      requied: [true ,  "email is required"],
      unique: [true, "email must be unique"],
      trim: true,
      lowercase : true
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: 6,
      select : false
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timeseries: true,
  },
);



userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
}



const userModel = mongoose.model("user", userSchema);
export default userModel;
