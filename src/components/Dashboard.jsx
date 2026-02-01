import React, { useEffect, useState } from "react";
import { getToken } from "../utils/auth";
import "../styles.css";


export default function Dashboard() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = getToken();
      if (!token) return;

      // If your backend had a /me endpoint, example:
      // const res = await fetch("https://userservices-latest.onrender.com/api/users/me", {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // const data = await res.json();
      // setUserData(data);

      // For now, we'll just decode JWT for demo
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserData({ email: payload.sub, id: payload.userId });
    };
    fetchUser();
  }, []);

  return (
    <div className="form-container">
      <h2>Dashboard</h2>
      {userData ? (
        <div>
          <p>Email: {userData.email}</p>
          <p>User ID: {userData.id}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
}
