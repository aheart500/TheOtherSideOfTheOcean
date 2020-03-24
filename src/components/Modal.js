import React, { useEffect } from "react";

const Modal = ({ exit, logout }) => {
  useEffect(() => {
    const listner = e => {
      if (e.keyCode === 13) return logout();
    };
    document.addEventListener("keydown", listner);
    return () => {
      document.removeEventListener("keydown", listner);
    };
  }, [logout]);
  return (
    <div className="log-box-container">
      <div className="log-box log-out">
        <p>Are you sure you want to log out?</p>
        <div>
          <button className="btn btn-red fill" onClick={logout}>
            Log out
          </button>
          <button className="btn btn-gray btn-darkend fill" onClick={exit}>
            No, Stay in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
