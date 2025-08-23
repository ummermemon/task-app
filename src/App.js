import { PencilSimple, Power, Trash } from "phosphor-react";
import { useState, useEffect } from "react";

function App() {
  const [showCard, setShowCard] = useState(false);
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    fetch('http://127.0.0.1:8000/tasks/')
      .then((response) => response.json())
      .then((result) => setTasks(result))
      .catch((error) => console.error(error))
  }, [])
  return (
    <>
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
      <div className="grid grid-cols-12 m-5">
        <div className="col-span-12 md:col-span-6 lg:col-span-6">
          <div className="card rounded-xl bg-gray-100 p-5 border shadow-2xl">
            <button className="bg-blue-500 text-white p-2 rounded-lg my-3 text-sm">+ Add New</button>
            <table className="w-full border">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left border-r">Title</th>
                  <th className="px-4 py-2 text-left border-r">Desc</th>
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
                  <td className="px-4 py-2 flex"><PencilSimple weight="light" size={20} /> <Trash size={20} weight="light" /></td>
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

export default App;
