import { Input } from "../input";

function FieldNumberLabel({
  id,
  label,
  value,
  onChange,
  placeholder,
  step,
  width,
}: {
  id: string;
  label: string;
  value?: number;
  onChange: (v: number | undefined) => void;
  placeholder?: string;
  step?: string;
  width?: string;
}) {
  return (
    <label className="flex items-center justify-between">
      <span className="text-sm font-medium">{label}</span>
      <Input
        id={id}
        data-testid={`${id}-input`}
        type="number"
        inputMode="decimal"
        step={step || "1"}
        className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus:ring-2 focus:ring-slate-300 focus:outline-none"
        style={{ width: width || "10rem" }}
        placeholder={placeholder}
        value={value ?? ""}
        onChange={(e) => {
          const raw = e.target.value;
          onChange(raw === "" ? undefined : Number(raw));
        }}
      />
    </label>
  );
}

export { FieldNumberLabel };
