import mongoose from "mongoose";

let isConnected: boolean = false;

export const connect = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) {
    return console.log("MISSING MONGODB_URL");
  }

  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "codesage",
    });

    isConnected = true;

    console.log("MongoDB is connected");
  } catch (err: any) {
    console.log("MongoDB connection failed", err);
  }
};
