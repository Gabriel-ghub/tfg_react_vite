// import React, { useState } from "react";
import { useJwt } from "react-jwt";

export const useToken = () => {
  let token = localStorage.getItem('token')
  const { decodedToken, /*isExpired*/ } = useJwt(token);

  const get_decoded_token = () => {
    token = localStorage.getItem('token')
    return decodedToken;
  };

  const getToken = () =>{
    const token = JSON.parse(localStorage.getItem("token"));
    if(token){
      return token
    }else{
      return false;
    }
  }
  return {get_decoded_token, getToken};
};
