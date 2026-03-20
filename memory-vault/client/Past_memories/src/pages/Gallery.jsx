import { useEffect, useState } from "react";
import axios from "axios";

function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch media
  const fetchMedia = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/media", {
        headers: { Authorization: token }
      });
      setItems(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Failed to load gallery");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  // Delete media
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/media/${id}`, {
        headers: { Authorization: token }
      });

      // Remove from UI instantly (no delay)
      setItems((prev) => prev.filter((item) => item._id !== id));

    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete");
    }
  };

  <h1 style={{ color: "red" }}>GALLERY WORKING</h1>

  return (
    <div style={{ padding: "30px" }}>
      <h2>Our Memories 💖</h2>

      {/* Loading */}
      {loading && <p>Loading...</p>}

      {/* Empty */}
      {!loading && items.length === 0 && (
        <p>No memories yet...</p>
      )}

      {/* Gallery */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
          marginTop: "20px"
        }}
      >
        {items.map((item) => (
          <div
            key={item._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "10px",
              background: "#fafafa"
            }}
          >
            {/* Media */}
            {item.type === "image" ? (
              <img
                src={item.url}
                alt="memory"
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "8px"
                }}
              />
            ) : (
              <video
                src={item.url}
                controls
                style={{
                  width: "100%",
                  height: "200px",
                  borderRadius: "8px"
                }}
              />
            )}

            {/* Delete Button */}
            <button
              onClick={() => handleDelete(item._id)}
              style={{
                marginTop: "10px",
                width: "100%",
                padding: "10px",
                backgroundColor: "#e63946",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Delete ❌
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gallery;