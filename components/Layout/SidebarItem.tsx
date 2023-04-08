import { useRouter } from 'next/router';
import { IconType } from 'react-icons/lib/esm/iconBase';
import React, { useCallback } from 'react';
import useCurrentUser from '@/hooks/useCurrentUser';
import useLoginModel from '@/hooks/useLoginModel';
import { BsDot } from 'react-icons/bs';
interface SidebarItemProps {
  label: string;
  href?: string;
  icon: IconType;
  onClick?: () => void;
  auth?: boolean;
  alert?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  href,
  icon: Icon,
  onClick,
  auth,
  alert,
}) => {
  const LoginModel = useLoginModel();
  const { data: currentUser } = useCurrentUser();
  const router = useRouter();

  const handleClick = useCallback(() => {
    if (onClick) {
      return onClick();
    }

    if (auth && !currentUser) {
      LoginModel.onOpen();
    } else if (href) {
      router.push(href);
    }
  }, [router, onClick, href, LoginModel, currentUser, auth]);
  return (
    <div onClick={handleClick} className="flex flex-row items-center">
      <div
        className="
    relative
    rounded-full
    h-14
    w-14
    flex
    items-center
    justify-center
    p-4
    hover:bg-slate-300
    hover:bg-opacity-10
    cursor-pointer
    lg:hidden
    "
      >
        <Icon size={28} color="white" />
        {alert ? (
          <BsDot className="text-sky-500 absolute -top-4 left-0" size={70} />
        ) : null}
      </div>
      <div
        className="
      relative
      hidden
      lg:flex
      gap-4
      p-4
      rounded-full
      hover:bg-slate-300
      hover:bg-opacity-10
      cursor-pointer
      items-center

      "
      >
        <Icon size={24} color="white" />
        <p className="hidden lg:block hover:text-white hover:opacity-100 text-sky-300 text-xl">
          {label}
        </p>
        {alert ? (
          <BsDot className="text-sky-500 absolute -top-4 left-0" size={70} />
        ) : null}
      </div>
    </div>
  );
};

export default SidebarItem;
