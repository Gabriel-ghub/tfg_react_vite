import React from 'react'

export const Order = ({id,state,date_in,email,kilometres,name,surname}) => {
  return (
    <div style={{backgroundColor:"green",border:"1px solid black", margin:"5px", padding:"10px"}}>
      <h2>{id}</h2>
      <h2>{state}</h2>
      <h2>{date_in}</h2>
      <h2>{email}</h2>
    </div>
  );
}
