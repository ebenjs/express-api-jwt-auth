const mongoose = require('mongoose');

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((err) => {
    console.log(err.stack);
  });

exports.mongoose = mongoose;
