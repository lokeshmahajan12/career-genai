import { useMemo, useState, useEffect } from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import { Radar } from "react-chartjs-2";
import ProfileForm from "../components/ProfileForm";
import axios from "axios";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  Legend as ReLegend,
} from "recharts";

// Register Chart.js components
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// Animation variants
const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.2 } } };
const cardVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function DashboardRecommendations({ user }) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: "",
    skills: "",
    interests: "",
    experience: "",
    education: "",
    location: "",
    industry: "",
  });

  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);

  // Gemini API Call
  const handleSendToAI = async () => {
    try {
      setLoading(true);
      const prompt = `
        User Profile:
        Name: ${formData.name}
        Bio: ${formData.bio}
        Skills: ${formData.skills}
        Interests: ${formData.interests}
        Experience: ${formData.experience}
        Education: ${formData.education}
        Location: ${formData.location}
        Industry: ${formData.industry}

        Return a JSON with:
        {
          "profileScore": number,
          "topSkill": string,
          "jobs": [ { "title": string, "company": string, "matchScore": number, "coreSkills": [string] } ],
          "courses": [ { "name": string, "provider": string } ],
          "careerSuggestions": [ { "title": string, "reason": string, "level": string } ],
          "futureTrends": [ { "role": string, "trend": [ { "year": number, "demand": number } ] } ]
        }
      `;

      const res = await axios.post("http://localhost:5000/api/gemini", { prompt });

      if (res.data.success && res.data.output) {
        try {
          // ✅ AI Response fix - remove extra text
          const cleanJson = res.data.output.replace(/```json|```/g, "").trim();
          const parsed = JSON.parse(cleanJson);
          setRecommendation(parsed);
        } catch (err) {
          console.error("❌ JSON parse error:", err, res.data.output);
          alert("AI response invalid format. Please try again.");
        }
      } else {
        alert("❌ Failed to get AI recommendations");
      }
    } catch (err) {
      console.error("Gemini API Error:", err);
      alert("❌ Error calling Gemini AI");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Debug - Check if recommendation updates
  useEffect(() => {
    if (recommendation) {
      console.log("✅ Dashboard updated with recommendation:", recommendation);
    }
  }, [recommendation]);

  // Radar chart data
  const radarData = useMemo(() => {
    const skillsArr =
      recommendation?.topSkill
        ? [recommendation.topSkill, ...(recommendation.jobs?.[0]?.coreSkills || [])].slice(0, 6)
        : formData.skills.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 6);

    return {
      labels: skillsArr.length ? skillsArr : ["No Skills"],
      datasets: [
        {
          label: "Estimated Proficiency",
          data: skillsArr.map((_, i) => 70 - i * 5),
          backgroundColor: "rgba(99,102,241,0.15)",
          borderColor: "rgba(99,102,241,0.95)",
          borderWidth: 2,
        },
      ],
    };
  }, [recommendation, formData]);

  // Future trends chart
  const trendChartData = useMemo(() => {
    if (!recommendation?.futureTrends?.length) return [];
    const roles = recommendation.futureTrends.slice(0, 2);
    const years = roles[0].trend.map((p) => p.year);
    return years.map((yr, idx) => {
      const avg = Math.round(
        roles.reduce((acc, r) => acc + (r.trend[idx]?.demand || 0), 0) / roles.length
      );
      return { year: yr, demand: avg };
    });
  }, [recommendation]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        {/* Sidebar Form */}
        <aside className="col-span-12 lg:col-span-3 sticky top-6 self-start">
          <ProfileForm formData={formData} setFormData={setFormData} loading={loading} />
          <button
            onClick={handleSendToAI}
            disabled={loading}
            className="w-full mt-3 p-2 rounded-md bg-green-600 hover:bg-green-700 text-white font-semibold"
          >
            {loading ? "Analyzing..." : "Get Detailed Recommendations"}
          </button>
        </aside>

        {/* Main Dashboard */}
        <main className="col-span-12 lg:col-span-9 space-y-6">
          {/* Metrics */}
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {["Profile Strength", "Top Skill", "Recommended Jobs"].map((title, i) => (
              <motion.div key={i} variants={cardVariants}>
                <Tilt tiltMaxAngleX={8} tiltMaxAngleY={8} className="rounded-2xl">
                  <div className="bg-white p-5 rounded-2xl shadow-xl h-full flex flex-col justify-center items-center">
                    <div className="text-xs text-gray-500">{title}</div>
                    <div className="text-2xl font-bold mt-2">
                      {title === "Profile Strength"
                        ? recommendation?.profileScore ?? "—"
                        : title === "Top Skill"
                        ? recommendation?.topSkill ?? "—"
                        : recommendation?.jobs?.length ?? 0}
                    </div>
                  </div>
                </Tilt>
              </motion.div>
            ))}
          </motion.div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-5 rounded-2xl shadow-xl">
              <h3 className="text-sm font-semibold mb-2">Skill Proficiency Radar</h3>
              <Radar data={radarData} />
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-xl">
              <h3 className="text-sm font-semibold mb-2">Future Trends</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={trendChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <ReTooltip />
                  <ReLegend />
                  <Area type="monotone" dataKey="demand" stroke="#6366F1" fill="#A5B4FC" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Jobs */}
          {recommendation?.jobs?.length > 0 && (
            <div className="bg-white p-5 rounded-2xl shadow-xl">
              <h3 className="text-sm font-semibold mb-3">Job Recommendations</h3>
              <ul className="space-y-2">
                {recommendation.jobs.map((job, idx) => (
                  <li key={idx} className="p-3 rounded-lg bg-gray-50 border">
                    <div className="font-bold">{job.title}</div>
                    <div className="text-sm text-gray-500">{job.company}</div>
                    <div className="text-sm text-gray-400">Match Score: {job.matchScore}%</div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Courses */}
          {recommendation?.courses?.length > 0 && (
            <div className="bg-white p-5 rounded-2xl shadow-xl">
              <h3 className="text-sm font-semibold mb-3">Course Suggestions</h3>
              <ul className="space-y-2">
                {recommendation.courses.map((c, idx) => (
                  <li key={idx} className="p-3 rounded-lg bg-gray-50 border">
                    <div className="font-bold">{c.name}</div>
                    <div className="text-sm text-gray-500">{c.provider}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Career Suggestions */}
          {recommendation?.careerSuggestions?.length > 0 && (
            <div className="bg-white p-5 rounded-2xl shadow-xl">
              <h3 className="text-sm font-semibold mb-3">Career Suggestions</h3>
              <ul className="space-y-2">
                {recommendation.careerSuggestions.map((s, idx) => (
                  <li key={idx} className="p-3 rounded-lg bg-gray-50 border">
                    <div className="font-bold">{s.title}</div>
                    <div className="text-sm text-gray-500">{s.reason}</div>
                    <div className="text-sm text-gray-400">Level: {s.level}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
