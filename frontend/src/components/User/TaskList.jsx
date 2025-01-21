import { useDispatch, useSelector } from "react-redux";
import { updateTaskStatus, fetchTasks, assignTask } from "../../store/slices/taskSlice";
import { fetchUsers } from "../../store/slices/userSlice";
import { FiCheckCircle, FiAlertCircle, FiClock, FiArchive, FiUserPlus } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserTaskHistory from "./UserTaskHistory";
import AssignTaskModal from "../Manager/AssignTaskModal";

const TaskList = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.list);
  const users = useSelector((state) => state.users.list);
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.user?.role);
  const navigate = useNavigate();
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

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

  const closeTask = (taskId) => {
    dispatch(updateTaskStatus({ token, taskId, status: "CLOSED" }));
  };

  const openAssignModal = (task) => {
    setSelectedTask(task);
    setShowAssignModal(true);
  };

  const closeAssignModal = () => {
    setSelectedTask(null);
    setShowAssignModal(false);
  };

  const handleAssignTask = async (taskId, assigneeId) => {
    try {
      await dispatch(assignTask({ token, taskId, assigneeId })).unwrap();
      dispatch(fetchTasks(token)); // Reincarca task-urile pentru a reflecta schimbarea
    } catch (error) {
      console.error('Failed to assign task:', error);
      alert('Failed to assign task');
    }
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
      case "CLOSED":
        return (
          <div className="badge badge-neutral gap-2">
            <FiArchive className="w-4 h-4" />
            Closed
          </div>
        );
      case "OPEN":
        return (
          <div className="badge badge-warning gap-2">
            <FiAlertCircle className="w-4 h-4" />
            Open
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
              <div className="stat-title">Open</div>
              <div className="stat-value text-warning">
                {tasks.filter((task) => task.state === "OPEN").length}
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">Pending</div>
              <div className="stat-value text-info">
                {tasks.filter((task) => task.state === "PENDING").length}
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">Completed</div>
              <div className="stat-value text-success">
                {tasks.filter((task) => task.state === "COMPLETED").length}
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">Closed</div>
              <div className="stat-value text-neutral">
                {tasks.filter((task) => task.state === "CLOSED").length}
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
                    {task.completedAt && (
                      <div>
                        Completed: {new Date(task.completedAt).toLocaleDateString()}
                      </div>
                    )}
                    {task.closedAt && (
                      <div>
                        Closed: {new Date(task.closedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>

                <p className="py-4 text-base-content/80">{task.description}</p>

                <div className="divider"></div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    {task.assignee ? (
                      <>
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
                      </>
                    ) : (
                      <span className="text-sm opacity-70">
                        No assignee
                      </span>
                    )}
                  </div>

                  <div className="card-actions justify-end">
                    {role === "USER" && task.state === "PENDING" && (
                      <button
                        className="btn btn-primary btn-sm gap-2"
                        onClick={() => completeTask(task.id)}
                      >
                        <FiCheckCircle className="w-4 h-4" />
                        Complete Task
                      </button>
                    )}
                    {role === "MANAGER" && task.state === "COMPLETED" && (
                      <button
                        className="btn btn-neutral btn-sm gap-2"
                        onClick={() => closeTask(task.id)}
                      >
                        <FiArchive className="w-4 h-4" />
                        Close Task
                      </button>
                    )}
                    {role === "MANAGER" && task.state === "OPEN" && (
                      <button
                        className="btn btn-info btn-sm gap-2"
                        onClick={() => openAssignModal(task)}
                      >
                        <FiUserPlus className="w-4 h-4" />
                        Assign Task
                      </button>
                    )}
                  </div>
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

        {showAssignModal && selectedTask && (
          <AssignTaskModal
            isOpen={showAssignModal}
            onClose={closeAssignModal}
            task={selectedTask}
            users={users}
            onAssign={handleAssignTask}
          />
        )}
      </div>
    </div>
  );
};

export default TaskList;