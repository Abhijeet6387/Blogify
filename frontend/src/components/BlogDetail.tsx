import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import axios from "axios";
import "../styles/BlogDetail.css";

const BlogDetail = () => {
  const navigate = useNavigate();
  const [singlePost, setSinglePost] = useState<any>();
  const { id } = useParams();

  useEffect(() => {
    const User = localStorage.getItem("user");
    if (!User) {
      navigate("/login");
    }
  }, []);

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
    singleBlog();
  }, []);

  console.log(singlePost);
  return (
    <div className="blog-detail-container">
      <Container>
        <Card sx={{ height: "80vh", overflow: "auto" }}>
          <div className="card">
            <IconButton
              aria-label="Close"
              onClick={() => navigate("/")}
              sx={{ position: "relative", float: "right" }}
            >
              <CloseIcon />
            </IconButton>
            <div className="blog-title">{singlePost?.title} </div>
            <div className="blog-image">
              <img src={singlePost?.image} />
            </div>
            <p className="blog-description">{singlePost?.desc}</p>
          </div>
          <Chip
            color="success"
            variant="outlined"
            sx={{ mb: 2 }}
            label={`Author - ${singlePost?.user?.firstname} ${singlePost?.user?.lastname}`}
          />
        </Card>
      </Container>
    </div>
  );
};

export default BlogDetail;
