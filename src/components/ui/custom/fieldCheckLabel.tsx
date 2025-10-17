import { Checkbox } from "../checkbox";

function FieldCheckLabel({
  id,
  label,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  checked?: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2">
      <Checkbox
        id={id}
        data-testid={`${id}-checkbox`}
        checked={checked ?? false}
        onCheckedChange={(e) => {
          onCheckedChange(e === true);
        }}
      />
      <span className="text-sm font-medium">{label}</span>
    </label>
  );
}

export { FieldCheckLabel };
