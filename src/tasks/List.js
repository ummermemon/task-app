import { PencilSimple, Power, Trash, Check } from "phosphor-react";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function List() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetch('http://127.0.0.1:8000/tasks/')
      .then((response) => response.json())
      .then((result) => setTasks(result))
      .catch((error) => console.error(error))
  }, []);

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          const response = fetch(`http://127.0.0.1:8000/tasks/delete/${id}`, {
            method: 'DELETE',
          }).then(() => {
            Swal.fire("Deleted!", "Your task has been deleted.", "success")
            setTasks(tasks.filter(task => task._id !== id));
          });

        } catch (error) {
          Swal.fire("Error!", "Something went wrong.", "warning");
        }

      }
    });
  };

  const handleStatusUpdate = async (id) => {
    const data = { "completed": true }
    try {
      const response = await fetch(`http://127.0.0.1:8000/tasks/update/status/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        Swal.fire({
          title: "Task Status Updated!",
          text: "The task status has been updated!",
          icon: "success"
        });
        setTasks(tasks.map(task =>
          task._id === id ? { ...task, completed: true } : task
        ));
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    document.title = "Task List | TaskApp";
  }, []);

  return (
    <>
      <Navbar />
      <div className="grid grid-cols-12 m-5">
        <div className="col-span-12 md:hidden lg:block lg:col-span-6">
          <img src="/assets/list.png" width={600} />
        </div>
        <div className="col-span-12 md:col-span-12 lg:col-span-6">
          <div className="my-4">
            <h2 className="text-2xl">Task List</h2>
            <span className="text-sm text-gray-500">All tasks listed here!</span>
          </div>
          <div className="card rounded-xl  p-5 border shadow-2xl">
            <div className="mt-2 mb-5">
              <Link to={'/add'} className="bg-blue-500 text-white p-2 rounded-lg my-5 text-sm">+ Add Task</Link>
            </div>
            <table className="w-full border">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left border-r">Title</th>
                  <th className="px-4 py-2 text-left border-r">Description</th>
                  <th className="px-4 py-2 text-left border-r">Status</th>
                  <th className="px-4 py-2 text-left border-r">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {tasks.map((task, idx) => (
                  <tr className="">

                    <td className="px-4 py-2 border-r">{task.title}</td>
                    <td className="px-4 py-2 text-gray-500 border-r">{task.description}</td>
                    <td className={`px-2 ${task.completed == true ? 'text-blue-500' : 'text-red-500'} text-sm rounded-lg border-r`}>{task.completed == true ? "Completed" : "Incomplete"}</td>
                    <td className="px-4 py-2 flex space-x-5">
                      <Link to={`/edit/${task._id}`} >
                        <PencilSimple weight="light" size={20} />
                      </Link>
                      <button onClick={() => handleDelete(task._id)}>

                        <Trash size={20} weight="light" />
                      </button>
                      {!task.completed && (
                        <button title="Mark as Complete" onClick={() => handleStatusUpdate(task._id)}>
                          <Check size={20} weight="light" />
                        </button>
                      )}
                    </td>
                  </tr>

                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default List;
