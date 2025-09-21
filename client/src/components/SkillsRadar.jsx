import { useEffect, useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { api } from "../lib/api";

export default function SkillsRadar({ data }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/resume-analysis");
        setAnalysis(data);
      } catch (err) {
        console.error("Error loading analysis:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        📊 Skill Coverage & Career Insights
      </h3>

      {/* Radar Graph */}
      <div className="w-full h-80 mb-6">
        <ResponsiveContainer>
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="skill" />
            <PolarRadiusAxis />
            <Radar
              dataKey="score"
              stroke="#2563eb"
              fill="#3b82f6"
              fillOpacity={0.4}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Resume Analysis Results */}
      {loading ? (
        <p className="text-gray-500">🔎 Analyzing your resume...</p>
      ) : analysis ? (
        <div className="space-y-6">
          {/* Job Recommendations */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
              💼 Recommended Jobs
            </h4>
            <ul className="space-y-2">
              {analysis.recommendations.map((job, idx) => (
                <li
                  key={idx}
                  className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <span className="font-medium">{job.title}</span> @{" "}
                  <span className="text-blue-600">{job.company}</span>
                  <p className="text-sm text-gray-500">
                    {job.location} • Match: {job.matchScore}%
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Courses */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
              📚 Suggested Courses
            </h4>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
              {analysis.courses.map((c, idx) => (
                <li key={idx}>{c}</li>
              ))}
            </ul>
          </div>

          {/* Future Scope */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
              🚀 Future Scope
            </h4>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {analysis.futureScope}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-red-500">❌ Failed to analyze resume.</p>
      )}
    </div>
  );
}
