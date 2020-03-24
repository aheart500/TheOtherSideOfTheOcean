import React, { useState, useEffect } from "react";
import "./css/Home.css";
import Logbox from "../components/Logbox";
import axios from "axios";
import Modal from "../components/Modal";
import Loader from "../components/Loader";

const Home = () => {
  const [logged, setLogged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logoutModal, setLogoutModal] = useState(false);
  if (!logged || logoutModal || loading) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "unset";
  }
  const handleLogout = () => {
    axios
      .get("/user/logout")
      .then(response => response.data)
      .then(respone => {
        if (respone.message === "logged out") {
          setLogoutModal(false);
          setLogged(false);
        }
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
    return <Loader />;
  }
  return (
    <>
      {!logged ? <Logbox /> : null}
      {logoutModal ? (
        <Modal exit={() => setLogoutModal(false)} logout={handleLogout} />
      ) : null}
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
          onClick={() => setLogoutModal(true)}
        >
          Log out
        </button>
      </main>
    </>
  );
};

export default Home;
