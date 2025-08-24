import React from 'react'
import Navbar from './components/Navbar'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
function Add() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async () => {
        const data = {"title": title, "description":description}
        try {
            const response = await fetch('http://127.0.0.1:8000/tasks/add', {
                method: 'POST',
                headers: { 'Content-Type':'application/json' },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                navigate('/');
            }
        } catch (error) {
            console.log('Error:',error);
        }
    }
    
    return (
        <>
            <Navbar />
            <div className="grid grid-cols-12 m-5">
                <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <Link to={'/'} className="bg-gray-500 text-white px-3 py-2 mt-2 rounded-lg"> Back</Link>
                    <div className="my-4">
                        <h2 className="text-2xl">Add Task</h2>
                        <span className="text-sm text-gray-500">Add details of new task!</span>
                    </div>
                    <div className="card rounded-xl  p-5 border shadow-2xl">
                        <form action={handleSubmit} method="post">
                            <div className="flex flex-col mt-3">
                                <label htmlFor="titleInput">Title <span className='text-red-500'>*</span></label>
                                <input type="text" id='titleInput' placeholder='Enter Title' className="bg-gray-200  rounded-lg p-4" required value={title} onChange={e => setTitle(e.target.value)} />
                            </div>
                            <div className="flex flex-col mt-3">
                                <label htmlFor="descriptionInput">Description <span className='text-red-500'>*</span></label>
                                <textarea type="text" id='descriptionInput' placeholder='Enter Description' className="bg-gray-200 rounded-lg p-4" required value={description} onChange={e => setDescription(e.target.value)}></textarea>
                            </div>
                            <button type='submit' className="bg-blue-500 px-3 py-2 text-white mt-3 rounded-lg">Add Task</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Add