import { useContext } from "react";
import { UserContext } from "../../app/userContext";
import HeaderActive from "./HeaderActive";
import HeaderInactive from "./HeaderInactive";

export default function HeaderNav() {
  const userState = useContext(UserContext);
  return (
    <div className="header">
      <div className="header__logo">
        <h1>StoicGoose Comments</h1>
      </div>
      <div className="header__user">
        {userState.loggedIn ? (
          <HeaderActive user={userState} />
        ) : (
          <HeaderInactive />
        )}
      </div>
    </div>
  );
}
