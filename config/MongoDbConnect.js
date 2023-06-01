import mongoose from "mongoose";

export const MongodbConnect = async () => {
  try {
    await mongoose.connect("your_db_connection", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('MongoDB connected'))
    .catch (error => {
      console.log(`MongoDB Error : ${error.message}`);
      process.exit(1);
   })
  }catch(error){
    console.log(`Error try catch: ${error}`);
  }
};
