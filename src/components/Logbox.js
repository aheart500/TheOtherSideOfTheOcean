import React, { useState, useReducer } from "react";
import { FaFacebook, FaGooglePlusG } from "react-icons/fa";
import icon from "../images/icon-mini.png";
import CountrySelect from "./CountrySelect";
import axios from "axios";

const intialForm = {
  email: "",
  password: "",
  password2: "",
  name: "",
  gender: "",
  country: "",
  emailError: "",
  passwordError: "",
  password2Error: "",
  nameError: "",
  genderError: "",
  countryError: ""
};

const formReducer = (state, action) => {
  switch (action.type) {
    case "input":
      return {
        ...state,
        [action.field]: action.value
      };
    case "error":
      return {
        ...state,
        [action.field]: action.message
      };
    case "clearErrors":
      return {
        ...state,
        emailError: "",
        passwordError: "",
        password2Error: "",
        nameError: "",
        genderError: "",
        countryError: ""
      };
    case "clear":
      return intialForm;

    default:
      return state;
  }
};

const Logbox = () => {
  const [form, setForm] = useState("chooseForm");
  const [formState, dispatchForm] = useReducer(formReducer, intialForm);
  const {
    email,
    password,
    password2,
    name,
    gender,
    country,
    emailError,
    passwordError,
    password2Error,
    nameError,
    genderError,
    countryError
  } = formState;
  const handleChangeForm = form => {
    if (form !== "signupForm2") {
      dispatchForm({ type: "clear" });
    }
    setForm(form);
  };
  const handleInput = e => {
    dispatchForm({
      type: "input",
      field: e.target.name,
      value: e.target.value
    });
  };

  const formValidation = () => {
    dispatchForm({ type: "clearErrors" });
    if (email === "") {
      dispatchForm({
        type: "error",
        field: "emailError",
        message: "Email should't be empty"
      });
      return true;
    }
    if (email.length < 10 || !/@/.test(email)) {
      dispatchForm({
        type: "error",
        field: "emailError",
        message: "Hmm.. That doesn't look like an email address"
      });

      return true;
    }
    if (password.length < 8) {
      dispatchForm({
        type: "error",
        field: "passwordError",
        message: "Password should be at least 8 characters long"
      });
      return true;
    }
    return false;
  };
  const handelEnter = (e, trigger) => {
    if (e.keyCode === 13) {
      if (trigger === "login") return handleLogin();
      if (trigger === "signup1") return handleSignup1();
      if (trigger === "signup") return handleSignup();
      return;
    }
  };
  const handleLogin = () => {
    if (formValidation()) return;
    axios
      .post("/user/login", { email, password })
      .then(response => response.data)
      .then(response => {
        if (response.message === "Incorrect password.") {
          return dispatchForm({
            type: "error",
            field: "passwordError",
            message: "Incorrect password"
          });
        }
        if (response.message === "Incorrect username.") {
          return dispatchForm({
            type: "error",
            field: "emailError",
            message: "Incorrect email address"
          });
        }
        window.location.reload();
      })
      .catch(err => {
        console.log(err);
      });
  };
  const handleSignup1 = () => {
    if (formValidation()) return;
    if (password2 !== password) {
      return dispatchForm({
        type: "error",
        field: "password2Error",
        message: "Passwords should be identical"
      });
    }
    setForm("signupForm2");
  };

  const handleSignup = () => {
    dispatchForm({ type: "clearErrors" });
    if (name === "") {
      return dispatchForm({
        type: "error",
        field: "nameError",
        message: "The name field should't be empty"
      });
    }
    if (gender === "") {
      return dispatchForm({
        type: "error",
        field: "genderError",
        message: "You should provide a gender"
      });
    }
    if (country === "") {
      return dispatchForm({
        type: "error",
        field: "countryError",
        message: "You should provide a country"
      });
    }
    axios
      .post("/user/register", {
        email,
        password,
        gender,
        country,
        name
      })
      .then(response => {
        if (response.data.message === "success") {
          return window.location.reload();
        }
        console.log(response);
      })
      .catch(err => {
        console.log(err);
      });
  };
  const handleFacebookLogin = () => {
    axios
      .get("/user/login/facebook", {
        headers: {
          "Allow-Control-Access-origin": "*"
        }
      })
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        console.log(err);
      });
  };
  const handleGoogleLogin = () => {
    console.log("logged by google");
  };
  const ThirdParty = () => {
    return (
      <>
        <h3>OR</h3>
        <button
          type="button"
          className="btn btn-facebook btn-social fill"
          onClick={handleFacebookLogin}
        >
          <FaFacebook />
          Continue with Facebook
        </button>
        <button
          type="button"
          className="btn btn-gray btn-social btn-darkend fill"
          onClick={handleGoogleLogin}
        >
          <FaGooglePlusG />
          Continue with Google
        </button>
      </>
    );
  };

  return (
    <div className="log-box-container">
      <div className="log-box">
        <img src={icon} alt="icon" title="The other side of the ocean" />
        <h1>Welcome to our Gallery</h1>
        {form === "chooseForm" && (
          <>
            <p>Share your art</p>
            <button
              type="button"
              className="btn btn-red fill"
              onClick={() => handleChangeForm("loginForm")}
            >
              Log in
            </button>
            <button
              type="button"
              className="btn btn-gray btn-darkend fill"
              onClick={() => handleChangeForm("signupForm")}
            >
              Sign up
            </button>
          </>
        )}
        {form === "loginForm" && (
          <>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={handleInput}
              onKeyDown={e => handelEnter(e, "login")}
            />
            {emailError && <p className="error-text">{emailError}</p>}
            <input
              type="password"
              placeholder="Password"
              value={password}
              name="password"
              onChange={handleInput}
              onKeyDown={e => handelEnter(e, "login")}
            />
            {passwordError && <p className="error-text">{passwordError}</p>}
            <h4 className="started">Forgot your password?</h4>
            <button
              type="button"
              className="btn btn-red fill"
              onClick={handleLogin}
            >
              Log in
            </button>
            <button
              type="button"
              className="btn btn-gray fill absoluted"
              onClick={() => handleChangeForm("signupForm")}
            >
              Sign up
            </button>
            <ThirdParty />
            <span>
              By continuing, you agree to Our Terms of Service, Privacy Policy
            </span>
            <hr />
            <h5 onClick={() => handleChangeForm("signupForm")}>
              New here? Sign up
            </h5>
          </>
        )}
        {form === "signupForm" && (
          <>
            <p>Share your art</p>
            <input
              type="email"
              placeholder="Email"
              value={email}
              name="email"
              onChange={handleInput}
              onKeyDown={e => handelEnter(e, "signup1")}
            />
            {emailError && <p className="error-text">{emailError}</p>}
            <input
              type="password"
              placeholder="Password"
              value={password}
              name="password"
              onChange={handleInput}
              onKeyDown={e => handelEnter(e, "signup1")}
            />
            {passwordError && <p className="error-text">{passwordError}</p>}
            <input
              type="password"
              placeholder="Confirm password"
              value={password2}
              name="password2"
              onChange={handleInput}
              onKeyDown={e => handelEnter(e, "signup1")}
            />
            {password2Error && <p className="error-text">{password2Error}</p>}
            <button
              type="button"
              className="btn btn-red fill"
              onClick={handleSignup1}
            >
              Continue
            </button>
            <button
              type="button"
              className="btn btn-gray fill absoluted"
              onClick={() => handleChangeForm("loginForm")}
            >
              Log in
            </button>
            <ThirdParty />
            <span>
              By continuing, you agree to Our Terms of Service, Privacy Policy
            </span>
            <hr />
            <h5 onClick={() => handleChangeForm("loginForm")}>
              Already a member? Log in
            </h5>
          </>
        )}
        {form === "signupForm2" && (
          <>
            <p>Share your art</p>
            <input
              type="text"
              name="name"
              value={name}
              placeholder="Your name"
              onChange={handleInput}
              onKeyDown={e => handelEnter(e, "signup")}
            />
            {nameError && <p className="error-text">{nameError}</p>}
            <div
              className="gender-box"
              onKeyDown={e => handelEnter(e, "signup")}
            >
              <p>You're a ..</p>
              <div className="row">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  id="male"
                  onChange={handleInput}
                />
                <label htmlFor="male">Male</label>
              </div>
              <div className="row">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  id="female"
                  onChange={handleInput}
                />
                <label htmlFor="female">Female</label>
              </div>
            </div>
            {genderError && <p className="error-text">{genderError}</p>}
            <CountrySelect
              setCountry={e => {
                dispatchForm({
                  type: "input",
                  field: "country",
                  value: e.target.value
                });
              }}
              onKeyDown={e => handelEnter(e, "signup")}
            />
            {countryError && <p className="error-text">{countryError}</p>}
            <button
              type="button"
              className="btn btn-red fill"
              onClick={handleSignup}
            >
              Sign up
            </button>
            <button
              type="button"
              className="btn btn-gray fill absoluted"
              onClick={() => handleChangeForm("loginForm")}
            >
              Log in
            </button>
            <span>
              By continuing, you agree to Our Terms of Service, Privacy Policy
            </span>
            <hr />
            <h5 onClick={() => handleChangeForm("loginForm")}>
              Already a member? Log in
            </h5>
          </>
        )}
      </div>
    </div>
  );
};

export default Logbox;
