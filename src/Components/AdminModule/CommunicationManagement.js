
 import { Link } from "react-router-dom";
 import { useState, useEffect } from "react";
 import axios from "axios";
 import config from "../../Common/Configurations/APIConfig";
 import { handleSuccess, handleError } from "../../Common/Layout/CustomAlerts";
 import LayoutHeader from "../../Common/Layout/Header";
 import LayoutSideBar from "../../Common/Layout/Sidebar";

const initialFieldValues = {
  communicationId: "00000000-0000-0000-0000-000000000000",
  communicationName: "",
  description: "",
  sequence: "",
  mandatory: ""
  
};
export default function CommunicationManagement() {
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
    temp.communicationName = values.communicationName === "" ? false : true;
    temp.description = values.description === "" ? false : true;
    temp.sequence = values.sequence === "" ? false : true;
    temp.mandatory = values.mandatory === "" ? false : true;
    setErrors(temp);
    return Object.values(temp).every((x) => x === true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setBtnSubmit(false);
      const payload = {
        communicationId: values.communicationId,
        communicationName: values.communicationName,
        description: values.description, // Corrected typo here
        sequence: values.sequence,
        mandatory: values.mandatory,
      };
      addOrEdit(payload);
    }
  };
  
  const applicationAPI = () => {
    return {
      create: (newrecord) =>
        axios.post(config.APIACTIVATEURL + config.CREATECOMMUNICATIONMANAGEMENT, newrecord, {
          ...headerconfig,
        }),
      update: (updateRecord) =>
        axios.put(config.APIACTIVATEURL + config.UPDATECOMMUNICATIONMANAGEMENT, updateRecord, {
          ...headerconfig,
        }),
    };
  };
  const addOrEdit = (payload) => {
    if (payload.communicationId === "00000000-0000-0000-0000-000000000000") {
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
        .delete(config.APIACTIVATEURL + config.DELETECOMMUNICATIONMANAGEMENT + "/" + id, {
          ...headerconfig,
        })
        .then((response) => {
          if (response.data.statusCode === 200) {
            handleSuccess(response.data.data);
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
          config.GETALLCOMMUNICATIONMANAGEMENT +
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
    <div id="layout-wrapper"  style={{ backgroundColor: "#efbff9" }}>
      <LayoutHeader />
      <LayoutSideBar />
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                  <h4 className="mb-sm-0">Communication Management</h4>
                </div>
              </div>
            </div>
            <div className="alert alert-success">
              <form onSubmit={handleSubmit} autoComplete="off" noValidate>
                <div className="row">
                  <div className="col-lg-3">
                    <div className="mb-3">
                      <label htmlFor="communicationName" className="form-label">
                      Communication Name 
                      </label>
                      <input
                        type="text"
                        value={values.communicationName}
                        name="communicationName"
                        onChange={handleInputChange}
                        className={
                          "form-control" + applyErrorClass("communicationName")
                        }
                        placeholder="Please Enter Communication Name"
                      />
                      {errors.communicationName === false && (
                        <div className="validationerror">
                          Please enter communication name
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">
                      Description
                      </label>
                      <input
                        type="text"
                        value={values.description}
                        name="description"
                        onChange={handleInputChange}
                        className={
                          "form-control" + applyErrorClass("description")
                        }
                        placeholder="Please Enter Description"
                      />
                      {errors.description === false && (
                        <div className="validationerror">
                          Please enter description
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="mb-3">
                      <label htmlFor="sequence" className="form-label">
                      sequence
                      </label>
                      <input
                        type="text"
                        value={values.sequence}
                        name="sequence"
                        onChange={handleInputChange}
                        className={
                          "form-control" + applyErrorClass("sequence")
                        }
                        placeholder="Please Enter Sequence(ex: 1,2..)"
                      />
                      {errors.sequence === false && (
                        <div className="validationerror">
                          Please enter sequence
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-lg-3">
  <div className="mb-3">
    <label htmlFor="mandatory" className="form-label">
      Mandatory
    </label>
    <select
      value={values.mandatory}
      name="mandatory"
      onChange={(e) =>
        setValues({ ...values, mandatory: e.target.value === "true" })
      }
      className={"form-control" + applyErrorClass("mandatory")}
    >
      <option value="">Select</option>
      <option value="true">Yes</option>
      <option value="false">No</option>
    </select>
    {errors.mandatory === false && (
      <div className="validationerror">Please select an option</div>
    )}
  </div>
</div>

                  
                  
                  <div className="col-lg-3">
                    <div className="hstack gap-2 justify-content-end mb-3 mt-4">
                      {btnSubmit === true ? (
                        <button type="submit" className="btn btn-primary w-100">
                          {values.communicationId ===
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
                    <h4 className="card-title mb-0 flex-grow-1">Communications</h4>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive table-card">
                      <table className="table align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>S.No</th>
                            <th>Communication</th>
                            <th>Description</th>
                            <th>Sequence</th>
                            <th>Mandatory</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lists.length > 0 &&
                            lists.map((v, index) => (
                              <tr key={v.communicationId}>
                                <td>{index + 1}</td>
                                <td>{v.communicationName}</td>
                                <td>{v.description}</td>
                                <td>{v.sequence}</td>
                                <td>{v.mandatory ? "Yes" : "No"}</td>
                                
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
                                        onClick={(e) => onDelete(e, v.communicationId)}
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