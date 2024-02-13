import paginate from "./plugins/paginate.plugin";
import toJSON from "./plugins/toJSON.plugin";
import mongoose from "mongoose";

const Schema = new mongoose.Schema(
  {
    title: { type: String, default: "Untitled" },
    description: { type: String, default: "No description" },
    vscode: { type: String, default: "Copy the vscode path here" },
  },
  {
    timestamps: true,
  }
);

Schema.plugin(toJSON);
Schema.plugin(paginate);

export default mongoose.model("pin", Schema);
