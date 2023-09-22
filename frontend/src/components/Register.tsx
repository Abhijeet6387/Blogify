import { useState } from "react";
import "../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);
    if (
      firstName === "" ||
      lastName === "" ||
      email === "" ||
      password === "" ||
      contact === ""
    ) {
      alert("Please fill all the details and try again!");
    } else {
      console.log(firstName, lastName, email, password, contact);
      await axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/api/register`, {
          firstname: firstName,
          lastname: lastName,
          email: email,
          password: password,
          contact: contact,
        })
        .then((res) => {
          setLoading(false);
          console.log(res);
          localStorage.setItem("user", JSON.stringify(res?.data?.user));
          alert(res?.data?.message);
          navigate("/login");
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    }
  };
  return (
    <div className="commonbg">
      <div className="form-container">
        <h2>Blogify Register</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            onChange={(e) => setFirstName(e.target.value)}
            margin="normal"
            size="small"
          />
          <TextField
            label="Last Name"
            variant="outlined"
            fullWidth
            onChange={(e) => setLastName(e.target.value)}
            margin="normal"
            size="small"
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            size="small"
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            size="small"
          />
          <TextField
            label="Contact"
            variant="outlined"
            fullWidth
            onChange={(e) => setContact(e.target.value)}
            margin="normal"
            size="small"
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            disabled={loading ? true : false}
            sx={{ textTransform: "unset", marginTop: 3, marginBottom: 1 }}
          >
            {loading ? "Loading.." : "Register"}
          </Button>
          <p>
            Already registered?
            <Link style={{ color: "#1976D2" }} to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
