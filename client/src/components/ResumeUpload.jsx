import { useState, useRef } from "react";
import axios from "axios";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};
const cardVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState(null);
  const fileInputRef = useRef();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setJobs([]);
    setError(null);
  };

  const analyze = async () => {
    if (!file) {
      setError("⚠️ Please select a resume first.");
      return;
    }
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/analyze/upload-resume",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setJobs(data.jobs || []);
    } catch (err) {
      console.error("Resume analysis failed:", err);
      setError("❌ Failed to generate job suggestions. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        {/* Sidebar Upload */}
        <aside className="col-span-12 lg:col-span-3 sticky top-6 self-start">
          <div className="bg-white rounded-2xl shadow-xl p-5 flex flex-col gap-3">
            <h2 className="text-xl font-semibold mb-2">Upload Your Resume</h2>
            <button
              onClick={() => fileInputRef.current.click()}
              className="w-full py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
            >
              📁 Select Resume
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={analyze}
              disabled={loading || !file}
              className={`w-full py-2 rounded-lg font-semibold text-white ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Analyzing..." : "Analyze & Suggest Jobs"}
            </button>
            {file && <p className="text-sm text-gray-500 mt-2">Selected: {file.name}</p>}
            {error && <p className="text-red-600 mt-2">{error}</p>}
          </div>
        </aside>

        {/* Main Job Cards */}
       <main className="col-span-12 lg:col-span-9 space-y-6">
  {jobs.length > 0 && (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[80vh] overflow-y-auto pr-2"
    >
      {jobs.map((job, idx) => (
        <motion.div key={idx} variants={cardVariants}>
          <Tilt tiltMaxAngleX={6} tiltMaxAngleY={6} className="rounded-2xl">
            <div className="bg-white rounded-2xl shadow-xl p-5 flex flex-col justify-between hover:shadow-2xl transition transform hover:-translate-y-1">
              <h3 className="font-bold text-lg mb-1">{job.title}</h3>
              <p className="text-gray-600 font-medium">{job.company}</p>
              <p className="text-sm text-gray-500">{job.location}</p>
              <p className="mt-2 text-sm text-gray-700 italic line-clamp-4">{job.matchReason}</p>
              <a
                href={job.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 text-blue-600 font-medium hover:underline"
              >
                Apply Now →
              </a>
            </div>
          </Tilt>
        </motion.div>
      ))}
    </motion.div>
  )}
</main>
      </div>
    </div>
  );
}
