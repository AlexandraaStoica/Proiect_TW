import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser } from "../store/slices/authSlice";

function NavBar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          Task Manager
        </Link>
      </div>
      <div className="flex-none">
    

        
          <>
            <button onClick={handleLogout} className="btn btn-ghost">
              Logout
            </button>
          </>
       
      </div>
    </div>
  );
}

export default NavBar;
