import { getCurrentUser } from "@/actions/getCurrentUser";

const UserButton = async () => {
  const user = await getCurrentUser();
  return <div>{user?.name}</div>;
};

export default UserButton;
