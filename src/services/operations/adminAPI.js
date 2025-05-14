import { apiConnector } from "../apiconnector";
const BASE_URL = "http://localhost:4000/api/v1"

export const getAllUsers = async (token) => {
  try {
    const res = await apiConnector(
      "GET",
      `${BASE_URL}/admin/all-users`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    alert(JSON.stringify(res.data.users));
    return res.data?.users;
  } catch (error) {
    console.log("GET_ALL_USERS_ERROR:", error);
    return null;
  }
};

export const deleteUser = async (userId, token) => {
  try {
    const res = await apiConnector(
      "DELETE",
      `${BASE_URL}/admin/delete-user/${userId}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return res.data?.success;
  } catch (error) {
    console.log("DELETE_USER_ERROR:", error);
    return false;
  }
};

export const changeUserRole = async (userId, newRole, token) => {
  try {
    const res = await apiConnector(
      "PUT",
      `${BASE_URL}/admin/change-role`,
      {
        userId,
        role: newRole,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );
    return res.data?.success;
  } catch (error) {
    console.log("CHANGE_ROLE_ERROR:", error);
    return false;
  }
};

// console.log("Backend URL:", BASE_URL);
