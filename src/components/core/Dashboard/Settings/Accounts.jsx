import React, { useEffect, useState } from "react";
import {
  getAllUsers,
  deleteUser,
  changeUserRole,
} from "../../../../services/operations/adminAPI";

import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const Accounts = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ Search state
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUsers = async () => {
      const result = await getAllUsers(token);
      alert(JSON.stringify(result));
      if (result) {
        setUsers(result);
      } else {
        toast.error("Failed to fetch users");
      }
    };
    fetchUsers();
  }, [token]);

  const handleDelete = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmed) return;

    const res = await deleteUser(userId, token);
    if (res) {
      toast.success("User deleted");
      setUsers((prevUsers) => prevUsers.filter((u) => u._id !== userId));
    } else {
      toast.error("Failed to delete user");
    }
  };

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === "Student" ? "Instructor" : "Student";
    const res = await changeUserRole(userId, newRole, token);
    if (res) {
      toast.success("Role updated");
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u._id === userId ? { ...u, accountType: newRole } : u
        )
      );
    } else {
      toast.error("Failed to update role");
    }
  };

  // ✅ Filter users based on search term
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();

    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="p-6 text-richblack-25">
      <h2 className="text-2xl font-bold mb-6">All Users</h2>

      {/* ✅ Search bar input */}
      <input
        type="text"
        placeholder="Search by name or email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 rounded bg-richblack-700 text-white border border-richblack-600 w-full md:w-1/3"
      />

      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full bg-richblack-800 border border-richblack-700 rounded-lg">
          <thead>
            <tr className="text-left text-richblack-100 bg-richblack-700">
              <th className="p-3 border-b border-richblack-600">Name</th>
              <th className="p-3 border-b border-richblack-600">Email</th>
              <th className="p-3 border-b border-richblack-600">Role</th>
              <th className="p-3 border-b border-richblack-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-richblack-700 transition"
                >
                  <td className="p-3 border-b border-richblack-700">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="p-3 border-b border-richblack-700">
                    {user.email}
                  </td>
                  <td className="p-3 border-b border-richblack-700">
                    {user.accountType}
                  </td>
                  <td className="p-3 border-b border-richblack-700 flex gap-3">
                    <button
                      onClick={() =>
                        handleRoleChange(user._id, user.accountType)
                      }
                      className="bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-400 transition"
                    >
                      Change Role
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-6 text-richblack-300 border-t border-richblack-600"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Accounts;