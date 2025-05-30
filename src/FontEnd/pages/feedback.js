import { useForm } from "react-hook-form";
import { useState } from "react";
import { useAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/config";

function FeedBack() {
    const [newFeedBack, setFeedBack] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const { isAuthenticated, getAuthHeader } = useAuth();
    const navigate = useNavigate();

    if (!isAuthenticated) {
        navigate("/login");
        return null;
    }

    const onSubmit = async (data) => {
        const feedback = JSON.stringify(data);
        try {
            setLoading(true);
            setError("");
            
            const response = await fetch(`${API_URL}/api/feedback`, {
                method: "post", 
                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeader()
                },
                body: feedback,
            });
            
            const result = await response.json();
            
            if (response.ok) {
                setFeedBack("Feedback submitted successfully!");
                reset();
            } else {
                setError(result.message || "Failed to submit feedback!");
                setFeedBack("");
            }
        } catch (error) {
            console.error("Error submitting feedback:", error);
            setError("Failed to submit feedback! Server error.");
            setFeedBack("");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ padding: 10 }}>{" "}<br />
                <h2>Submit Feedback</h2>
                
                {error && <div style={{ color: "red" }}>{error}</div>}
                {newFeedBack && <div style={{ color: "green" }}>{newFeedBack}</div>}
               
                <span>Title:</span>
                <br />
                <input type="text" {...register("title", { required: true })} /> 
                <br />
                {errors.title && <div style={{ color: "red" }}>Title is required</div>}
                
                <span>Description:</span>
                <br />
                <input type="text" {...register("description", { required: true })} /> 
                <br />
                {errors.description && <div style={{ color: "red" }}>Description is required</div>}

                <br />
                <button type="submit" disabled={loading}>
                    {loading ? "Đang gửi..." : "Submit Feedback"}
                </button>
            </div>
        </form>
    );
}

export default FeedBack;