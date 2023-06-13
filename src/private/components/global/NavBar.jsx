import React, { useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../auth/context/AuthContext";

export const NavBar = () => {
  const { onLogout } = useContext(AuthContext);
  const navbarToogle = useRef(null);

  const handleHideModal = () => {
    if (window.innerWidth < 768) {
      setTimeout(() => {
        navbarToogle.current.click();
      }, 300);
    }
  };
  return (
    <>
      <header className="sticky-top">
        <nav className="navbar navbar-dark navbar-expand-md bg-dark">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">
              Automoción CSC
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasNavbar"
              aria-controls="offcanvasNavbar"
              ref={navbarToogle}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="offcanvas offcanvas-end bg-dark text-center"
              tabIndex="-1"
              id="offcanvasNavbar"
              aria-labelledby="offcanvasNavbarLabel"
            >
              <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
                  Índice
                </h5>
                <button
                  type="button"
                  className="btn-close bg-light"
                  data-bs-dismiss="offcanvas"
                  aria-label="Close"
                ></button>
              </div>
              <div className="offcanvas-body">
                <ul className="navbar-nav justify-content-end flex-grow-1 gap-3">
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Órdenes
                    </a>
                    <ul className="dropdown-menu">
                      <li className="nav-item px-2" onClick={handleHideModal}>
                        <Link className="nav-link text-dark" to={"/car"}>
                          Crear orden
                        </Link>
                      </li>
                      <li className="divider">
                        <hr />
                      </li>
                      <li className="nav-item px-2" onClick={handleHideModal}>
                        <Link className="nav-link text-dark" to={"/orders"}>
                          Ver órdenes
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Gestión
                    </a>
                    <ul className="dropdown-menu">
                      <li className="nav-item px-2" onClick={handleHideModal}>
                        <Link className="nav-link text-dark" to={"/students"}>
                          Alumnos
                        </Link>
                      </li>
                      <li className="divider">
                        <hr />
                      </li>
                      <li className="nav-item px-2" onClick={handleHideModal}>
                        <Link className="nav-link text-dark" to={"/courses"}>
                          Cursos
                        </Link>
                      </li>
                      <li className="divider">
                        <hr />
                      </li>
                      <li className="nav-item px-2" onClick={handleHideModal}>
                        <Link className="nav-link text-dark" to={"/cars"}>
                          Coches
                        </Link>
                      </li>
                      <li className="divider">
                        <hr />
                      </li>
                      <li className="nav-item px-2" onClick={handleHideModal}>
                        <Link className="nav-link text-dark" to={"/access"}>
                          Acceso
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <button onClick={onLogout} className="btn btn-warning">
                    Cerrar sesión
                  </button>
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};
