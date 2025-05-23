import { useState } from "react";
import { useForm } from "react-hook-form";

function NewPost() {
    const [newPost, setNewPost] = useState("");
    const { register, handleSubmit, formState: { errors }, } = useForm();
    const onSubmit = async (data) => {
        const post = JSON.stringify(data);
        try {
            const response = await fetch("http://localhost:8080/api/post", {
                method: "post", 
                headers: {
                    "Content-Type": "application/json"
                },
                body: post,
            });
            if (response.ok) setNewPost("Post created successfully!");
        } catch (error) {
            console.error("Error creating data:", error);
            setNewPost("Failed to create post!");
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ padding: 10 }}>{" "}<br />
               
                <span>Title:</span><br />
                <input type="text" {...register("title", { required: true })} /> <br />
                {errors.title && <div style={{ color: "red" }}>Title is required</div>}
                
                <span>Description:</span><br />
                <input type="text" {...register("description", { required: true })} /> <br />
                {errors.description && <div style={{ color: "red" }}>Description is required</div>}
                
                <br /><button type="submit">Add New</button>
                <p className="text-success">{newPost}</p>
            </div>
        </form>
    );
}

export default NewPost;