import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const { register, handleSubmit, formState: { errors }, } = useForm();

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

  const onSubmit = async (data) => {
    const comment = JSON.stringify(data);
    try {
      const response = await fetch(`http://localhost:8080/api/posts/${slug}/comments`, {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: comment,
      });
      if (response.ok) alert("Comment created successfully!");
    } catch (error) {
      console.error("Error creating data:", error);
      alert("Failed to create comment!");
    }
  }

  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.description}</p>      
      {post.comments.map((comment, index) => (
        <p key={index}>{comment.text}</p>
      ))}

      <form onSubmit={handleSubmit(onSubmit)}>
        <span>Comment:</span><br />

        <input type="text" {...register("text", { required: true })} /> <br />
        {errors.text && <div style={{ color: "red" }}>Comment is required</div>}

        <br /><button type="submit">Add Comment</button>
      </form>

    </div>
  );
}
