import React from "react";

export const Main = ({ children, page }) => {
  return (
    <main className='container__general container pt-3'>
      <main className={`principal ${page}` }>{children}</main>
    </main>
  );
};
