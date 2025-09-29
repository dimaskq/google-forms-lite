import Button from "../common/Button";

type Props = {
  options: string[];
  onChange: (opts: string[]) => void;
};

export default function OptionEditor({ options, onChange }: Props) {
  const handleOptionChange = (idx: number, value: string) => {
    const newOpts = [...options];
    newOpts[idx] = value;
    onChange(newOpts);
  };

  const addOption = () => onChange([...options, ""]);
  const removeOption = (idx: number) =>
    onChange(options.filter((_, i) => i !== idx));

  return (
    <div className="space-y-2">
      {options.map((opt, idx) => (
        <div key={idx} className="flex gap-2">
          <input
            value={opt}
            onChange={(e) => handleOptionChange(idx, e.target.value)}
            className="flex-1 border-b border-gray-300 py-1"
            placeholder={`Option ${idx + 1}`}
          />
          <Button
            type="button"
            variant="secondary"
            onClick={() => removeOption(idx)}
          >
            ✕
          </Button>
        </div>
      ))}
      <Button type="button" variant="secondary" onClick={addOption}>
        + Add option
      </Button>
    </div>
  );
}
