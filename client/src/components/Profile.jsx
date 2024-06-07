import React from "react";

const Profile = () => {
  const styles = {
    color: 'white',
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '18px'
  };

  const headingStyle = {
    color: 'white'
  };

  return (
    <div style={styles}>
      <h1 style={headingStyle}>Movie Lists</h1>
      <p>No movie lists found</p>
    </div>
  );
};

export default Profile;
