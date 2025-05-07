import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/posts/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error("Bài viết không tồn tại!");
        return res.json();
      })
      .then(data => setPost(data))
      .catch(err => alert(err.message));
  }, [slug]);

  if (!post) return <p>Đang tải...</p>;

  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
    </div>
  );
}
