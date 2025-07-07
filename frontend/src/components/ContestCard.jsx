const ContestCard = ({ contest }) => {
  return (
    <div className="border p-4 rounded-xl shadow hover:shadow-md transition">
      <h2 className="text-lg font-bold">{contest.name}</h2>
      <p className="text-sm text-gray-600">{contest.platform}</p>
      <p className="text-sm">{new Date(contest.startTime).toLocaleString()}</p>
      <a
        href={contest.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline mt-2 inline-block"
      >
        Visit
      </a>
    </div>
  );
};

export default ContestCard;
