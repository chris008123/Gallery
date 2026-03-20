import { useState } from "react";
import axios from "axios";

function Upload() {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert("Select a file first");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token"); // JWT auth
      const res = await axios.post(
        "http://localhost:5000/api/upload",
        formData,
        { headers: { Authorization: token } }
      );

      console.log("Uploaded:", res.data);
      alert("Upload successful!");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div>
      <h2>Upload Memory 📸</h2>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default Upload;