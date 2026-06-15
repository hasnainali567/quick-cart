import {
  Avatar as ShadcnAvatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import type { User, dropdownItem } from "@/types";
import { Logout, Profile, Store } from "@hugeicons/core-free-icons";
import Dropdown from "@/components/global/dropdown";

type Props = {
  user: User;
};

const items: dropdownItem[] = [
  {
    label: "Profile",
    icon: Profile,
    to: "/store/profile",
    key: "profile",
  },
  {
    label: "Store",
    icon: Store,
    to: "/store/dashboard",
    key: "store",
  },
  {
    label: "Logout",
    icon: Logout,
    onClick: () => {},
    key: "logout",
    variant: "destructive",
    isSeparator: true,
  },
];

const Avatar = ({ user }: Props) => {
  return (
    <Dropdown
      items={items}
      trigger={
        <ShadcnAvatar>
          <AvatarImage src={user.image ?? undefined} alt={user.name} />
          <AvatarFallback>{user.name.slice(0, 1)}</AvatarFallback>
        </ShadcnAvatar>
      }
      align="end"
      className="w-50"
    />
  );
};

export default Avatar;
