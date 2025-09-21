import React from "react";

export default function ProfileForm({ formData, setFormData, loading }) {
  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-xl">
      <h3 className="text-lg font-semibold mb-4">Profile Form</h3>
      <form className="space-y-3">
        {/* Name */}
        <div>
          <label className="text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            
            onChange={handleChange}
            className="w-full border rounded-md p-2 mt-1"
            placeholder="Your name"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="text-sm font-medium">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full border rounded-md p-2 mt-1"
            placeholder="Short bio"
          />
        </div>

        {/* Skills */}
        <div>
          <label className="text-sm font-medium">Skills (comma separated)</label>
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            className="w-full border rounded-md p-2 mt-1"
            placeholder="React, Node, JavaScript"
          />
        </div>

        {/* Interests */}
        <div>
          <label className="text-sm font-medium">Interests (comma separated)</label>
          <input
            type="text"
            name="interests"
            value={formData.interests}
            onChange={handleChange}
            className="w-full border rounded-md p-2 mt-1"
            placeholder="Frontend, AI, Web Development"
          />
        </div>

        {/* Experience */}
        <div>
          <label className="text-sm font-medium">Experience</label>
          <input
            type="text"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className="w-full border rounded-md p-2 mt-1"
            placeholder="2 years"
          />
        </div>

        {/* Education */}
        <div>
          <label className="text-sm font-medium">Education</label>
          <input
            type="text"
            name="education"
            value={formData.education}
            onChange={handleChange}
            className="w-full border rounded-md p-2 mt-1"
            placeholder="B.Tech, M.Sc etc."
          />
        </div>

        {/* Location */}
        <div>
          <label className="text-sm font-medium">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border rounded-md p-2 mt-1"
            placeholder="City, Country"
          />
        </div>

        {/* Industry */}
        <div>
          <label className="text-sm font-medium">Industry</label>
          <input
            type="text"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            className="w-full border rounded-md p-2 mt-1"
            placeholder="Software, IT, Finance etc."
          />
        </div>

        {/* Info */}
        <p className="text-xs text-gray-500 mt-2">
          Fill the form and click "Get Detailed Recommendations" in Dashboard.
        </p>
      </form>
    </div>
  );
}
