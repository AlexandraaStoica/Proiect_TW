import { useDispatch, useSelector } from "react-redux";
import { updateTaskStatus, fetchTasks } from "../../store/slices/taskSlice";
import { fetchUsers } from "../../store/slices/userSlice";
import { FiCheckCircle, FiAlertCircle, FiClock } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserTaskHistory from "./UserTaskHistory";

const TaskList = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.list);
  const users = useSelector((state) => state.users.list);
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.role);
  const navigate = useNavigate();
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(fetchTasks(token));
      if (role === 'MANAGER') {
        dispatch(fetchUsers(token));
      }
    }
  }, [dispatch, token, role]);

  const completeTask = (taskId) => {
    dispatch(updateTaskStatus({ token, taskId, status: "COMPLETED" }));
  };

  const getStatusBadge = (state) => {
    switch (state) {
      case "COMPLETED":
        return (
          <div className="badge badge-success gap-2">
            <FiCheckCircle className="w-4 h-4" />
            Completed
          </div>
        );
      default:
        return (
          <div className="badge badge-info gap-2">
            <FiAlertCircle className="w-4 h-4" />
            Pending
          </div>
        );
    }
  };

  const openUserHistory = (user) => {
    setSelectedUser(user);
    setShowHistoryModal(true);
  };

  return (
    <div className="min-h-screen bg-base-200 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Task Dashboard</h1>
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Total Tasks</div>
              <div className="stat-value text-primary">{tasks.length}</div>
            </div>
            <div className="stat">
              <div className="stat-title">Completed</div>
              <div className="stat-value text-success">
                {tasks.filter((task) => task.state === "COMPLETED").length}
              </div>
            </div>
          </div>
        </div>

        {role === "MANAGER" && (
          <>
            <button 
              className="btn btn-primary mb-8" 
              onClick={() => navigate('/tasks/create')}
            >
              Create New Task
            </button>

            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Team Members</h2>
              <div className="flex flex-wrap gap-4">
                {users.map((user) => (
                  <div key={user.id} className="card bg-base-100 shadow-xl compact">
                    <div className="card-body">
                      <h3 className="card-title text-lg">{user.username}</h3>
                      <p className="text-sm text-base-content/70">{user.email}</p>
                      <button 
                        className="btn btn-primary btn-sm mt-2"
                        onClick={() => openUserHistory(user)}
                      >
                        <FiClock className="mr-2" />
                        View History
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="grid gap-6">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-200"
            >
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="card-title text-2xl mb-2">{task.title}</h2>
                    {getStatusBadge(task.state)}
                  </div>
                  <div className="text-sm opacity-70">
                    Created: {new Date(task.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <p className="py-4 text-base-content/80">{task.description}</p>

                <div className="divider"></div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="avatar placeholder">
                      <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                        <span className="text-xs">
                          {task.assignee.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm opacity-70">
                      Assignee: {task.assignee.username}
                    </span>
                  </div>

                  {role === "USER" && task.state !== "COMPLETED" && (
                    <div className="card-actions justify-end">
                      <button
                        className="btn btn-primary btn-sm gap-2"
                        onClick={() => completeTask(task.id)}
                      >
                        <FiCheckCircle className="w-4 h-4" />
                        Complete Task
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <h2 className="card-title text-2xl mb-4">No Tasks Found</h2>
              <p className="text-base-content/70">
                There are no tasks assigned to you at the moment.
              </p>
              {role === "MANAGER" && (
                <div className="card-actions">
                  <button 
                    className="btn btn-primary mt-4"
                    onClick={() => navigate('/tasks/create')}
                  >
                    Create New Task
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal for User Task History */}
        {showHistoryModal && selectedUser && (
          <div className="modal modal-open">
            <div className="modal-box w-11/12 max-w-5xl">
              <button
                className="btn btn-sm btn-circle absolute right-2 top-2"
                onClick={() => setShowHistoryModal(false)}
              >
                ✕
              </button>
              <UserTaskHistory 
                userId={selectedUser.id} 
                username={selectedUser.username} 
              />
            </div>
            <div className="modal-backdrop" onClick={() => setShowHistoryModal(false)}>
              <button className="cursor-default">close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;