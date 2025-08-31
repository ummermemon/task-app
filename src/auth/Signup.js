import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from "sweetalert2";
import { useEffect } from 'react'

function Signup() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([])
    const navigate = useNavigate();

    const handleSubmit = async () => {
        const data = { "first_name":firstName,"last_name":lastName,"email": email, "password": password }
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await response.json();

            if (response.ok) {
                if (result.status == true) {
                    localStorage.setItem("token", result.token);
                    Swal.fire({
                        title: "Signed Up!",
                        text: "You've signed up successfully!",
                        icon: "success"
                    }).then(() => navigate('/'));

                } else {
                    setErrors({ general: result.message });
                }

            } else {
                if (result.detail && Array.isArray(result.detail)) {
                    const fieldErrors = {};
                    result.detail.forEach(item => {
                        if (item.loc && item.loc.length > 1) {
                            const field = item.loc[1];
                            fieldErrors[field] = item.msg;
                        }
                    });
                    setErrors(fieldErrors);
                }
            }
        } catch (error) {
            setErrors({ general: 'Something went wrong' });
        }
    }

    useEffect(() => {
        document.title = "Signup | TaskApp";
    }, []);

    return (
        <>

            <div className="grid grid-cols-12 min-h-screen">
                <div className="hidden lg:flex lg:col-span-8 bg-gray-100 items-center justify-center">
                    <div className="text-center">
                        <img
                            src="/assets/login.png"
                            alt="Login"
                            className="w-3/6 mx-auto p-10"
                        />
                        <h2 className="text-2xl mt-4">Signup</h2>
                        <p className="text-gray-500 text-sm">Enter details to register!</p>
                    </div>
                </div>
                <div className="col-span-12 lg:col-span-4 flex items-center justify-center p-6">
                    <div className="w-full max-w-md  p-8">
                        <div className="mb-6">
                            <h2 className="text-3xl font-semibold text-blue-500">TaskApp</h2>
                            <p className="text-sm  mt-2 text-gray-500">Manage your todo tasks here!</p>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmit();
                            }}
                            className="space-y-4"
                        >

                            <div className="flex gap-4 mr-2">
                                <div className="flex flex-col w-1/2">
                                    <label htmlFor="firstNameInput" className="mb-1">
                                        First Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="firstNameInput"
                                        placeholder="Enter First Name"
                                        className="bg-gray-100 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                    {errors.first_name && (
                                        <span className="text-red-500 text-sm mt-1">{errors.first_name}</span>
                                    )}
                                </div>

                                <div className="flex flex-col w-1/2">
                                    <label htmlFor="lastNameInput" className="mb-1">
                                        Last Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="lastNameInput"
                                        placeholder="Enter Last Name"
                                        className="bg-gray-100 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                    {errors.last_name && (
                                        <span className="text-red-500 text-sm mt-1">{errors.last_name}</span>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="emailInput" className="mb-1 ">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="emailInput"
                                    placeholder="Enter email"
                                    className="bg-gray-100 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                {errors.email && (
                                    <span className="text-red-500 text-sm mt-1">{errors.email}</span>
                                )}
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="passwordInput" className="mb-1 ">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="password"
                                    id="passwordInput"
                                    placeholder="Enter password"
                                    className="bg-gray-100 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                {errors.password && (
                                    <span className="text-red-500 text-sm mt-1">{errors.password}</span>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white font-medium py-3 rounded-lg hover:bg-blue-600 transition"
                            >
                                Signup
                            </button>

                            {errors.general && (
                                <span className="text-red-500 text-sm mt-2 block">
                                    {errors.general}
                                </span>
                            )}
                        </form>

                        <p className="text-center text-gray-500 text-sm mt-6">
                            Already have an account?{" "}
                            <Link to={"/login"} className="text-blue-500 hover:underline">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Signup