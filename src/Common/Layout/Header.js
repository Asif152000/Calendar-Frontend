import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import auth from "../Configurations/Auth";
export default function LayoutHeader() {
  const navigate = useNavigate();
  function CheckExpirationTime() {
    if (localStorage.getItem("tokenexpiration") !== "") {
      const expiredate = new Date(localStorage.getItem("tokenexpiration"));
      const localdate = new Date();
      if (expiredate > localdate) {
        return true;
      }
    }
    return false;
  }
  useEffect(() => {
    if (localStorage.getItem("userId") !== "") {
      if (CheckExpirationTime()) {
        // auth.uulogin();
      } else {
        // navigate('/login');
      }
    }
  }, []);
  return (
    <header id="page-topbar">
      <div className="layout-width">
        <div className="navbar-header">
          <div className="d-flex">
            <div
              className="navbar-brand-box horizontal-logo"
              style={{ fontSize: "30px", color: "black", paddingTop: "8px" }}
            >
              COMMUNICATION MANAGEMENT
            </div>
          </div>
          <div className="d-flex align-items-center">
            <div className="dropdown d-md-none topbar-head-dropdown header-item">
              <button
                type="button"
                className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
                id="page-header-search-dropdown"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <i className="bx bx-search fs-22" />
              </button>
              <div
                className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
                aria-labelledby="page-header-search-dropdown"
              >
                <form className="p-3">
                  <div className="form-group m-0">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search ..."
                        aria-label="Recipient's username"
                      />
                      <button className="btn btn-primary" type="submit">
                        <i className="mdi mdi-magnify" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="dropdown ms-sm-3 header-item topbar-user">
              <button
                type="button"
                className="btn"
                id="page-header-user-dropdown"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <span className="d-flex align-items-center">
                  <span className="rounded-circle header-profile-user">
                    <i className="mdi mdi-account-circle fs-24"></i>
                  </span>
                  <span className="text-start ms-xl-2">
                    <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">
                      {localStorage.getItem("name")}
                    </span>
                    <span className="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">
                      {localStorage.getItem("roleName")}
                    </span>
                  </span>
                </span>
              </button>
              <div className="dropdown-menu dropdown-menu-end">
                {/* item*/}
                <h6 className="dropdown-header">Welcome</h6>

                <Link className="dropdown-item" to={"/logout"}>
                  <i className="mdi mdi-logout text-muted fs-16 align-middle me-1" />{" "}
                  <span className="align-middle" data-key="t-logout">
                    Logout
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
