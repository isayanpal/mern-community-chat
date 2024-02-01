import React from "react";

const Logout = ({ onLogout }) => {
  return (
    <div>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};

export default Logout;
