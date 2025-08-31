import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const [showMenu, setShowMenu] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const menuRef = useRef();


    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        // fetch user profile when Navbar loads
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
                    <img
                        src={`${process.env.REACT_APP_API_URL}/${user.profile_image}`}
                        alt="profile"
                        className="w-10 h-10 rounded-full cursor-pointer border-2 border-white"
                        onClick={() => setShowMenu(!showMenu)}
                    />
                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                            <Link
                                to="/profile"
                                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                            >
                                Edit Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}

export default Navbar;
