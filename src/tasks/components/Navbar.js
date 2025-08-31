import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CaretDown,Power } from "phosphor-react";

function Navbar() {
    const [showMenu, setShowMenu] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetch(`${process.env.REACT_APP_API_URL}/user/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.status) {
                        setUser(data);
                    }
                });
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/add");
    };

    return (
        <nav className="bg-blue-500 flex justify-between items-center p-3 shadow-xl px-6">
            <Link to="/">
                <h2 className="text-white text-2xl font-semibold">TaskApp</h2>
            </Link>

            {user && (
                <div className="relative">
                    {/* <img
                        src={`${process.env.REACT_APP_API_URL}/${user.profile_image}`}
                        alt="profile"
                        className="w-10 h-10 rounded-full cursor-pointer border-2 border-white"
                        onClick={() => setShowMenu(!showMenu)}
                    /> */}
                    <h4 className=" text-white flex items-center gap-2 cursor-pointer" onClick={() => setShowMenu(!showMenu)} >{user.first_name} {user.last_name} <CaretDown size={16} /></h4>
                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 w-full text-left rounded-lg px-4 py-2 text-red-500 hover:bg-gray-100"
                            >
                               <Power size={16} /> Logout
                            </button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}

export default Navbar;
