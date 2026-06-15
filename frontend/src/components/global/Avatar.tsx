import React from "react";
import {
  AvatarFallback,
  AvatarImage,
  Avatar as BaseAvatar,
} from "../ui/avatar";

type Props = {
  src?: string;
  fallback: string | React.ReactNode;
  onClick?: () => void;
};

const Avatar = ({ fallback, src, onClick }: Props) => {
  return (
    <BaseAvatar onClick={onClick}>
      <AvatarImage src={src} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </BaseAvatar>
  );
};

export default Avatar;
