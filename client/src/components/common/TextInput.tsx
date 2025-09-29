type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export default function TextInput({ label, ...props }: Props) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-gray-700 text-sm font-medium">
          {label}
        </label>
      )}
      <input
        {...props}
        className={`w-full border-b border-gray-300 py-2 outline-none focus:border-purple-600 ${
          props.className || ""
        }`}
      />
    </div>
  );
}
