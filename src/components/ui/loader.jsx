import { LoaderCircle } from "lucide-react";

export default function Loader() {
  return (
    <div className="w-full flex-grow flex flex-col items-center justify-center gap-3 ">
      <LoaderCircle size={50} className="animate-spin" />
    </div>
  );
}
