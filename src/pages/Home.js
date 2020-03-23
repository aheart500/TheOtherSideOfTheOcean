import React, { useState, useEffect } from "react";
import "./css/Home.css";
import Logbox from "../components/Logbox";
import axios from "axios";

const Home = () => {
  const [logged, setLogged] = useState(false);
  const [loading, setLoading] = useState(true);
  if (!logged) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "unset";
  }
  const handleLogout = () => {
    axios
      .get("/user/logout")
      .then(response => response.data)
      .then(respone => {
        if (respone.message === "logged out") setLogged(false);
      })
      .catch(err => {
        console.log(err);
      });
  };

  useEffect(() => {
    axios
      .get("/user/logged")
      .then(response => response.data)
      .then(data => {
        if (data.logged === false) {
          setLogged(false);
        } else {
          setLogged(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);
  if (loading) {
    return <h1>Loading...</h1>;
  }
  return (
    <>
      {!logged ? <Logbox /> : null}
      <main>
        <button type="button" className="btn btn-white pulse">
          Return Back
        </button>
        <a href="facebook.com" className="btn btn-black pulse">
          Go There
        </a>
        <button type="button" className="btn btn-red fill">
          Fill Effect
        </button>
        <button
          type="button"
          className="btn btn-gray fill"
          onClick={handleLogout}
        >
          Log out
        </button>
      </main>
    </>
  );
};

export default Home;
