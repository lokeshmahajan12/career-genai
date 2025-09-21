export default function CourseCard({ c }){
  return (
    <a className="block card hover:scale-[1.01] transition" href={c.url} target="_blank" rel="noreferrer">
      <div className="text-sm text-gray-500">{c.provider} • {c.level}</div>
      <div className="font-semibold">{c.title}</div>
      <div className="text-xs mt-1">{c.tags?.join(', ')}</div>
      <div className="text-xs mt-2 opacity-70">Match score: {(c.score*100).toFixed(0)}%</div>
    </a>
  );
}
