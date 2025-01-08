import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTask } from "../../store/slices/taskSlice";

function CreateTask() {
  const dispatch = useDispatch();
  const [task, setTask] = useState({
    title: "",
    description: "",
    assigneeId: "",
  });

  const users = useSelector((state) => state.users.list);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(createTask(task));
  };

  return (
    <div className="p-6">
      <form className="card w-96 bg-base-100 shadow-xl" onSubmit={handleSubmit}>
        <div className="card-body">
          <h2 className="card-title">Create New Task</h2>

          <input
            type="text"
            placeholder="Title"
            className="input input-bordered w-full"
            onChange={(e) => setTask({ ...task, title: e.target.value })}
          />

          <textarea
            placeholder="Description"
            className="textarea textarea-bordered w-full"
            onChange={(e) => setTask({ ...task, description: e.target.value })}
          />

          <select
            className="select select-bordered w-full"
            onChange={(e) => setTask({ ...task, assigneeId: e.target.value })}
          >
            <option value="">Select Assignee</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.email}
              </option>
            ))}
          </select>

          <button className="btn btn-primary mt-4">Create Task</button>
        </div>
      </form>
    </div>
  );
}

export default CreateTask;
