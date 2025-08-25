import React from 'react'
import { PencilSimple, Power, Trash } from "phosphor-react";
import { useState } from 'react';
function Navbar() {
      const [showCard, setShowCard] = useState(false);
    
    return (
        <nav className="bg-blue-500 flex justify-center items-center p-3 shadow-xl">
            <div className="logo"><h2 className="text-white text-center text-2xl font-semibold">TaskApp</h2></div>
        </nav>
    )
}

export default Navbar