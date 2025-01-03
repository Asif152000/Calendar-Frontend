
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import config from "../../Common/Configurations/APIConfig";
import axios from "axios";

export default function LayoutSideBar() {
  const [notificationCount, setNotificationCount] = useState(0);
  const fetchNotificationCounts = async () => {
    try {
      console.log("Fetching notification counts...");
      const response = await axios.get(
        `${config.APIACTIVATEURL}${config.GETCOUNT}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      console.log("API response:", data); // Debugging log
      if (data && typeof data.totalCount === "number") {
        setNotificationCount(data.totalCount);
        console.log("Updated notificationCount state:", data.totalCount);
      }
    } catch (error) {
      console.error("Error fetching notification counts:", error);
    }
  };

  useEffect(() => {
    fetchNotificationCounts();
    const interval = setInterval(fetchNotificationCounts, 60000); // Refresh every minute
    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);
  const role = localStorage.getItem("roleName");
  return (
    <div className="app-menu navbar-menu" >
      <div className="navbar-brand-box">
        <Link to={"/"} className="logo logo-light">
          <span className="logo-lg" style={{ color: "#fff", fontSize: "20px" }}>
            CALENDAR
          </span>
        </Link>
        <button
          type="button"
          className="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover"
          id="vertical-hover"
        >
          <i className="ri-record-circle-line" />
        </button>
      </div>
      <div id="scrollbar">
        <div className="container-fluid">
          <ul className="navbar-nav" id="navbar-nav">
          {role === "Admin" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link menu-link" to={"/companyManagement"}>
                    <i className="ri-store-line"></i>
                    <span data-key="t-dashboards">Company Management</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link menu-link" to={"/communicationManagement"}>
                    <i className="ri-store-line"></i>
                    <span data-key="t-dashboards">Communication Management</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to={"/logout"} className="nav-link menu-link">
                    <i className="mdi mdi-logout" />{" "}
                    <span className="align-middle" data-key="t-logout">
                      Logout
                    </span>
                  </Link>
                </li>
              </>
            )}
            {role === "STAFF" && (
              <>
            {/* Dashboard Link */}
            <li className="nav-item">
              <Link className="nav-link menu-link" to={"/dashboard"}>
                <i className="ri-store-line"></i>
                <span>Dashboard</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link menu-link" to={"/calendar"}>
                <i className="ri-calendar-line"></i> {/* Calendar icon */}
                <span>Calendar</span>
              </Link>
            </li>

            {/* Notifications Link */}

            <li className="nav-item" style={{ position: "relative" }}>
              <Link
                className="nav-link menu-link"
                to={"/notification"}
                style={{ position: "relative" }}
              >
                <i className="ri-notification-3-line"></i>
                <span>Notifications</span>

                {/* Badge */}
                {notificationCount > 0 && (
                  <span
                    className="badge bg-danger text-white"
                    style={{
                      position: "absolute",
                      top: "1px", // Adjusted for better alignment
                      right: "1px", // Fine-tuned for consistent appearance
                      padding: "5px 7px",
                      borderRadius: "50%",
                      fontSize: "12px",
                      lineHeight: "1",
                      zIndex: 10,
                      display: "inline-block",
                    }}
                  >
                    {notificationCount}
                  </span>
                )}
              </Link>
            </li>
            </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
