import { X } from "lucide-react";
import { Card, CardDescription } from "./ui/card";
import { Checkbox } from "./ui/checkbox";

export default function TodoCard({
  id = "",
  isCompleted = false,
  updateTodo = () => null,
  deleteTodo = () => null,
  children = "",
}) {
  return (
    <Card className="bg-background flex flex-row items-center py-4 px-5 rounded-md">
      <Checkbox
        className="cursor-pointer"
        checked={isCompleted}
        onCheckedChange={(status) => updateTodo(id, status)}
      />
      <CardDescription className={`flex-grow ${isCompleted ? "line-through" : ""}`}>
        {children}
      </CardDescription>
      <X
        strokeWidth={1.5}
        size={20}
        className="text-zinc-300 hover:text-red-500 cursor-pointer"
        onClick={() => deleteTodo(id)}
      />
    </Card>
  );
}
