type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
};

export default function Textarea({ label, ...props }: Props) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-gray-700 text-sm font-medium">
          {label}
        </label>
      )}
      <textarea
        {...props}
        className={`w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500 ${
          props.className || ""
        }`}
      />
    </div>
  );
}
