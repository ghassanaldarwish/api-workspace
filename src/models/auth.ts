import paginate from "./plugins/paginate.plugin";
import toJSON from "./plugins/toJSON.plugin";
import mongoose from "mongoose";

export enum Role {
  member = "member",
  admin = "admin",
  owner = "owner",
}

const Schema = new mongoose.Schema(
  {
    refreshToken: { type: String, required: true },
    isValid: { type: Boolean, default: true },
    userId: { type: String, required: true },
    email: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

Schema.plugin(toJSON);
Schema.plugin(paginate);

export default mongoose.model("auth", Schema);
