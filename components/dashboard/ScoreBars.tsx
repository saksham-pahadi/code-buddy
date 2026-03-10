export function ScoreBar({ label, value }: { label: string; value: number }) {
  const percent = (value / 10) * 100;

  return (
    <div className="mb-4 w-full">
      <div className="flex w-full justify-between mb-1">
        <span>{label}</span>
        <span>{value}/100</span>
      </div>
      <div className="w-full bg-gray-200 h-2 rounded">
        <div
          className="bg-black h-2 rounded"
          style={{ width: `${percent}px` }}
        />
      </div>
    </div>
  );
}