import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

const UserTaskHistory = ({ userId, username }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = useSelector((state) => state.auth.token);

    useEffect(() => {
        const fetchUserTasks = async () => {
            try {
                setLoading(true);
                console.log('Fetching tasks for user:', userId);
                
                const response = await axios.get(
                    `http://localhost:3000/api/tasks/user/${userId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                
                console.log('Server response:', response.data);
                
                if (Array.isArray(response.data)) {
                    setTasks(response.data);
                } else {
                    console.error('Response is not an array:', response.data);
                    setTasks([]);
                }
            } catch (err) {
                console.error('Error fetching tasks:', err);
                setError(err.message || 'Error fetching tasks');
                setTasks([]);
            } finally {
                setLoading(false);
            }
        };

        if (userId && token) {
            fetchUserTasks();
        }
    }, [userId, token]);

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

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="loading loading-spinner loading-lg"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-error p-4">
                <p>Error: {error}</p>
            </div>
        );
    }

    const completedTasks = tasks.filter(task => task.state === 'COMPLETED').length;
    const pendingTasks = tasks.filter(task => task.state === 'PENDING').length;

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Task History for {username}</h2>
            
            <div className="stats shadow mb-6">
                <div className="stat">
                    <div className="stat-title">Total Tasks</div>
                    <div className="stat-value">{tasks.length}</div>
                </div>
                <div className="stat">
                    <div className="stat-title">Completed</div>
                    <div className="stat-value text-success">{completedTasks}</div>
                </div>
                <div className="stat">
                    <div className="stat-title">Pending</div>
                    <div className="stat-value text-info">{pendingTasks}</div>
                </div>
            </div>

            <div className="grid gap-4">
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <div key={task.id} className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <div className="flex justify-between items-start">
                                    <h3 className="card-title">{task.title}</h3>
                                    {getStatusBadge(task.state)}
                                </div>
                                <p className="text-base-content/70">{task.description}</p>
                                <div className="flex justify-between items-center text-sm opacity-70">
                                    <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                                    {task.completedAt && (
                                        <span>Completed: {new Date(task.completedAt).toLocaleDateString()}</span>
                                    )}
                                </div>
                                <div className="text-sm mt-2">
                                    <span className="font-semibold">Created by: </span>
                                    {task.creator?.username}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center p-8 bg-base-200 rounded-lg">
                        <h3 className="font-semibold text-lg">No tasks found</h3>
                        <p className="text-base-content/70">This user hasn't been assigned any tasks yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserTaskHistory;