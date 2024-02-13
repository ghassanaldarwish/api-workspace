import paginate from "./plugins/paginate.plugin";
import toJSON from "./plugins/toJSON.plugin";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export enum Role {
  member = "member",
  admin = "admin",
  owner = "owner",
}

const UserSchema = new mongoose.Schema(
  {
    avatar: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please provide email"],
      trim: true,
      immutable: true,
    },

    name: {
      type: String,
      required: [true, "Please provide name"],
      minlength: 3,
      maxlength: 50,
    },

    password: {
      type: String,
      required: [true, "Please provide password"],
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: ["admin", "user", "owner"],
      default: "user",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
UserSchema.methods.comparePassword = async function (canditatePassword: any) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};
UserSchema.plugin(toJSON);
UserSchema.plugin(paginate);

export default mongoose.model("users", UserSchema);
