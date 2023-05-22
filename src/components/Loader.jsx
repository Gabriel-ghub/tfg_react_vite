import React from "react";

export const Loader = () => {
  return (
    <div className="d-flex justify-content-center mt-3">
      <div className="spinner-border text-center" role="status">
        <span className="visually-hidden"></span>
      </div>
    </div>
  );
};
