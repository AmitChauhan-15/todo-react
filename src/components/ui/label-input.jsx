import { Input } from "./input";
import { Label } from "./label";

export default function LabelInput({ label = "", error = "", className = "", ...props }) {
  return (
    <div className={`grid gap-3 ${className}`}>
      <Label htmlFor={props.id}>{label}</Label>
      <div>
        <Input className={`${error ? "border-red-400" : ""}`} {...props} />
        {error && <span className="text-red-400 text-xs">{error}</span>}
      </div>
    </div>
  );
}
