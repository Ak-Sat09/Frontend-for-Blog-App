import { useState } from "react";
import { createBlog } from "../api/blogApi";

export default function CreateBlog() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const submit = async () => {
        await createBlog({ title, content });
        alert("Created");
    };

    return (
        <div>
            <input placeholder="Title" onChange={e => setTitle(e.target.value)} />
            <textarea placeholder="Content" onChange={e => setContent(e.target.value)} />
            <button onClick={submit}>Post</button>
        </div>
    );
}
