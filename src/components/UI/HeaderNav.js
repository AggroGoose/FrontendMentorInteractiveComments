import { useUser } from "../../app/UserContext";
import HeaderActive from "./HeaderActive";
import HeaderInactive from "./HeaderInactive";

export default function HeaderNav() {
  const userState = useUser();
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
