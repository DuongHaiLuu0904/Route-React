import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/config";

function NewPost() {
    const [newPost, setNewPost] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { register, handleSubmit, formState: { errors }, } = useForm();
    const { isAuthenticated, getAuthHeader } = useAuth();
    const navigate = useNavigate();

    if (!isAuthenticated) {
        navigate("/login");
        return null;
    }
    
    const onSubmit = async (data) => {
        const post = JSON.stringify(data);
        try {
            setLoading(true);
            setError("");
            
            const response = await fetch(`${API_URL}/api/post`, {
                method: "post", 
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeader() 
                },
                body: post,
            });
            
            const result = await response.json();
            
            if (response.ok) {
                setNewPost("Post created successfully!");
                setTimeout(() => navigate("/"), 2000);
            } else {
                setError(result.message || "Failed to create post!");
                setNewPost("");
            }
        } catch (error) {
            console.error("Error creating data:", error);
            setError("Failed to create post! Server error.");
            setNewPost("");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ padding: 10 }}>{" "}<br />
                <h2>Create New Post</h2>
                
                {error && <div style={{ color: "red" }}>{error}</div>}
                {newPost && <div style={{ color: "green" }}>{newPost}</div>}
               
                <span>Title:</span>
                <br />
                <input type="text" {...register("title", { required: true })} /> 
                <br />
                {errors.title && <div style={{ color: "red" }}>Title is required</div>}
                <br />

                <span>Description:</span>
                <br />
                <input type="text" {...register("description", { required: true })} /> 
                <br />
                {errors.description && <div style={{ color: "red" }}>Description is required</div>}
                <br />
                
                <br />
                <button type="submit" disabled={loading}>
                    {loading ? "Đang tạo..." : "Add New"}
                </button>
            </div>
        </form>
    );
}

export default NewPost;