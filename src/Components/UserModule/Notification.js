
import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../Common/Configurations/APIConfig";
import LayoutHeader from "../../Common/Layout/Header";
import LayoutSideBar from "../../Common/Layout/Sidebar";

const Notification = () => {
  const [notificationsData, setNotificationsData] = useState([]);
  const [overdueTotal, setOverdueTotal] = useState(0);
  const [dueTodayTotal, setDueTodayTotal] = useState(0);

  const headerconfig = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("userToken"),
      "Content-Type": "application/json",
    },
  };

  const apiConfig = {
    fetchNotifications: () =>
      axios.get(config.APIACTIVATEURL + config.GETNOTIFICATION, {
        ...headerconfig,
      }),
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiConfig.fetchNotifications();
        const data = response.data;

        let overdueTotal = 0;
        let dueTodayTotal = 0;

        data.forEach((company) => {
          overdueTotal += company.overdue.length;
          dueTodayTotal += company.dueToday.length;
        });

        setOverdueTotal(overdueTotal);
        setDueTodayTotal(dueTodayTotal);
        setNotificationsData(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div 
        id="layout-wrapper" 
        style={{
          backgroundColor: "#efbff9",
          minHeight: "100vh", // Ensure the height takes up at least the full viewport height
          width: "100%",      // Ensure the wrapper stretches the full width
          position: "relative", // To make sure the background is applied to the entire area
        }}
      >
          <LayoutHeader />
          <LayoutSideBar />
          <div style={{ padding: "100px 50px 0 50px" }}>

    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>
        Notifications Dashboard
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            backgroundColor: "#fcf9fd",
            padding: "10px 20px",
            borderRadius: "5px",
            width: "48%",
          }}
        >
          <h3 style={{ color: "#f41223", margin: "0" ,fontWeight: "bold"}}>
            Overdue Communications
          </h3>
          <div
            style={{
              fontSize: "24px",
              color: "#020202",
              fontWeight: "bold",
            }}
          >
            {overdueTotal}
          </div>
        </div>
        <div
          style={{
            backgroundColor: "#fcf9fd",
            padding: "10px 20px",
            borderRadius: "5px",
            width: "48%",
          }}
        >
          <h3 style={{ color: "#eff603", margin: "0" ,fontWeight: "bold"}}>Due Today</h3>
          <div
            style={{
              fontSize: "24px",
              color: "#020202",
              fontWeight: "bold",
            }}
          >
            {dueTodayTotal}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        {/* Overdue Section */}
        <div style={{ flex: 1 }}>
          <h3 style={{ color: "#f41223" }}>Overdue List</h3>
          {notificationsData.map((company, index) =>
            company.overdue.length > 0 ? (
              <div key={index} style={{ marginBottom: "20px" }}>
                {company.overdue.map((notification, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: "#f8d7da",
                      padding: "10px",
                      borderRadius: "5px",
                      marginBottom: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h4 style={{ color: "#0056b3", marginBottom: "10px" }}>
                  {company.companyName}
                </h4>
                    <span>{notification.description}</span>
                    <span>
                      Scheduled Date:{" "}
                      {new Date(
                        notification.scheduledDate
                      ).toLocaleDateString()}
                    </span>
                    <span>{notification.daysOverdue} days overdue</span>
                    
                  </div>
                ))}
              </div>
            ) : null
          )}
        </div>

        {/* Due Today Section */}
        <div style={{ flex: 1 }}>
          <h3 style={{ color: "#856404" }}>Due Today List</h3>
          {notificationsData.map((company, index) =>
            company.dueToday.length > 0 ? (
              <div key={index} style={{ marginBottom: "20px" }}>
                {company.dueToday.map((notification, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: "#fff3cd",
                      padding: "10px",
                      borderRadius: "5px",
                      marginBottom: "10px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                     <h4 style={{ color: "#0056b3", marginBottom: "10px" }}>
                  {company.companyName}
                </h4>
                    <span>{notification.description}</span>
                    <span>
                      Scheduled date:{" "}
                      {new Date(
                        notification.scheduledDate
                      ).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : null
          )}
        </div>
      </div>
      </div>
    </div>
    </div>
  );
};


export default Notification;



