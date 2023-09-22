import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/Blogs.css";
import {
  CircularProgress,
  Card,
  Typography,
  Button,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { useNavigate } from "react-router-dom";

const BlogPost = () => {
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const handlePrevClick = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextClick = () => {
    setPage(page + 1);
  };

  const getAllBlogs = () => {
    setLoading(true);
    // console.log(process.env.REACT_APP_BACKEND_URL);
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/allposts?page=${page}`, {
        withCredentials: true,
      })
      .then((res) => {
        setLoading(false);
        setBlogData(res?.data?.data);
        console.log(res?.data?.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    getAllBlogs();
  }, [page]);

  return (
    <div className="blogs">
      {loading && (
        <div className="loading-text">
          <CircularProgress />
        </div>
      )}
      <div className="card-container">
        <div className="navigate-button">
          <Button
            color="inherit"
            startIcon={<ArrowBackIcon />}
            onClick={handlePrevClick}
            disabled={page === 1}
            size="small"
            sx={{ textTransform: "unset", mr: 2 }}
          >
            Prev
          </Button>
        </div>
        {blogData?.length === 0 ? (
          <>
            <Typography variant="h6">
              That's all for now... Come back later!
            </Typography>
          </>
        ) : (
          <>
            {blogData?.map((blog) => (
              <Card key={blog.id} className="article" sx={{ mr: 1 }}>
                <Link to={`/details/${blog.id}`}>
                  <img
                    alt="Placeholder"
                    className="article-img"
                    src={blog?.image}
                  />
                </Link>

                <Typography variant="h6">
                  Title :{" "}
                  {blog.title[0].toUpperCase() +
                    blog.title.substring(1, 6) +
                    "..."}
                </Typography>
                <Typography variant="body1" className="article-desc">
                  Desc : {blog.desc.substring(0, 25) + "..."}
                </Typography>

                <div className="button-container">
                  <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    startIcon={<ArrowOutwardIcon />}
                    sx={{ textTransform: "unset", borderRadius: 50 }}
                    onClick={() => navigate(`/details/${blog.id}`)}
                  >
                    Read More
                  </Button>
                  <Chip
                    icon={<AccountCircleIcon />}
                    color="secondary"
                    label={`${blog?.user?.firstname} ${blog?.user?.lastname}`}
                  />
                </div>
              </Card>
            ))}
          </>
        )}
        <div className="navigate-button">
          <Button
            color="inherit"
            variant="text"
            startIcon={<ArrowForwardIcon />}
            size="large"
            disabled={blogData?.length === 0}
            sx={{ textTransform: "unset", ml: 2 }}
            onClick={handleNextClick}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
