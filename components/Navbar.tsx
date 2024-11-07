import { Store } from "@prisma/client";
import MainNav from "./MainNav";
import StoreSwitcher from "./StoreSwitcher";
import UserButton from "./UserButton";
import { ModeToggle } from "./ModeToggle";

interface NavbarProps {
  stores: Store[];
}

const Navbar: React.FC<NavbarProps> = ({ stores }) => {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher stores={stores} />
        <MainNav className="px-6" />
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          <UserButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
