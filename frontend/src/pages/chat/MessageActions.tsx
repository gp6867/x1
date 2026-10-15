export default function MessageActions({ text }: { text:string }) {

  const copy = () => navigator.clipboard.writeText(text);

  return (
    <div className="flex gap-3 text-xs opacity-70 mt-1">
      <button>👍</button>
      <button>👎</button>
      <button onClick={copy}>📋</button>
      <button>🔄</button>
    </div>
  );
}
