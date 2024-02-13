import mongoose from "mongoose";
import environmentVariables from "../environment";
const dbName: any = environmentVariables.dbName;
const dbUri: string = environmentVariables.dbUri;

const connectDB = () => {
  mongoose
    .connect(dbUri, { dbName })
    .then(() => {
      console.log("Mongodb connected....", dbUri);
    })
    .catch((err) => console.log(err.message));

  mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to db...", dbUri);
  });

  mongoose.connection.on("error", (err) => {
    console.log(err.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Mongoose connection is disconnected...", dbUri);
  });
};
export default connectDB;
