import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button, Card, TextField, Typography } from "@mui/material";
import "../styles/CreateBlogs.css";
import CancelIcon from "@mui/icons-material/Cancel";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";

interface UserData {
  id: string;
  // Define other user properties here
}

const CreateBlog = () => {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | undefined>();
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const User = localStorage.getItem("user");
    if (!User) {
      navigate("/login");
    }
    const parseUser = JSON.parse(User ?? "{}");
    setUserData(parseUser);
  }, []);

  const onSubmit = (data: any) => {
    console.log(data);
    if (data.title === "" || data.desc === "") {
      alert("Please enter the details");
    }
    setLoading(true);
    const body = {
      ...data,
      image: imageData,
      userid: userData?.id.toString(),
    };
    // console.log("data", body);
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/api/post`, body, {
        withCredentials: true,
      })
      .then((res) => {
        setLoading(false);
        console.log("Post", res);
        alert("Post created");
        navigate("/");
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        alert("Something went wrong..");
      });
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const size = file?.size ? file.size / 1024 : 0;
    setImageUpload(file ?? null);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = function () {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    }
  };

  const uploadImage = () => {
    if (imageUpload) {
      let formData = new FormData();
      formData.append("image", imageUpload);

      const config = {
        headers: { "content-type": "multipart/form-data" },
        withCredentials: true,
      };

      let url = `${process.env.REACT_APP_BACKEND_URL}/api/upload-image`;

      axios
        .post(url, formData, config)
        .then((res) => {
          setLoading(false);
          console.log("image res", res);
          alert("Image uploaded");
          setImageData(res?.data?.url);
        })
        .catch((error) => {
          setLoading(false);
          alert("An error occurred while uploading the image.");
        });
    }
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
          <div className="form-group">
            <label
              htmlFor="title"
              style={{
                float: "left",
                marginTop: 1,
                marginBottom: 1,
                fontWeight: "bold",
              }}
            >
              Title
            </label>
            <TextField
              sx={{ mb: 1 }}
              id="title"
              variant="outlined"
              fullWidth
              size="small"
              placeholder="Title"
              autoComplete="off"
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
              placeholder="Describe here.."
              {...register("desc", {
                required: true,
              })}
            />
            {errors.desc && errors.desc.type === "required" && (
              <p>Please fill out this field.</p>
            )}

            <label
              htmlFor="banner"
              style={{
                float: "left",
                marginTop: 4,
                marginBottom: 2,
                fontWeight: "bold",
              }}
            >
              Image
            </label>
            <input
              accept="image/*"
              className="hidden"
              id="banner"
              type="file"
              disabled={imageUpload !== null}
              name="image"
              onChange={handleImage}
            />

            <div className="image-upload-container">
              {image ? (
                <img className="uploadImage" src={image} alt="Image" />
              ) : (
                <Typography variant="caption" sx={{ ml: 1, fontSize: "14px" }}>
                  Please upload an image!
                </Typography>
              )}
            </div>
            <Button
              variant="outlined"
              size="small"
              color="error"
              startIcon={<CancelIcon />}
              onClick={() => {
                setImageUpload(null);
                setImage(null);
              }}
              disabled={loading || imageData === ""}
              sx={{ float: "right", textTransform: "unset" }}
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="success"
              startIcon={<CloudUploadRoundedIcon />}
              onClick={uploadImage}
              disabled={loading || imageData === ""}
              sx={{ float: "left", textTransform: "unset", ml: 1 }}
            >
              {loading ? "Loading..." : "Upload Image"}
            </Button>
            <div className="form-group">
              <Button
                variant="contained"
                color="primary"
                fullWidth
                type="submit"
                disabled={loading}
                sx={{ mt: 5, textTransform: "unset" }}
              >
                {loading ? "Loading..." : "Create Post"}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateBlog;
