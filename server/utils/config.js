require("dotenv").config();
const PORT = process.env.PORT;
const MonogDB_URI = process.env.MONGODB_URI;
const SECRET = process.env.SECRET;
const FACEBOOK = {
  clientId: process.env.FACEBOOKID,
  clientSecret: process.env.FACEBOOKSECRET
};
const GOOGLE = {
  clientId: process.env.GOOGLEID,
  clientSecret: process.env.GOOGLESECRET
};

module.exports = {
  PORT,
  MonogDB_URI,
  SECRET,
  FACEBOOK,
  GOOGLE
};
