import React, { useState } from 'react';

const AssignTaskModal = ({ isOpen, onClose, task, users, onAssign }) => {
  const [selectedUserId, setSelectedUserId] = useState("");

  const handleAssign = () => {
    if (!selectedUserId) {
      alert("Please select a user");
      return;
    }
    onAssign(task.id, selectedUserId);
    setSelectedUserId(""); // Reset selection
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">
          Assign Task: {task.title}
        </h3>
        
        <div className="form-control">
          <label className="label">
            <span className="label-text">Select User</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            <option value="">Choose a user</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username} ({user.email})
              </option>
            ))}
          </select>
        </div>

        <div className="modal-action">
          <button 
            className="btn btn-ghost"
            onClick={() => {
              setSelectedUserId("");
              onClose();
            }}
          >
            Cancel
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleAssign}
            disabled={!selectedUserId}
          >
            Assign Task
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}>
        <button className="cursor-default">close</button>
      </div>
    </div>
  );
};

export default AssignTaskModal;