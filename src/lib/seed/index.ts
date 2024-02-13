import User from "../../models/user";
import environment from "../environment";
import fs from "fs";
import bcrypt from "bcryptjs";

async function seed() {
  const ownerEmail = environment.ownerEmail;
  const ownerPassword = environment.ownerPassword;
  const ownerName = environment.ownerName;
  // const user = await User.findOne({ email: environment.seedUserEmail });
  console.log("seed middleware", ownerEmail, ownerPassword, ownerName);
  if (!ownerEmail || !ownerPassword || !ownerName) {
    console.log("The init credentials are not provided");
    return;
  }
  const user = await User.findOne({ email: ownerEmail });

  if (user) {
    console.log("The init credentials are not provided");
    return;
  }
  const salt = await bcrypt.genSalt(10);
  // @ts-ignore
  const password = await bcrypt.hash(ownerPassword, salt);

  const newUser = new User({
    email: ownerEmail,
    password,
    name: ownerName,
    role: "owner",
    isVerified: true,
  });
  await newUser.save();
  const ci = `files/ci/docker-compose.yaml`;
  fs.readFile(ci, "utf8", async function (err, data) {
    if (err) {
      return console.log(err);
    }
    const content = data
      .replace(`- OWNER_EMAIL=${ownerEmail}`, "")
      .replace(`- OWNER_PASSWORD=${ownerPassword}`, "")
      .replace(`- OWNER_NAME=${ownerName}`, "");

    fs.writeFile(ci, content, "utf8", function (err) {
      if (err) return console.log(err);
    });
  });
  console.log("The init credentials are provided");
}

export default seed;
