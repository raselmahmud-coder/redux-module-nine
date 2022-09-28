export default function Message({ justify, message }) {
  return (
    <li
      className={`flex justify-${justify}`}>
      <div className={`relative max-w-xl px-4 py-2 text-gray-700 rounded shadow ${
        justify === "end" ? "bg-green-300" : "bg-blue-400"
      }`}>
        <span className="block">{message}</span>
      </div>
    </li>
  );
}
