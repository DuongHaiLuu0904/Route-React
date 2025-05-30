import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config/config";

export default function Posts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetch(`${API_URL}/api/posts`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch posts");
                return res.json();
            })
            .then(data => {
                setPosts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching posts:", err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Đang tải bài viết...</p>;
    if (error) return <p>Lỗi: {error}</p>;

    return (
        <div>
            <h2>Danh sách bài viết</h2>
            {posts.length === 0 ? (
                <p>Không có bài viết nào.</p>
            ) : (
                <ul>
                    {posts.map(post => (
                        <li key={post._id}>
                            <Link to={`/posts/${post.slug}`}>{post.title}</Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
