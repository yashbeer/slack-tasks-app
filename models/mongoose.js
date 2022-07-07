const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  // eslint-disable-next-line no-console
  console.log("Connected to Database");

}).catch((err) => {
  // eslint-disable-next-line no-console
  console.log("Not Connected to Database. ERROR: ", err);
})
