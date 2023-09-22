import "../styles/Login.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    if (email === "" || password === "") {
      alert("Please fill all the details and try again!");
    } else {
      console.log("Email: ", email, "Password: ", password);
      axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/api/login`,
          {
            email: email,
            password: password,
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          setLoading(false);
          console.log(res);
          alert(res?.data?.message);
          localStorage.setItem("user", JSON.stringify(res?.data?.user));
          navigate("/");
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
        <h2>Blogify Login</h2>
        <form onSubmit={handleSubmit}>
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
          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            disabled={loading ? true : false}
            sx={{ textTransform: "unset", marginTop: 3, marginBottom: 1 }}
          >
            {loading ? "Loading.." : "Login"}
          </Button>
          <p>
            Don't have an account?
            <Link style={{ color: "#1976D2" }} to="/register">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
