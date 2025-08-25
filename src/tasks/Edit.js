import React from 'react'
import Navbar from './components/Navbar'
import { useParams } from 'react-router-dom'
import { useEffect,useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function Edit() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState([]);
  const [task, setTask] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async () => {
          const data = { "title": title, "description": description }
          try {
              const response = await fetch(`http://127.0.0.1:8000/tasks/update/${id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(data)
              });
              if (response.ok) {
                  Swal.fire({
                      title: "Task Updated!",
                      text: "The task has been updated!",
                      icon: "success"
                  }).then(() => navigate('/'));
              } else {
                  const result = await response.json();
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
    try {
      const response = fetch(`http://127.0.0.1:8000/tasks/show/${id}`,{
      method: 'GET'
    }).then(response => response.json()).then(result => {
        setTitle(result.title || '');
        setDescription(result.description || '');
      });
    } catch (error) {
      
    }
    
  }, [id]);
  useEffect(() => {
          document.title = "Edit Task | TaskApp";
      }, []);
  return (
    <>
        <Navbar />
        <div className="grid grid-cols-12 m-5">
                <div className="col-span-12 md:col-span-6 lg:col-span-6">
                    <Link to={'/'} className="bg-gray-500 text-white px-3 py-2 mt-2 rounded-lg"> Back</Link>
                    <div className="my-4">
                        <h2 className="text-2xl">Edit Task</h2>
                        <span className="text-sm text-gray-500">Update task details!</span>
                    </div>
                    <div className="card rounded-xl  p-5 border shadow-2xl">
                        <form action={handleSubmit} method="post">
                            <div className="flex flex-col">


                                <div className="flex flex-col mt-3">
                                    <label htmlFor="titleInput">Title <span className='text-red-500'>*</span></label>
                                    <input type="text" id='titleInput' placeholder='Enter Title' className="bg-gray-200  rounded-lg p-4" required value={title} onChange={e => setTitle(e.target.value)} />
                                    {errors.title && (
                                        <span className="text-red-500 text-sm mt-1">{errors.title}</span>
                                    )}
                                </div>
                                <div className="flex flex-col mt-3">
                                    <label htmlFor="descriptionInput">Description <span className='text-red-500'>*</span></label>
                                    <textarea type="text" id='descriptionInput' placeholder='Enter Description' className="bg-gray-200 rounded-lg p-4" required value={description} onChange={e => setDescription(e.target.value)}></textarea>
                                    {errors.description && (
                                        <span className="text-red-500 text-sm mt-1">{errors.description}</span>
                                    )}
                                </div>
                                <div>

                                    <button type='submit' className="bg-blue-500 px-3 py-2 text-white mt-3 rounded-lg">Update Task</button>
                                </div>
                                {errors.general && (
                                    <span className="text-red-500 text-sm mt-1">{errors.general}</span>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
    </>
  )
}

export default Edit