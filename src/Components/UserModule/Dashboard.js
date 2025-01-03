
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import config from "../../Common/Configurations/APIConfig";
import { handleSuccess, handleError } from "../../Common/Layout/CustomAlerts";
import Flatpickr from "react-flatpickr"; 
import "flatpickr/dist/themes/material_blue.css"; 
import moment from "moment";
import LayoutHeader from "../../Common/Layout/Header";
import LayoutSideBar from "../../Common/Layout/Sidebar";


export default function Dashboard() {
    const [lists, setLists] = useState([]);
    const [recordForEdit, setRecordForEdit] = useState(null);
    const [errors, setErrors] = useState({});
    const [btnSubmit, setBtnSubmit] = useState(true);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [pageNumber, setPageNumber] = useState(1);
    const [data, setData] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [selectedCommunication, setSelectedCommunication] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [notes, setNotes] = useState("");
    const [selectedCompany, setSelectedCompany] = useState(null); // Track the selected company
    const [selectedCompanies, setSelectedCompanies] = useState([]);
    const [communications, setCommunications] = useState([]);


    const headerConfig = {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("userToken"),
            "Content-Type": "application/json",
        },
    };



    const [disabledHighlights, setDisabledHighlights] = useState(() => {
        return JSON.parse(localStorage.getItem("disabledHighlights")) || [];
    });
    const handleDisableHighlight = (communicationId) => {
        setDisabledHighlights((prev) => {
            const updated = [...prev, communicationId];
            localStorage.setItem("disabledHighlights", JSON.stringify(updated));
            return updated;
        });
    };
    useEffect(() => {
        const savedHighlights = JSON.parse(localStorage.getItem("disabledHighlights"));
        if (savedHighlights) {
            setDisabledHighlights(savedHighlights);
        }
    }, []);




    const validate = () => {
        let temp = {};
        temp.selectedCommunication = selectedCommunication ? true : "Please select a communication.";
        temp.selectedDate = selectedDate.length > 0 ? true : "Please select a date.";
        temp.notes = notes.trim() ? true : "Notes cannot be empty.";

        setErrors(temp);
        return Object.values(temp).every((x) => x === true);
    };

    const handleCommunicationPerformed = async () => {
        if (selectedCompanies.length > 0) {
            try {
                // Fetch communications from the API
                const response = await axios.get(`${config.APIACTIVATEURL}${config.GETALLCOMMUNICATIONMANAGEMENT}`, headerConfig);

                if (response.data && response.data.statusCode === 200) {
                    // Update communications state with API data
                    setCommunications(response.data.data || []);
                    setShowModal(true); // Open the modal
                } else {
                    handleError(response.data.message || "Failed to fetch communications.");
                }
            } catch (error) {
                console.error("Error fetching communications:", error);
                handleError("An error occurred while fetching communications.");
            }
        } else {
            alert("Please select at least one company!");
        }
    };


    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedCompanies([]);           
        setSelectedCommunication("");     
        setSelectedDate([]);               
        setNotes("");                      
        setErrors({});
    };
    const handleModalSubmit = async () => {
        if (!validate()) return; 
        const updateRecord = {
            selectedCompanies, 
            selectedCommunication, 
            selectedDate, 
            notes, 
        };

        try {
            const response = await axios.put(
                `${config.APIACTIVATEURL}${config.UPDATECOMMUNICATION}`, 
                updateRecord, 
                headerConfig 
            );

            if (response.data.statusCode === 200) {
                handleSuccess("Status updated successfully.");
                getData(pageNumber);
            } else {
                handleError(response.data.message || "Failed to update status.");
            }
        } catch (error) {
            console.error("Error in updating status:", error);
            handleError("An error occurred while updating the status.");
        }
    };

    const handleCheckboxChange = (companyId) => {
        setSelectedCompanies((prevSelectedCompanies) => {
            if (prevSelectedCompanies.includes(companyId)) {
                
                return prevSelectedCompanies.filter((id) => id !== companyId);
            } else {
               
                return [...prevSelectedCompanies, companyId];
            }
        });
    };

    const isToday = (date) => {
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };
    const isPast = (date) => date < new Date();


    const resetForm = () => {

        setErrors({});
    };



    const getData = (number) => {
        axios
            .get(
                `${config.APIACTIVATEURL}${config.GETCOMMUNICATION}?pageNumber=${number}&pageSize=${pageSize}`,
                headerConfig
            )
            .then((response) => {
                setLists(response.data.data);
                setPageNumber(response.data.data.pageNumber);
                setPageSize(response.data.data.pageSize);
                setTotalPages(response.data.data.totalPages);
                setData(response.data.data);
                setTotalRecords(response.data.data.totalRecords);
            });
    };

    useEffect(() => {
        getData(pageNumber);
    }, []);

    const renderPageNumbers = [...Array(totalPages)].map((_, index) => {
        const page = index + 1;
        return (
            <li
                className="page-item"
                key={page}
                onClick={() => getData(page)}
            >
                <Link className="page-link">{page}</Link>
            </li>
        );
    });
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
            <div className="row" style={{
                paddingTop: '150px',   // Padding for the top
                paddingLeft: '50px',
                paddingRight: '20px',
            }}> {/* Add padding to the row */}
                <div className="col-xl-12">
                    <div className="card card-height-100">
                        <div className="card-header align-items-center d-flex">
                            <h4 className="card-title mb-0 flex-grow-1">Communications</h4>

                            <button
                                className="btn btn-primary ms-auto"
                                onClick={handleCommunicationPerformed}
                                disabled={selectedCompanies.length === 0} 
                            >
                                Communication Performed
                            </button>
                        </div>

                        {/* Modal */}
                        {showModal && (
                            <div
                                style={{
                                    position: 'fixed',
                                    top: '60%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    background: '#f9f9f9',
                                    border: '4px solid #008080', 
                                    borderRadius: '8px',
                                    width: '400px',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                    zIndex: 1000,
                                    padding: '20px',
                                }}
                            >
                                <div>
                                    <h5>Communication Performed</h5>
                                    <hr />
                                </div>
                                <div style={{ marginBottom: '20px' }}>
                                    {/* Communication Select */}
                                    <div style={{ marginBottom: "10px" }}>
                                        <label htmlFor="communicationSelect" style={{ fontWeight: "bold" }}>
                                            Communication:
                                        </label>
                                        <select
                                            id="communicationSelect"
                                            style={{
                                                width: "100%",
                                                padding: "8px",
                                                marginTop: "5px",
                                                border: "1px solid #ccc",
                                                borderRadius: "4px",
                                            }}
                                            value={selectedCommunication}
                                            onChange={(e) => setSelectedCommunication(e.target.value)}
                                        >
                                            <option value="">Select Communication</option>
                                            {communications.map((comm) => (
                                                <option key={comm.communicationId} value={comm.communicationId}>
                                                    {comm.communicationName}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.selectedCommunication && (
                                            <span style={{ color: "red", fontSize: "12px" }}>{errors.selectedCommunication}</span>
                                        )}
                                    </div>

                                    {/* Flatpickr for Date */}
                                    <div style={{ marginBottom: '10px' }}>
                                        <label htmlFor="updatedDate" style={{ fontWeight: 'bold' }}>Updated Date:</label>
                                        <Flatpickr
                                            id="updatedDate"
                                            value={selectedDate}
                                            onChange={(date) => setSelectedDate(date)}
                                            options={{ dateFormat: 'Y-m-d' }}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                marginTop: '5px',
                                                border: '1px solid #ccc',
                                                borderRadius: '4px',
                                            }}
                                        />
                                        {errors.selectedDate && (
                                            <span style={{ color: "red", fontSize: "12px" }}>{errors.selectedDate}</span>
                                        )}
                                    </div>

                                    {/* Notes Textarea */}
                                    <div>
                                        <label htmlFor="notes" style={{ fontWeight: 'bold' }}>Add Notes:</label>
                                        <textarea
                                            id="notes"
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            rows="4"
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                marginTop: '5px',
                                                border: '1px solid #ccc',
                                                borderRadius: '4px',
                                            }}
                                        ></textarea>
                                        {errors.notes && (
                                            <span style={{ color: "red", fontSize: "12px" }}>{errors.notes}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Footer Buttons */}
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                    <button
                                        style={{
                                            padding: '8px 16px',
                                            background: '#ccc',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                        }}
                                        onClick={handleCloseModal}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        style={{
                                            padding: '8px 16px',
                                            background: '#007bff',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                        }}
                                        onClick={handleModalSubmit}
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>
                        )}


                        {/* Table */}
                        <div className="card-body" style={{ padding: '20px' }}> {/* Add padding to the card-body */}
                            <div className="table-responsive table-card" style={{ padding: '10px' }}> {/* Add padding here */}
                                <table className="table align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th>S.No</th>
                                            <th>Select</th>
                                            <th>Company Name</th>
                                            <th>Last Communication</th>
                                            <th>Next Communication</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lists.length > 0 ? (
                                            lists.map((company, index) => {
                                                // Extract communications for the company
                                                const lastCommunications = company.communications.filter(
                                                    (c) => c.status === true
                                                );
                                                const nextCommunications = company.communications.find(
                                                    (c) => c.status === false
                                                );

                                                return (
                                                    <tr key={company.companyId}>
                                                        <td>{index + 1}</td>
                                                        <td>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedCompanies.includes(company.companyId)}
                                                                onChange={() => handleCheckboxChange(company.companyId)}
                                                            />
                                                        </td>
                                                        <td>{company.companyName}</td>
                                                        <td>
  <style>
    {`
      .tooltip-container {
        position: relative;
        display: block;
        cursor: pointer;
        margin-bottom: 5px;
      }

      .tooltip-description {
        visibility: hidden;
        opacity: 0;
        background-color: yellow;
        color: black;
        border: 1px solid black;
        padding: 5px;
        position: absolute;
        top: -30px; /* Adjust to position above */
        left: 50%; /* Centered horizontally */
        transform: translateX(-50%);
        z-index: 999;
        white-space: nowrap;
        transition: opacity 0.2s ease-in-out;
      }

      .tooltip-container:hover .tooltip-description {
        visibility: visible;
        opacity: 1;
      }
    `}
  </style>
  {lastCommunications.length > 0 ? (
    <>
      {lastCommunications.map((communication, idx) => (
        <div key={idx} className="tooltip-container">
          {/* Display Communication */}
          <span>
            {communication.communicationName} -{" "}
            {moment(communication.scheduledDate).format("DD/MM/YYYY")}
          </span>

          {/* Tooltip for Each Communication */}
          <div className="tooltip-description">
            {communication.description || "No Note"}
          </div>
        </div>
      ))}
    </>
  ) : (
    "No Completed Communications"
  )}
</td>

                                                        <td>
                                                            {nextCommunications ? (
                                                                <>
                                                                    <td>
                                                                        {nextCommunications ? (
                                                                            <>
                                                                                <span
                                                                                    style={{
                                                                                        color: disabledHighlights.includes(nextCommunications.communicationId)
                                                                                            ? "inherit"
                                                                                            : isToday(new Date(nextCommunications.scheduledDate))
                                                                                                ? "yellow"
                                                                                                : isPast(new Date(nextCommunications.scheduledDate))
                                                                                                    ? "red"
                                                                                                    : "inherit",
                                                                                        fontWeight: "bold",
                                                                                    }}
                                                                                >
                                                                                    {nextCommunications.communicationName}
                                                                                </span>{" "}
                                                                                -{" "}
                                                                                {moment(nextCommunications.scheduledDate).format('DD/MM/YYYY')}
                                                                                <br />
                                                                                <span
                                                                                    style={{
                                                                                        color: "blue",
                                                                                        textDecoration: "underline",
                                                                                        cursor: "pointer",
                                                                                    }}
                                                                                    onClick={() => handleDisableHighlight(nextCommunications.communicationId)}
                                                                                >
                                                                                    Disable Highlight
                                                                                </span>
                                                                            </>
                                                                        ) : (
                                                                            "No Upcoming Communication"
                                                                        )}
                                                                    </td>
                                                                </>
                                                            ) : (
                                                                "No Upcoming Communication"
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center">
                                                    No data available
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


