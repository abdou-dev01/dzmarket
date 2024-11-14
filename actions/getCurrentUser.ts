import { auth } from "@/auth";
import { getUserById } from "@/helpers/user";

export async function getCurrentUser() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) throw new Error("Need to login first");

    const currentUser = await getUserById(userId);

    return currentUser;
  } catch (error) {
    console.log("GET_CURRENT_USER_SERVER", error);
  }
}
