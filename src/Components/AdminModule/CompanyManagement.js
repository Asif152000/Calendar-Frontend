
 import { Link } from "react-router-dom";
 import { useState, useEffect } from "react";
 import axios from "axios";
 import config from "../../Common/Configurations/APIConfig";
 import { handleSuccess, handleError } from "../../Common/Layout/CustomAlerts";
 import LayoutHeader from "../../Common/Layout/Header";
 import LayoutSideBar from "../../Common/Layout/Sidebar";

const initialFieldValues = {
  companyId: "00000000-0000-0000-0000-000000000000",
  companyName: "",
  location: "",
  linkedInProfile: "",
  emails: "",
  phoneNumbers: "",
  comments: "",
  communicationPeriodicity: ""
};
export default function CompanyManagement() {
  const [lists, setLists] = useState([]);
  const [values, setValues] = useState(initialFieldValues);
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [errors, setErrors] = useState({});
  const [btnSubmit, setBtnSubmit] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [pageNumber, setPageNumber] = useState(1);
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedClient, setSelectedClient] = useState(null);
  const [emailFields, setEmailFields] = useState([""]); // Manage dynamic email inputs
  const [phoneFields, setPhoneFields] = useState([""]); // Manage dynamic phone inputs
  
  
  const headerconfig = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("userToken"),
      "Content-Type": "application/json", // For JSON requests
    },
  };
  
  useEffect(() => {
    if (recordForEdit !== null) {
      setValues(recordForEdit);
    }
  }, [recordForEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };
  const validate = () => {
    let temp = {};
    temp.companyName = values.companyName === "" ? false : true;
    temp.location = values.location === "" ? false : true;
    temp.linkedInProfile = values.linkedInProfile === "" ? false : true;
    temp.emails = values.emails === "" ? false : true;
    temp.phoneNumbers = values.phoneNumbers === "" ? false : true;
    temp.comments = values.comments === "" ? false : true;
    temp.communicationPeriodicity = values.communicationPeriodicity === "" ? false : true;
    setErrors(temp);
    return Object.values(temp).every((x) => x === true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setBtnSubmit(false);
      const payload = {
        companyId: values.companyId,
        companyName: values.companyName,
        location: values.location, // Corrected typo here
        linkedInProfile: values.linkedInProfile,
        emails: values.emails,
        phoneNumbers: values.phoneNumbers,
        comments: values.comments,
        communicationPeriodicity: values.communicationPeriodicity,
      };
      addOrEdit(payload);
    }
  };
  
  const applicationAPI = () => {
    return {
      create: (newrecord) =>
        axios.post(config.APIACTIVATEURL + config.CREATECOMPANYMANAGEMENT, newrecord, {
          ...headerconfig,
        }),
      update: (updateRecord) =>
        axios.put(config.APIACTIVATEURL + config.UPDATECOMPANYMANAGEMENT, updateRecord, {
          ...headerconfig,
        }),
    };
  };
  const addOrEdit = (payload) => {
    if (payload.companyId === "00000000-0000-0000-0000-000000000000") {
      applicationAPI()
        .create(payload)  // Send as JSON, not FormData
        .then((res) => {
          if (res.data.statusCode === 200) {
            handleSuccess("Record Created");
            resetForm();
            GetData(pageNumber);
            setBtnSubmit(true);
          } else {
            handleError(res.data.message);
            setBtnSubmit(true);
          }
        })
        .catch(function (error) {
          handleError("Error in saving data");
          setBtnSubmit(true);
        });
    } else {
      applicationAPI()
        .update(payload)  // Send as JSON, not FormData
        .then((res) => {
          if (res.data.statusCode === 200) {
            handleSuccess("Record Updated");
            resetForm();
            GetData(pageNumber);
            setBtnSubmit(true);
          } else {
            handleError(res.data.message);
            setBtnSubmit(true);
          }
        })
        .catch(function (error) {
          handleError("Error in updating data");
          setBtnSubmit(true);
        });
    }
  };
  
  const resetForm = () => {
    setValues(initialFieldValues);
    setErrors({});
  };
  const showEditDetails = (data) => {
    setRecordForEdit(data);
  };
  const GetLastPageData = () => {
    GetData(totalPages);
  };
  const GetFirstPageData = () => {
    GetData("1");
  };
  const GetPageData = (number) => {
    setPageNumber(number);
    if (pageNumber !== number) GetData(number);
  };
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  const renderPageNumbers = pageNumbers.map((number) => {
    return (
      <li
        className="page-item"
        key={number}
        id={number}
        onClick={() => GetPageData(number)}
      >
        <Link className="page-link">{number}</Link>
      </li>
    );
  });
  
  const onDelete = (e, id) => {
    if (window.confirm("Are you sure to delete this record?")) {
      axios
        .delete(config.APIACTIVATEURL + config.DELETECOMPANYMANAGEMENT + "/" + id, {
          ...headerconfig,
        })
        .then((response) => {
          if (response.data.statusCode === 200) {
            handleSuccess(response.data.data);
            GetData(pageNumber);
            resetForm();
          } else if (response.data.statusCode === 500) {
            // Custom message for status code 500
            handleError("Add communications and sequence");
            GetData(pageNumber);
            resetForm();
          } else {
            handleError(response.data.data);
            GetData(pageNumber);
            resetForm();
          }
        });
        
    }
  };
  const GetData = (number) => {
    axios
      .get(
        config.APIACTIVATEURL +
          config.GETALLCOMPANYMANAGEMENT +
          "?pageNumber=" +
          number +
          "&pageSize=" +
          pageSize,
        { ...headerconfig }
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
  const applyErrorClass = (field) =>
    field in errors && errors[field] === false ? " form-control-danger" : "";
  useEffect(() => {
    GetData(pageNumber);
  }, []);
  return (
    <div id="layout-wrapper" style={{ backgroundColor: "#efbff9" }}>
      <LayoutHeader />
      <LayoutSideBar />
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                  <h4 className="mb-sm-0">Company Managements</h4>
                </div>
              </div>
            </div>
            <div className="alert alert-success">
              <form onSubmit={handleSubmit} autoComplete="off" noValidate>
                <div className="row">
                  <div className="col-lg-3">
                    <div className="mb-3">
                      <label htmlFor="companyName" className="form-label">
                        Company Name 
                      </label>
                      <input
                        type="text"
                        value={values.companyName}
                        name="companyName"
                        onChange={handleInputChange}
                        className={
                          "form-control" + applyErrorClass("companyName")
                        }
                        placeholder="Please Enter Company Name "
                      />
                      {errors.companyName === false && (
                        <div className="validationerror">
                          Please enter company name
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="mb-3">
                      <label htmlFor="location" className="form-label">
                        Location
                      </label>
                      <input
                        type="text"
                        value={values.location}
                        name="location"
                        onChange={handleInputChange}
                        className={
                          "form-control" + applyErrorClass("location")
                        }
                        placeholder="Please Enter Location"
                      />
                      {errors.location === false && (
                        <div className="validationerror">
                          Please enter location
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="mb-3">
                      <label htmlFor="linkedInProfile" className="form-label">
                        LinkedIn Profile
                      </label>
                      <input
                        type="text"
                        value={values.linkedInProfile}
                        name="linkedInProfile"
                        onChange={handleInputChange}
                        className={
                          "form-control" + applyErrorClass("linkedInProfile")
                        }
                        placeholder="Please Enter linkedIn Profile"
                      />
                      {errors.linkedInProfile === false && (
                        <div className="validationerror">
                          Please enter linkedIn Profile
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="mb-3">
                      <label htmlFor="emails" className="form-label">
                        Emails
                      </label>
                      <input
                        type="text"
                        value={values.emails}
                        name="emails"
                        onChange={handleInputChange}
                        className={"form-control" + applyErrorClass("emails")}
                        placeholder="Please Enter Email"
                      />
                      {errors.emails === false && (
                        <div className="validationerror">
                          Please enter email
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="mb-3">
                      <label htmlFor="phoneNumbers" className="form-label">
                        Phone Numbers
                      </label>
                      <input
                        type="text"
                        value={values.phoneNumbers}
                        name="phoneNumbers"
                        onChange={handleInputChange}
                        className={
                          "form-control" + applyErrorClass("phoneNumbers")
                        }
                        placeholder="Please Enter Phone Number"
                      />
                      {errors.phoneNumbers === false && (
                        <div className="validationerror">
                          Please enter phone number
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label htmlFor="comments" className="form-label">
                        Comments
                      </label>
                      <input
                        type="text"
                        value={values.comments}
                        name="comments"
                        onChange={handleInputChange}
                        className={"form-control" + applyErrorClass("commments")}
                        placeholder="Please Enter Comments"
                      />
                      {errors.comments === false && (
                        <div className="validationerror">
                          Please enter Comments
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-6">
                  <div className="mb-3">
  <label htmlFor="communicationPeriodicity" className="form-label">
    Communication Periodicity
  </label>
  <select
    value={values.communicationPeriodicity}
    name="communicationPeriodicity"
    onChange={handleInputChange}
    className={"form-control" + applyErrorClass("communicationPeriodicity")}
  >
    <option value="">Please Select Periodicity</option>
    <option value="1">Every 1 Week</option>
    <option value="2">Every 2 Weeks</option>
    <option value="3">Every 3 Weeks</option>
    <option value="4">Every 4 Weeks</option>
    <option value="5">Every 5 Weeks</option>
  </select>
  {errors.communicationPeriodicity === false && (
    <div className="validationerror">
      Please select a periodicity
    </div>
  )}
</div>

                  </div>
                  
                  <div className="col-lg-3">
                    <div className="hstack gap-2 justify-content-end mb-3 mt-4">
                      {btnSubmit === true ? (
                        <button type="submit" className="btn btn-primary w-100">
                          {values.companyId ===
                          "00000000-0000-0000-0000-000000000000"
                            ? "Submit"
                            : "Update"}
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="btn btn-primary w-100"
                          disabled
                        >
                          Please wait...
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn btn-danger w-100"
                        onClick={resetForm}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="row">
              <div className="col-xl-12">
                <div className="card card-height-100">
              
                  <div className="card-header align-items-center d-flex">
                    <h4 className="card-title mb-0 flex-grow-1">Companys</h4>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive table-card">
                      <table className="table align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>S.No</th>
                            <th>Company Name</th>
                            <th>Location</th>
                            <th>linkedInProfile</th>
                            <th>Emails</th>
                            <th>Phone Numbers</th>
                            <th>Comments</th>
                            <th>Communication Periodicity</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lists.length > 0 &&
                            lists.map((v, index) => (
                              <tr key={v.companyId}>
                                <td>{index + 1}</td>
                                <td>{v.companyName}</td>
                                <td>{v.location}</td>
                                <td>
  <a
    href={v.linkedInProfile}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      textDecoration: 'underline', 
      color: 'blue',               
      borderBottom: '1px solid blue', 
      paddingBottom: '2px'       
    }}
  >
    {v.linkedInProfile}
  </a>
</td>

                                <td>{v.emails}</td>
                                <td>{v.phoneNumbers}</td>
                                <td>{v.comments}</td>
                                <td>{`Every ${v.communicationPeriodicity} ${v.communicationPeriodicity > 1 ? "Weeks" : "Week"}`}</td>
                                <td>
                                  <ul className="list-inline hstack gap-2 mb-0">

                                    <li>
                                      <Link
                                        className="edit-item-btn"
                                        onClick={() => showEditDetails(v)}
                                      >
                                        <i className="ri-pencil-fill text-muted" />
                                      </Link>
                                    </li>

                                    <li>
                                      <Link
                                        className="remove-item-btn"
                                        onClick={(e) => onDelete(e, v.companyId)}
                                      >
                                        <i className="ri-delete-bin-fill text-muted" />
                                      </Link>
                                    </li>
                                  </ul>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="align-items-center mt-4 pt-2 justify-content-between d-flex">
                      <div className="flex-shrink-0">
                        <div className="text-muted">
                          Showing{" "}
                          <span className="fw-semibold">{lists.length}</span> of{" "}
                          <span className="fw-semibold">{totalRecords}</span>{" "}
                          Results
                        </div>
                      </div>
                      <ul className="pagination pagination-separated pagination-sm mb-0">
                        <li
                          className={
                            "page-item" + data.previousPage === null
                              ? "disabled"
                              : ""
                          }
                          onClick={() => GetFirstPageData()}
                        >
                          <Link className="page-link">Previous</Link>
                        </li>
                        {renderPageNumbers}
                        <li
                          className={
                            "page-item" + data.nextPage === null
                              ? "disabled"
                              : ""
                          }
                          onClick={() => GetLastPageData()}
                        >
                          <Link className="page-link">Next</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}