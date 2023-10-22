import User from "@/database/user.model";
import { connect } from "../db";

export async function getUserById(params: any) {
  try {
    connect();

    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
