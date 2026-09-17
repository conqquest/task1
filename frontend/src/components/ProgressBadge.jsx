export default function ProgressBadge({ percentage, size = 'md' }) {
  return (
    <span className="border border-black px-2 py-0.5 text-sm font-normal text-black bg-white">
      {percentage}%
    </span>
  );
}
