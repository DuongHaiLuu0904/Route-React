import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../components/AuthContext";
import { API_URL } from "../config/config";

export default function PostDetail() {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const { isAuthenticated, getAuthHeader } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        fetch(`${API_URL}/api/posts/${slug}`)
            .then(res => {
                if (!res.ok) throw new Error("Bài viết không tồn tại!");
                return res.json();
            })
            .then(data => {
                setPost(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [slug]);

    if (loading) return <p>Đang tải...</p>;
    if (error) return <p>Lỗi: {error}</p>;
    if (!post) return <p>Không tìm thấy bài viết</p>;

    const onSubmit = async (data) => {
        if (!isAuthenticated) {
            alert("Vui lòng đăng nhập để bình luận");
            navigate("/login");
            return;
        }

        const comment = JSON.stringify(data);
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/posts/${slug}/comments`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeader() // Add the authorization header
                },
                body: comment,
            });

            const result = await response.json();

            if (response.ok) {
                // Refresh the post to show the new comment
                fetch(`${API_URL}/api/posts/${slug}`)
                    .then(res => res.json())
                    .then(data => {
                        setPost(data);
                        setLoading(false);
                    });

                // Clear the comment form
                reset();
            } else {
                alert(result.message || "Failed to create comment!");
                setLoading(false);
            }
        } catch (error) {
            console.error("Error creating comment:", error);
            alert("Failed to create comment!");
            setLoading(false);
        }
    }

    return (
        <div>
            <h2>{post.title}</h2>
            <p>{post.description}</p>

            <h3>Comments:</h3>
            {post.comments && post.comments.length > 0 ? (
                post.comments.map((comment, index) => (
                    <div key={index} className="comment">
                        <p>{comment.text}</p>
                    </div>
                ))
            ) : (
                <p>No comments yet.</p>
            )}

            {isAuthenticated ? (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <span>Comment:</span><br />
                    <input type="text" {...register("text", { required: true })} /> <br />
                    {errors.text && <div style={{ color: "red" }}>Comment is required</div>}
                    <br /><button type="submit" disabled={loading}>
                        {loading ? "Đang gửi..." : "Add Comment"}
                    </button>
                </form>
            ) : (
                <p>
                    <Link to="/login">Đăng nhập</Link> để bình luận
                </p>
            )}
        </div>
    );
}
