import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../store/slices/userSlice";
import { createTask } from "../../store/slices/taskSlice";
import { createSelector } from "@reduxjs/toolkit";

const selectUsers = createSelector(
    state => state.users,
    users => ({
        list: users?.list || [],
        status: users?.status || 'idle'
    })
);

function CreateTask() {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.auth.token);
    const { list: users, status } = useSelector(selectUsers);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        assigneeId: ''
    });

    useEffect(() => {
        if (token) {
            dispatch(fetchUsers(token));
        }
    }, [dispatch, token]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title || !formData.description) {
            alert('Title and description are required');
            return;
        }

        try {
            await dispatch(createTask({
                token,
                title: formData.title,
                description: formData.description,
                assigneeId: formData.assigneeId || null // Permitem null pentru assigneeId
            })).unwrap();

            setFormData({
                title: '',
                description: '',
                assigneeId: ''
            });
            alert('Task created successfully');
        } catch (error) {
            console.error('Failed to create task:', error);
            alert('Failed to create task');
        }
    };

    return (
        <div className="flex w-full justify-center p-6">
            <form className="card w-96 bg-base-100 shadow-xl" onSubmit={handleSubmit}>
                <div className="card-body">
                    <h2 className="card-title">Create New Task</h2>

                    <input
                        id="title"
                        type="text"
                        placeholder="Title"
                        className="input input-bordered w-full"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />

                    <textarea
                        id="description"
                        placeholder="Description"
                        className="textarea textarea-bordered w-full"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />

                    <select
                        id="assigneeId"
                        className="select select-bordered w-full"
                        value={formData.assigneeId}
                        onChange={handleChange}
                    >
                        <option value="">Select Assignee (Optional)</option>
                        {status === 'succeeded' && users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.username || user.email}
                            </option>
                        ))}
                    </select>

                    <button
                        type="submit"
                        className="btn btn-primary mt-4"
                    >
                        Create Task
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateTask;