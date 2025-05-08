import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "./ui/separator";
import { Checkbox } from "./ui/checkbox";
import LabelInput from "./ui/label-input";
import { useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import Loader from "./ui/loader";

const initialState = {
  todo: "",
  isCompleted: false,
};

export default function AddTodo({ open = false, setOpen, onSave = () => null }) {
  const [form, setForm] = useState(initialState);
  const [todoError, setTodoErrors] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const addTodo = async (e) => {
    e.preventDefault();
    // Validation Check
    if (!form.todo) return setTodoErrors("Required");
    const payload = {
      name: form.todo,
      completed: form.isCompleted,
    };

    try {
      setIsLoading(true);
      const response = await api.post("/tasks", payload);
      const { status, message = "" } = response?.data || {};

      if (status === "success") {
        toast.success(message);
        setOpen(false);
        onSave();
      }
    } catch (error) {
      console.error(error);
      const errorMsg = error?.response?.data?.message || "Something went wrong";
      toast.error(errorMsg);
    } finally {
      setForm(initialState);
      setTodoErrors("");
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Todo</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Todo</DialogTitle>
        </DialogHeader>
        <Separator className="my-1" />
        <form onSubmit={addTodo} noValidate className="flex flex-col gap-4">
          <LabelInput
            className="w-full"
            label="Task"
            id="todo"
            name="todo"
            type="text"
            value={form?.todo}
            error={todoError}
            onChange={(e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
            disabled={isLoading}
            required
          />
          <div className="flex items-center space-x-2">
            <Checkbox
              name="isCompleted"
              id="terms"
              checked={form?.isCompleted}
              onCheckedChange={(checked) => setForm((prev) => ({ ...prev, isCompleted: checked }))}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Is task already completed
            </label>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader className="animate-spin" /> : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
