import React, { useState, useEffect } from "react";
import { Link, useLocation} from "react-router-dom";
import Logo from "../images/logo.jpg";
import axios from "axios";

const Navbar = () => {
  const [username, setUsername] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Extract username from URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const usernameFromQuery = queryParams.get('username');
    
    if (usernameFromQuery) {
      setUsername(usernameFromQuery);
    } else {
      // Fetch username from backend upon component mount if not in query parameters
      axios.get('https://movie-db-fhe1.onrender.com/login', { withCredentials: true })
        .then(response => {
          if (response.data.username) {
            setUsername(response.data.username);
          }
        })
        .catch(error => {
          console.error("Error fetching username:", error);
        });
    }
  }, [location.search]);

  const handleLogout = () => {
    axios.get('https://movie-db-steel-eight.vercel.app/?username=Sriharshini', { withCredentials: true })
      .then(() => {
        setUsername(null);
        window.location.href = 'https://movie-db-steel-eight.vercel.app/';
      })
      .catch(error => {
        console.error("Error logging out:", error);
      });
  };  

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const styles = {
    nav: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px',
    },
    logo: {
      height: '50px', // Adjust based on your logo size
    },
    title: {
      flex: 1,
      textAlign: 'center',
    },
    loginContainer: {
      backgroundColor: 'yellow',
      color: 'black',
      padding: '10px 20px',
      borderRadius: '5px',
      textDecoration: 'none',
    },
    usernameContainer: {
      position: 'relative',
      display: 'flex', // Add this to make children elements display side by side
      alignItems: 'center', // Add this for vertical alignment
    },
    dropdown: {
      position: 'absolute',
      top: '100%',
      right: 0,
      backgroundColor: '#fff',
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
      borderRadius: '5px',
      padding: '20px',
      display: showDropdown ? 'block' : 'none',
    },
    dropdownItem: {
      padding: '5px 0',
      cursor: 'pointer',
      color: 'black', 
      display: 'block',
    },
    usernameBox: {
      backgroundColor: '#fff',
      color: '#333',
      padding: '10px 20px',
      borderRadius: '5px',
      marginRight: '10px',
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
      cursor: 'pointer', // Add this to make it look clickable
    },
    logoutButton: {
      backgroundColor: '#d9534f',
      color: 'white',
      padding: '10px 20px',
      borderRadius: '5px',
      border: 'none',
      cursor: 'pointer',
    },
  };

  return (
    <nav style={styles.nav}>
      <img className="logo" src={Logo} alt="Logo" style={styles.logo}></img>
      <h1 className="title" style={styles.title}>
        <Link to="/">Movie DB</Link>
      </h1>
      {username ? (
        <div style={styles.usernameContainer}>
          <div style={styles.usernameBox} onClick={toggleDropdown}>
            Welcome, {username}!
          </div>
          <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
        </div>
      ) : (
        <a href="https://movie-db-fhe1.onrender.com/login" style={styles.loginContainer}>Login</a>
      )}
    </nav>
  );
};

export default Navbar;
