import React from 'react'
import { PencilSimple, Power, Trash } from "phosphor-react";
import { useState } from 'react';
function Navbar() {
      const [showCard, setShowCard] = useState(false);
    
    return (
        <nav className="bg-blue-500 flex justify-between items-center p-3 shadow-xl">
            <div className="logo"><h2 className="text-white text-2xl font-semibold">TaskList</h2></div>
            <div className="profile cursor-pointer">
                <img src="/assets/alex.jpg" className="rounded-full hover:border" onClick={() => setShowCard((prev) => !prev)} alt='image' width={50} />
                {showCard && (

                    <div className="absolute right-3 mt-1 border card bg-white p-2 rounded-xl">
                        <ul>
                            <li className="hover:bg-gray-100 hover:rounded-xl p-2 transition flex space-x-2 items-center"><PencilSimple size={20} weight="light" /><a href="#">Edit Profile</a></li>
                            <li className="hover:bg-gray-100 hover:rounded-xl p-2 transition flex space-x-2 items-center"><Power size={20} weight="light" /><a href="#">Signout</a></li>
                        </ul>
                    </div>
                )}
            </div>
        </nav>
    )
}

export default Navbar