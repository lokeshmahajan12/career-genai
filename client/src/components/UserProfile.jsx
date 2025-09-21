import { useEffect, useState } from "react";
import axios from "axios";

export default function UserProfile() {
  const [user, setUser] = useState({}); // default empty object
  const [loading, setLoading] = useState(true); // track loading
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data);
        setName(data.name || "");
        setEmail(data.email || "");
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false); // stop loading
      }
    };
    fetchUser();
  }, [token]);

  // Update user
  const updateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      if (photo) formData.append("photo", photo);

      const { data } = await axios.post("http://localhost:5000/api/users/update", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      setUser(data);
      alert("Profile updated!");
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  if (loading) return <p className="text-center mt-6">Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-6 card p-4">
      <h2 className="text-xl font-semibold mb-4">My Profile</h2>
      <div className="flex flex-col items-center">
        <img
          src={user.photo || "/default-avatar.png"}
          alt="profile"
          className="w-24 h-24 rounded-full object-cover"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPhoto(e.target.files[0])}
          className="mt-2"
        />
      </div>

      <label className="block mt-3">Name</label>
      <input
        className="input"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label className="block mt-3">Email</label>
      <input
        className="input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={updateProfile} className="btn btn-primary mt-4 w-full">
        Save Changes
      </button>
    </div>
  );
}
