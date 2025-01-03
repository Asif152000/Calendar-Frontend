import config from "../Common/Configurations/APIConfig";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import auth from "../Common/Configurations/Auth";
import { handleSuccess, handleError } from "../Common/Layout/CustomAlerts";
const initialLoginValues = {
  email: "",
  password: "",
  roleName: "STAFF"
};
export default function UserLogin() {
  const navigate = useNavigate();
  const [values, setValues] = useState(initialLoginValues);
  const [errors, setErrors] = useState({});
  const [btnSubmit, setBtnSubmit] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const applicationAPI = (url = config.APIACTIVATEURL + config.LOGINUSER) => {
    return {
      userlogin: (newRecord) => axios.post(url, newRecord),
    };
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const validate = () => {
    let temp = {};
    temp.email = values.email == "" ? false : true;
    temp.password = values.password == "" ? false : true;
    setErrors(temp);
    return Object.values(temp).every((x) => x == true);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        setBtnSubmit(false);
        const formData = new FormData();
        formData.append("email", values.email);
        formData.append("password", values.password);
        formData.append("roleName", values.roleName);
        checkUser(formData);
      } catch (err) {
        setBtnSubmit(true);
        handleError("Please check the mandatory fields");
      }
    } else {
      setBtnSubmit(true);
      handleError("Please check the mandatory fields");
    }
  };
  const checkUser = (loginData) => {
    applicationAPI()
      .userlogin(loginData)
      .then((res) => {
        if (res.data.statusCode === 200) {
          setBtnSubmit(true);
          values.email = "";
          values.password = "";
          console.log(res.data);
          auth.ulogin(() => {
            localStorage.setItem("userId", res.data.userId);
            localStorage.setItem("name", res.data.name);
            localStorage.setItem("roleName", res.data.roleName);
            localStorage.setItem("userToken", res.data.token);
            localStorage.setItem("tokenexpiration", res.data.expiration);
            localStorage.setItem("staffId", res.data.staffId);
            localStorage.setItem("userName", res.data.userName);
            localStorage.setItem("clientId", res.data.clientId);

            console.log(res.data.roleName);
            if (res.data.roleName === "STAFF") {
              navigate("/dashboard");
            } else if (res.data.roleName === "Admin") {
              navigate("/companyManagement");
            } else {
              handleError("Invalid login");
            }
          });
        } else {
          handleError(res.data.data);
          setBtnSubmit(true);
        }
      })
      .catch(function (error) {
        handleError(error);
        setBtnSubmit(true);
      });
  };
  useEffect(() => {
    if (localStorage.getItem("userToken") !== "") {
      if (CheckExpirationTime()) {
        navigate("/companyManagement");
      } else {
        navigate("/userLogin");
      }
    } else {
      navigate("/");
    }
  }, []);
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
  const applyErrorClass = (field) =>
    field in errors && errors[field] == false ? " form-control-danger" : "";
  return (
      <div className="auth-page-wrapper py-5 d-flex justify-content-center align-items-center min-vh-100" style={{ backgroundColor: "#efbff9" }}>
        <div className="auth-page-content overflow-hidden mt-lg-4">
          <div className="container">
            <div className="row">
              <div className="col-lg-5">
                <div className="card overflow-hidden rounded-4 loginbox">
                  <div className="row g-0">
                    <div className="p-lg-5 p-4">
                      <div
                        className="text-primary"
                        style={{ fontSize: "30px", textAlign: "center" }}
                      >
                        USER LOGIN
                      </div>
                      <div className="mt-4">
                        <form
                          onSubmit={handleSubmit}
                          autoComplete="off"
                          noValidate
                        >
                          <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                              User Name
                            </label>
                            <input
                              className={
                                "form-control" + applyErrorClass("email")
                              }
                              name="email"
                              type="text"
                              value={values.email}
                              onChange={handleInputChange}
                              placeholder=" Please Enter User Name"
                            />
                            {errors.email === false ? (
                              <div className="validationerror">
                                Please enter user name
                              </div>
                            ) : (
                              ""
                            )}
                          </div>

                          <div className="mb-3">
                            <label
                              className="form-label"
                              htmlFor="password-input"
                            >
                              Password
                            </label>
                            <div className="position-relative auth-pass-inputgroup ">
                              <input
                                className={
                                  "form-control" + applyErrorClass("password")
                                }
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={values.password}
                                onChange={handleInputChange}
                                placeholder=" Please Enter Password"
                              />
                              {errors.password === false ? (
                                <div className="validationerror">
                                  Please enter password
                                </div>
                              ) : (
                                ""
                              )}
                              <span
                                className="position-absolute"
                                style={{
                                  right: "10px",
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                  cursor: "pointer",
                                }}
                                onClick={togglePasswordVisibility}
                              >
                                {showPassword ? (
                                  <i className="fa fa-eye"></i>
                                ) : (
                                  <i className="fa fa-eye-slash"></i>
                                )}
                              </span>
                            </div>
                          </div>

                          <div className="mt-4">
                            {btnSubmit === true ? (
                              <button
                                type="submit"
                                className="btn btn-success w-100"
                              >
                                Sign In
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="btn btn-primary w-100"
                                disabled
                              >
                                Please wait...
                              </button>
                            )}
                          </div>
                          <div className="mt-2" style={{ textAlign: "center", paddingTop: "40px"}}>
  <Link
    to={"/"}
    style={{
      textDecoration: "none",        // Remove default underline
      borderBottom: "2px solid blue", // Add custom red underline
      fontSize: "15px",              // Optional: adjust font size
      fontWeight: "bold",            // Optional: make the text bold
      color: "blue",                // Optional: adjust font color
    }}
    className="text-accent-1"
  >
    Click Here For Admin Login
  </Link>
</div>

                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <p className="display-4 text-success position-absolute top-50 start-50"></p>
              <p className="display-5 text-success logincaption"></p>
            </div>
          </div>
        </div>
        <footer className="footer">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="text-center d-flex justify-content-center">
                  <p className="mb-0">
                    <i className="mdi mdi-heart text-danger" /> 2024
                  </p>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
  );
}
