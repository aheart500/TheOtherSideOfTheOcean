import React from "react";

const Message = ({ message, givenClass, actionName, action, hide }) => {
  return (
    <div
      className={
        givenClass ? `${givenClass} message-container` : "message-container"
      }
    >
      <div className="message">
        <p>{message}</p>
        <div className="message-buttons">
          <button type="button" className="btn btn-red fill" onClick={action}>
            {actionName}
          </button>
          <button type="button" className="btn btn-black pulse" onClick={hide}>
            Hide
          </button>
        </div>
      </div>
    </div>
  );
};

export default Message;
