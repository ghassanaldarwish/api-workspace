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
    modelsKey: {
      type: String,
      required: [true, "Please provide modelsKey"],
      trim: true,
    },
    userId: {
      type: String,
      required: [true, "Please provide userId"],
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Please provide folder title"],
      trim: true,
      lowercase: true,
    },

    slug: {
      type: String,
      required: [true, "Please provide slug"],
      trim: true,
      lowercase: true,
    },

    pins: [
      {
        pinId: {
          type: String,
          required: [true, "Please provide pin id"],
          trim: true,
        },
        pin: {
          type: String,
          required: [true, "Please provide pin "],
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

Schema.plugin(toJSON);
Schema.plugin(paginate);

export default (prefix: string) => mongoose.model(prefix + ".folders", Schema);
