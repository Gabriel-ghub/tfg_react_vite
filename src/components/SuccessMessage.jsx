import React from 'react'

export const SuccessMessage = ({message}) => {
  return (
    <div className="alert alert-info" role="alert">
      {message}
    </div>
  );
}
