import { useEffect, useState } from "react";
import { api } from "../lib/api";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [query, setQuery] = useState(""); // search query
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({});
  const [reviews, setReviews] = useState({});
  const [newReview, setNewReview] = useState("");

  // Fetch courses from Gemini AI
  const fetchCourses = async (searchQuery = "") => {
    setLoading(true);
    try {
      const { data } = await api.post("/api/ai/courses", { query: searchQuery });
      setCourses(data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle progress bar update
  const handleProgress = (id) => {
    setProgress(prev => {
      const val = prev[id] === 100 ? 0 : (prev[id] || 0) + 20;
      return { ...prev, [id]: val };
    });
  };

  // Handle adding review
  const handleReviewSubmit = (id) => {
    if (!newReview.trim()) return;
    setReviews(prev => ({
      ...prev,
      [id]: [...(prev[id] || []), { text: newReview }]
    }));
    setNewReview("");
  };

  // Initial load: fetch top courses
  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">🔥 Find Top Courses</h1>

      {/* Search Bar */}
      <div className="flex gap-2 mb-6">
        <input
          className="input border px-3 py-2 rounded-md w-full"
          placeholder="Search courses (e.g., React, MERN, AI)"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button
          className="btn btn-primary px-4 py-2 rounded-md"
          onClick={() => fetchCourses(query)}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((c, i) => (
          <div key={i} className="border rounded-lg shadow hover:shadow-lg p-4 bg-white transition">
            <h2 className="text-lg font-semibold mb-1">{c.title}</h2>
            <p className="text-sm text-gray-500 mb-1">{c.provider}</p>
            <p className="text-xs mb-1">Level: <span className="font-medium">{c.level}</span></p>
            <div className="flex flex-wrap gap-1 mb-2">
              {c.tags?.map((tag, idx) => (
                <span key={idx} className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded">{tag}</span>
              ))}
            </div>
            <a href={c.url} target="_blank" rel="noopener noreferrer"
               className="text-white bg-green-500 px-3 py-1 rounded hover:bg-green-600 transition">
              Go to Course
            </a>

            {/* Progress */}
            <div className="mt-3">
              <p className="text-xs font-semibold">Progress</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                <div className="bg-blue-600 h-2.5 rounded-full transition-all"
                     style={{ width: `${progress[c._id] || 0}%` }} />
              </div>
              <button className="text-xs text-blue-500 underline" onClick={() => handleProgress(c._id)}>+ Update Progress</button>
            </div>

            {/* Reviews */}
            <div className="mt-2">
              <p className="text-xs font-semibold">Reviews</p>
              {(reviews[c._id] || []).map((r, idx) => (
                <p key={idx} className="text-xs text-gray-600">⭐ {r.text}</p>
              ))}
              <div className="flex gap-2 mt-1">
                <input type="text" className="border px-2 py-1 text-xs rounded w-full"
                       placeholder="Add review" value={newReview}
                       onChange={e => setNewReview(e.target.value)} />
                <button className="bg-green-500 text-white text-xs px-2 py-1 rounded"
                        onClick={() => handleReviewSubmit(c._id)}>Post</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {courses.length === 0 && !loading && (
        <p className="mt-4 text-gray-500">No courses found. Try searching another keyword.</p>
      )}
    </div>
  );
}
