import React, { useState } from "react";

function CreateUser(props) {
  const [userData, setUserData] = useState({ name: "", email: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.onCreate(userData);
    setUserData({ name: "", email: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={userData.name}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        Email:
        <input
          type="text"
          name="email"
          value={userData.email}
          onChange={handleInputChange}
          required
        />
      </label>
      <button type="submit">Create User</button>
    </form>
  );
}

export default CreateUser;
