import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddMovieList = () => {
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    let isValid = true;

    for (let [name, value] of formData.entries()) {
      if (!value) {
        isValid = false;
        break;
      }
      console.log(`${name}: ${value}`);
    }

    if (isValid) {
      try {
        const response = await axios.post("http://127.0.0.1:3000/add-movie-list", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        });
        console.log("Response:", response.data);
        navigate("/profile");
      } catch (error) {
        console.error("Error adding movie list:", error);
        setError(true);
      }
    } else {
      setError(true);
    }
  };
  return (
    <div className="container" style={{ textAlign: "center" }}>
      <div className="col-md-4 col-md-offset-4">
        <p style={{ color: "white" }}>Add Movie List</p>
        <div className="form-group">
          <form id="form1" onSubmit={handleSubmit} method="post">
            <div className="input-group">
              <input type="text" name="title" placeholder="Title" required className="form-control" style={{ color: "black" }} />
            </div><br/>
            <div className="input-group">
              <textarea name="description" placeholder="Description" required className="form-control" style={{ color: "black" }}></textarea>
            </div><br/>
            <div className="input-group">
              <label style={{ marginRight: "10px", color: "white" }}>Date:</label>
              <input type="date" name="releaseDate" placeholder="mm/dd/yyyy" required className="form-control" style={{ color: "black" }} />
            </div><br/>
            <div className="input-group">
              <input type="text" name="runtime" placeholder="Runtime" required className="form-control" style={{ color: "black" }} />
            </div><br/>
            <div className="input-group">
              <input type="text" name="rating" placeholder="Rating" required className="form-control" style={{ color: "black" }} />
            </div><br/>
            <div className="input-group">
              <input type="text" name="productionCompany" placeholder="Production Company" required className="form-control" style={{ color: "black" }} />
            </div><br/>
            <div className="input-group">
              <input type="text" name="originalLanguage" placeholder="Original Language" required className="form-control" style={{ color: "black" }} />
            </div><br/>
            <div className="row">
              <div className="col">
                <div className="input-group">
                  <input type="text" name="hero" placeholder="Hero" required className="form-control" style={{ color: "black" }} />
                </div><br/>
              </div>
              <div className="col">
                <div className="input-group">
                  <input type="text" name="heroine" placeholder="Heroine" required className="form-control" style={{ color: "black" }} />
                </div><br/>
              </div>
              <div className="col">
                <div className="input-group">
                  <input type="text" name="comedian" placeholder="Comedian" required className="form-control" style={{ color: "black" }} />
                </div><br/>
              </div>
              <div className="col">
                <div className="input-group">
                  <input type="text" name="director" placeholder="Director" required className="form-control" style={{ color: "black" }} />
                </div><br/>
              </div>
              <div className="col">
                <div className="input-group">
                  <input type="text" name="musician" placeholder="Musician" required className="form-control" style={{ color: "black" }} />
                </div><br/>
              </div>
            </div>
            <div className="input-group">
              <input type="file" name="movieImage" required accept=".jpg, .jpeg, .png" className="form-control" style={{ color: "white"}} />
              <span className="placeholder" style={{ color: "white"}}>Movie Image</span>
            </div><br/>
            <div className="input-group">
              <input type="file" name="heroImage" required accept=".jpg, .jpeg, .png" className="form-control" style={{ color: "white"}} />
              <span className="placeholder" style={{ color: "white"}}>Actor Image</span>
            </div><br/>
            <div className="input-group">
              <input type="file" name="heroineImage" required accept=".jpg, .jpeg, .png" className="form-control" style={{ color: "white"}} />
              <span className="placeholder" style={{ color: "white" }}>Heroine Image</span>
            </div><br/>
            <div className="input-group">
              <input type="file" name="directorImage" required accept=".jpg, .jpeg, .png" className="form-control" style={{ color: "white" , paddingLeft: "0" }} />
              <span className="placeholder" style={{ color: "white" }}>Director Image</span>
            </div><br/>
            <div className="input-group">
              <input type="file" name="musicianImage" required accept=".jpg, .jpeg, .png" className="form-control" style={{ color: "white" , paddingLeft: "0" }} />
              <span className="placeholder" style={{ color: "white" }}>Musician Image</span>
            </div><br/>
            <div className="input-group">
              <input type="file" name="comedianImage" required accept=".jpg, .jpeg, .png" className="form-control" style={{ color: "white" , paddingLeft: "0" }} />
              <span className="placeholder" style={{ color: "white" }}>Comedian Image</span>
            </div><br/>
            <div className="input-group">
              <select name="visibility" required className="form-control" style={{ color: "black" }}>
                <option value="">Select Visibility</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div><br/>
            <button type="submit" className="btn btn-success">Add Movie</button>
          </form>
          {error && (
            <div className="alert alert-danger" role="alert" style={{ marginTop: "10px", color: "white" }}>
              Please fill in all fields.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddMovieList;
