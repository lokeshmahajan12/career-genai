export default function Home(){
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-8 items-center">
      <div>
        <h1 className="text-4xl md:text-5xl font-black leading-tight">Your <span className="underline">Personal</span> Career & Skills Mentor</h1>
        <p className="mt-4 text-gray-600">Get AI‑powered career options, weekly learning roadmaps, resume feedback, and curated courses. Built with GPT‑5.</p>
        <div className="mt-6 flex gap-3">
          <a href="/register" className="btn btn-primary">Get Started</a>
          <a href="/advisor" className="btn">Try Advisor</a>
        </div>
      </div>
      <div className="card">
        <ul className="list-disc ml-5">
          <li>Personalized recommendations with memory</li>
          <li>Skill‑gap analysis & visual tracking</li>
          <li>Resume insights for internships/jobs</li>
          <li>Top course suggestions matched to your goals</li>
        </ul>
      </div>
    </div>
  );
}
