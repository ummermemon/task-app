import { PencilSimple, Power, Trash } from "phosphor-react";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";

function List() {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    fetch('http://127.0.0.1:8000/tasks/')
      .then((response) => response.json())
      .then((result) => setTasks(result))
      .catch((error) => console.error(error))
  }, [])
  return (
    <>
      <Navbar />
      <div className="grid grid-cols-12 m-5">
        <div className="col-span-12 md:col-span-6 lg:col-span-6">
          <div className="card rounded-xl bg-gray-100 p-5 border shadow-2xl">
            <button className="bg-blue-500 text-white p-2 rounded-lg my-3 text-sm">+ Add Task</button>
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
                {tasks.map((task,idx) => (
                <tr className="">

                  <td className="px-4 py-2 border-r">{task.title}</td>
                  <td className="px-4 py-2 text-gray-500 border-r">{task.description}</td>
                  <td className={`px-2 ${task.completed == true ? 'text-blue-500' : 'text-red-500'} text-sm rounded-lg border-r`}>{task.completed == true ? "Completed" : "Incomplete"}</td>
                  <td className="px-4 py-2 flex space-x-5"><PencilSimple weight="light" size={20} /> <Trash size={20} weight="light" /></td>
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
