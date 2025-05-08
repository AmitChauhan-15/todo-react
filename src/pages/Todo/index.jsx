import AddTodo from "@/components/AddTodoDialog";
import TodoCard from "@/components/TodoCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Loader from "@/components/ui/loader";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { ListTodo } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function Todo() {
  const { token } = useAuth();
  const [todos, setTodos] = useState([]);
  const [view, setView] = useState("all");
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getAllTodos = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/tasks");
      const { status, data = {} } = response?.data || {};

      if (status === "success") {
        setTodos(data.tasks);
      }
    } catch (error) {
      console.error(error);
      const errorMsg = error?.response?.data?.message || "Something went wrong";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTodo = async (id, todoStatus) => {
    try {
      const payload = { completed: todoStatus };
      const response = await api.put(`/tasks/${id}`, payload);
      const { status } = response?.data || {};

      if (status === "success") {
        await getAllTodos();
      }
    } catch (error) {
      console.error(error);
      const errorMsg = error?.response?.data?.message || "Something went wrong";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await api.delete(`/tasks/${id}`);
      const { status } = response?.data || {};

      if (status === "success") {
        await getAllTodos();
      }
    } catch (error) {
      console.error(error);
      const errorMsg = error?.response?.data?.message || "Something went wrong";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTodo = useMemo(() => {
    let filterTodo = [];

    switch (view) {
      case "all":
        filterTodo = todos.reduce(
          (acc, todo) => (todo.completed ? [...acc, todo] : [todo, ...acc]),
          []
        );
        break;
      case "completed":
        filterTodo = todos.filter((todo) => todo.completed);
        break;
      case "active":
        filterTodo = todos.filter((todo) => !todo.completed);
        break;
      default:
        todos;
    }
    console.log("FILTERED ARR : ", filterTodo);
    return filterTodo;
  }, [view, todos]);

  const completedTodo = todos.reduce((acc, todo) => (todo.completed ? ++acc : acc), 0);

  useEffect(() => {
    if (token) {
      console.log("TOKEN : ", token);
      getAllTodos();
    }
  }, [token]);

  return (
    <section className="flex flex-grow w-full justify-center p-6 md:p-10 overflow-hidden">
      <Card className="w-[1080px] h-full overflow-hidden">
        <CardHeader className="text-2xl">
          <div className="flex justify-between space-y-2">
            <div className="space-y-1.5">
              <CardTitle>My Todo</CardTitle>
              <CardDescription>{`${completedTodo} of ${todos.length} is completed`}</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant={view === "active" ? "active" : "outline"}
                onClick={() => setView("active")}
              >
                Active
              </Button>
              <Button
                variant={view === "completed" ? "active" : "outline"}
                onClick={() => setView("completed")}
              >
                Completed
              </Button>
              <Button
                variant={view === "all" ? "active" : "outline"}
                onClick={() => setView("all")}
              >
                All Todo
              </Button>
              <AddTodo open={openDialog} setOpen={setOpenDialog} onSave={getAllTodos} />
            </div>
          </div>
          <Progress value={todos.length > 0 ? (completedTodo / todos.length) * 100 : 0} />
        </CardHeader>
        <CardContent className="flex flex-col h-full gap-2 overflow-auto">
          <>
            {isLoading ? (
              <Loader />
            ) : (
              <>
                {todos.length > 0 ? (
                  filteredTodo.map((todo) => (
                    <TodoCard
                      key={todo._id}
                      id={todo._id}
                      isCompleted={todo.completed || false}
                      updateTodo={updateTodo}
                      deleteTodo={deleteTodo}
                    >
                      {todo.name}
                    </TodoCard>
                  ))
                ) : (
                  <div className="w-full flex-grow flex flex-col items-center justify-center gap-3 ">
                    <ListTodo size={50} className="text-zinc-500" />
                    <span className="text-xl font-semibold text-zinc-300">No Todo Found</span>
                  </div>
                )}
              </>
            )}
          </>
        </CardContent>
      </Card>
    </section>
  );
}
