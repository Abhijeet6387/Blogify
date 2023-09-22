import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { TextField, Button, Card, Typography, IconButton } from "@mui/material";
import "../styles/EditPost.css";
import UpdateIcon from "@mui/icons-material/Update";
import CloseIcon from "@mui/icons-material/Close";

interface UserData {
  id: string;
  // Define other user properties here
}

const EditBlogPost = () => {
  const [singlePost, setSinglePost] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const singleBlog = () => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/allposts/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setSinglePost(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const User = localStorage.getItem("user");
    if (!User) {
      navigate("/login");
    }
    const parseUser = JSON.parse(User ?? "{}");
    setUserData(parseUser);
    singleBlog();
  }, []);

  const onSubmit = (data: any) => {
    setLoading(true);
    const body = {
      ...data,
      image: singlePost?.image,
      userid: userData?.id.toString(),
    };
    axios
      .put(
        `${process.env.REACT_APP_BACKEND_URL}/api/allposts/${id}/update`,
        { ...body },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res?.data);
        setLoading(false);
        navigate("/dashboard");
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <div className="container">
      <Card
        sx={{
          padding: "15px 45px 15px 25px",
          overflowY: "auto",
          marginTop: -8,
          height: "70vh",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <IconButton
            aria-label="Close"
            onClick={() => navigate("/dashboard")}
            sx={{ position: "relative", float: "right" }}
          >
            <CloseIcon />
          </IconButton>

          <div className="form-group">
            <label
              htmlFor="title"
              style={{
                float: "left",
                marginTop: 3,
                marginBottom: 1,
                fontWeight: "bold",
              }}
            >
              Title
            </label>
            <TextField
              id="title"
              variant="outlined"
              fullWidth
              size="small"
              defaultValue={singlePost?.title}
              placeholder={singlePost?.title}
              {...register("title", {
                required: true,
              })}
            />
            {errors.title && errors.title.type === "required" && (
              <p>Please fill out this field.</p>
            )}
            <label
              htmlFor="desc"
              style={{
                float: "left",
                marginTop: 2,
                fontWeight: "bold",
              }}
            >
              Description
            </label>
            <TextField
              id="desc"
              multiline
              minRows={8}
              style={{ height: "40%", overflow: "auto" }}
              fullWidth
              defaultValue={singlePost?.desc}
              placeholder="Update your description"
              {...register("desc", {
                required: true,
              })}
            />
            {errors.desc && errors.desc.type === "required" && (
              <p>Please fill out this field.</p>
            )}

            <div className="image-upload-container">
              {singlePost?.image ? (
                <img
                  className="uploadImage"
                  src={singlePost?.image}
                  alt="Image"
                />
              ) : (
                <Typography variant="caption" sx={{ ml: 1, fontSize: "14px" }}>
                  No Image Found
                </Typography>
              )}
            </div>

            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              startIcon={<UpdateIcon />}
              disabled={loading}
              sx={{ mt: 5, textTransform: "unset" }}
            >
              {loading ? "Loading" : "Update Post"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default EditBlogPost;
