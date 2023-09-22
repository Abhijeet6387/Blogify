import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import CircularProgress from "@mui/material/CircularProgress";
import "../styles/MyPosts.css";

const PersonalBlog = () => {
  const [blogData, setBlogData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

  const uniqueBlog = () => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/myposts`, {
        withCredentials: true,
        headers: {
          Authorization: "TOKEN",
        },
      })
      .then((res) => {
        setLoading(false);
        setBlogData(res?.data);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    const User = localStorage.getItem("user");
    if (!User) {
      navigate("/login");
    }
    uniqueBlog();
  }, []);

  const deleteBtn = (blog: { id: any }) => {
    setDeleteLoading(true);
    axios
      .delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/allposts/${blog.id}/delete`,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        alert("Post deleted successfully..");
        setDeleteLoading(false);
        uniqueBlog();
      })
      .catch((error) => {
        console.log(error);
        setDeleteLoading(false);
      });
  };

  return (
    <div className="blog-container">
      {!loading && blogData?.length <= 0 && (
        <Typography variant="h4" className="empty-message">
          You don't have any posts yet. Kindly create a post.
        </Typography>
      )}

      {loading && (
        <div className="loading-container">
          <CircularProgress />
        </div>
      )}

      <div className="blog-list">
        {blogData.length > 0 &&
          blogData?.map((blog: any) => (
            <Card key={blog?.id} className="blog-card">
              <img
                alt="Blog Thumbnail"
                src={blog?.image}
                className="blog-thumbnail"
              />

              <Typography variant="h5">{blog.title}</Typography>
              <Typography variant="body2">
                {blog?.user?.first_name} {blog?.user?.last_name}
              </Typography>

              <CardActions className="button-container">
                <Button
                  variant="outlined"
                  size="small"
                  color="primary"
                  startIcon={<ArrowOutwardIcon />}
                  sx={{ textTransform: "unset", borderRadius: 50 }}
                  onClick={() => navigate(`/details/${blog.id}`)}
                >
                  Read More
                </Button>
                <IconButton
                  color="error"
                  onClick={() => deleteBtn(blog)}
                  disabled={deleteLoading}
                  aria-label="Delete"
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  color="info"
                  onClick={() => navigate(`/edit/${blog.id}`)}
                  aria-label="Edit"
                >
                  <EditIcon />
                </IconButton>
              </CardActions>
            </Card>
          ))}
      </div>
    </div>
  );
};

export default PersonalBlog;
