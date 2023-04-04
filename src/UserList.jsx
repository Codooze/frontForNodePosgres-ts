import React, { useState } from "react";
import useSWR from "swr";
import CreateUser from "./CreateUser";

const baseUrl = "http://localhost:3000";
const fetcher = (url) => fetch(url).then((res) => res.json());

function UserList() {
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [editingUserId, setEditingUserId] = useState(null);
  const { data, error, mutate } = useSWR(`${baseUrl}/users`, fetcher);

  if (error) return <div>Failed to load users</div>;
  if (!data) return <div>Loading...</div>;

  const handleDelete = async (userId) => {
    await fetch(`${baseUrl}/users/${userId}`, { method: "DELETE" });
    mutate();
  };

  const handleSave = async (userId) => {
    await fetch(`${baseUrl}/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
      }),
    });
    setEditingUserId(null);
    setUserData({ name: "", email: "" });
    mutate();
  };

  const handleEdit = (userId, name, email) => {
    setEditingUserId(userId);
    setUserData({ name, email });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleCreate = async (userData) => {
    const { name, email } = userData;
    await fetch(`${baseUrl}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email }),
    });
    mutate();
  };

  return (
    <div>
      <h1>User List</h1>
      <ul>
        {data.map((user) => (
          <li key={user.id}>
            {editingUserId === user.id ? (
              <div>
                <input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                />
                <button onClick={() => handleSave(user.id)}>Save</button>
              </div>
            ) : (
              <div>
                <p>Name: {user.name}</p>
                <p>Email: {user.email}</p>
                <button onClick={() => handleDelete(user.id)}>
                  Delete User
                </button>
                <button
                  onClick={() => handleEdit(user.id, user.name, user.email)}
                >
                  Edit User
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <CreateUser onCreate={handleCreate} />
    </div>
  );
}

export default UserList;
