const mongoose = require('mongoose');
const config = require('config');

module.exports = async () => {
  try {
    await mongoose.connect(config.get('mongoURI'), {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.log(`Failed to connect to MongoDB. Exiting. ${error}`);
    process.exit(1);
  }
};
