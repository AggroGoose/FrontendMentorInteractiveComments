import Image from "next/image";
import { useState } from "react";
import HeaderUserMenu from "./HeaderUserMenu";

export default function HeaderActive({ user }) {
  const [menuActive, setMenuActive] = useState(false);
  const iStyle = {
    borderRadius: "100%",
  };

  function showMenu() {
    setMenuActive(true);
  }

  function hideMenu() {
    setMenuActive(false);
  }

  return (
    <div className="header__user">
      <p>{user.display}</p>
      <div
        className="header__user--img"
        onMouseEnter={showMenu}
        onMouseLeave={hideMenu}
      >
        <Image src={user.picture} height={35} width={35} style={iStyle} />
      </div>
      <HeaderUserMenu />
    </div>
  );
}
