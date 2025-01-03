
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import config from "../../Common/Configurations/APIConfig";
import LayoutHeader from "../../Common/Layout/Header";
import LayoutSideBar from "../../Common/Layout/Sidebar";

const localizer = momentLocalizer(moment);

const MainCalendar = () => {
  const [communications, setCommunications] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const headerconfig = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("userToken"),
      "Content-Type": "application/json",
    },
  };

  const apiConfig = {
    fetchCalendar: () =>
      axios.get(config.APIACTIVATEURL + config.GETCALENDAR, {
        ...headerconfig,
      }),
  };

  useEffect(() => {
    apiConfig
      .fetchCalendar()
      .then((response) => setCommunications(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  
  const events = communications.map((comm) => ({
    title: `${comm.companyName} - ${comm.communicationType}`,
    start: new Date(comm.scheduledDate),
    end: new Date(comm.scheduledDate), 
  }));

  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value, 10);
    const updatedDate = new Date(currentDate);
    updatedDate.setFullYear(newYear);
    setCurrentDate(updatedDate);
  };

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value, 10);
    const updatedDate = new Date(currentDate);
    updatedDate.setMonth(newMonth);
    setCurrentDate(updatedDate);
  };

  const handleNavigate = (direction) => {
    const updatedDate = new Date(currentDate);
    if (direction === "next") {
      updatedDate.setMonth(currentDate.getMonth() + 1);
    } else if (direction === "back") {
      updatedDate.setMonth(currentDate.getMonth() - 1);
    }
    setCurrentDate(updatedDate);
  };

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
      <div style={{ padding: "120px 50px 0 50px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            backgroundColor: "#ffffff",
            padding: "10px",
            borderRadius: "8px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <button
            onClick={() => handleNavigate("back")}
            style={{
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "20px",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
          >
            ← Back
          </button>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <label>
              Year:
              <select
                value={currentDate.getFullYear()}
                onChange={handleYearChange}
                style={{
                  padding: "8px",
                  borderRadius: "4px",
                  fontSize: "14px",
                  border: "1px solid #ced4da",
                }}
              >
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i} value={currentDate.getFullYear() - 5 + i}>
                    {currentDate.getFullYear() - 5 + i}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Month:
              <select
                value={currentDate.getMonth()}
                onChange={handleMonthChange}
                style={{
                  padding: "8px",
                  borderRadius: "4px",
                  fontSize: "14px",
                  border: "1px solid #ced4da",
                }}
              >
                {moment.months().map((month, index) => (
                  <option key={index} value={index}>
                    {month}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button
            onClick={() => handleNavigate("next")}
            style={{
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "20px",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
          >
            Next →
          </button>
        </div>
        <div
          style={{
            height: "80vh",
            margin: "20px",
            borderRadius: "8px",
            backgroundColor: "#ffffff",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            padding: "20px",
          }}
        >
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{
              height: "100%",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            }}
            views={["month", "week", "day", "agenda"]}
            defaultView="month"
            popup
            selectable
            date={currentDate}
            onNavigate={(date) => setCurrentDate(date)}
          />
        </div>
      </div>
    </div>
  );
};

export default MainCalendar;
