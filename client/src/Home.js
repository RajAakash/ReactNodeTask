import { useCallback, useContext, useEffect, useState } from "react";
import UserContext from "./UserContext";
import axios from "axios";
import { TodoForm } from "./components/TodoForm/TodoForm";
import { TodoCard } from "./components/TodoCard/TodoCard";
import { Link, Redirect } from "react-router-dom";

function Home() {
  const { user } = useContext(UserContext);
  const [inputVal, setInputVal] = useState("");
  const [todos, setTodos] = useState([]);
  const [users, setUsers] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [todoForm, setTodoForm] = useState({
    title: "",
    description: "",
    assignee: "",
  });

  useEffect(() => {
    setTodoForm({
      ...todoForm,
      assignee: user._id,
    });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:4000/users", { withCredentials: true })
      .then((res) => {
        setUsers(res.data);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:4000/todos", { withCredentials: true })
      .then((response) => {
        setTodos(response.data);
      });
  }, []);
  if (!user.email) {
    return "Your need to be logged in to see this page";
  }
  const toggleForm = (e) => {
    setOpenForm((state) => !state);
  };
  const setFieldValue = (name, value) => {
    setTodoForm((todoForm) => ({
      ...todoForm,
      [name]: value,
    }));
  };
  const addTodo = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:4000/todos", todoForm, { withCredentials: true })
      .then((response) => {
        setTodos([...todos, response.data]);
        setInputVal("");
      })
      .finally(() => {
        toggleForm();
      });
  };

  function updateTodo(todo) {
    const data = { id: todo._id, done: !todo.done };
    axios
      .post("http://localhost:4000/todos", data, { withCredentials: true })
      .then(() => {
        const newTodos = todos.map((t) => {
          if (t._id === todo._id) {
            t.done = !t.done;
          }
          return t;
        });
        setTodos([...newTodos]);
      });
  }

  return (
    <div>
      {!user.email && (
        <>
          <Redirect to={"/login"} />
          <Link to={"/login"}>Login</Link>
          <Link to={"/register"}>Register</Link>
        </>
      )}
      <button onClick={toggleForm}>Add a Todo</button>
      {openForm ? (
        <form onSubmit={addTodo}>
          <TodoForm
            onSubmit={addTodo}
            setFieldValue={setFieldValue}
            users={users}
            me={user.email}
            values={todoForm}
            cancel={toggleForm}
          />
        </form>
      ) : (
        todos.map((todo) => (
          <TodoCard
            key={todo._id}
            title={todo.title}
            assignee={todo?.assignee?.email}
          />
        ))
      )}
    </div>
  );
}

export default Home;
