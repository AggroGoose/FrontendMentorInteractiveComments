import { useSelector } from "react-redux";
import HeaderActive from "./HeaderActive";
import HeaderInactive from "./HeaderInactive";

export default function HeaderNav() {
  const userActive = useSelector((state) => state.user.loggedIn);
  const user = useSelector((state) => state.user.user);
  return (
    <div className="header">
      <div className="header__logo">
        <h1>StoicGoose Comments</h1>
      </div>
      <div className="header__user">
        {userActive ? <HeaderActive user={user} /> : <HeaderInactive />}
      </div>
    </div>
  );
}
