import { useEffect, useReducer, useRef } from "react";

const initial = localStorage.getItem("todos")
  ? JSON.parse(localStorage.getItem("todos"))
  : [];
  
function App() {
  //reducer function for the useReducer hook which handles all complex logic of the app, it takes in 2 arguments, state and action and returns the new state based on the action performed
  const reducer = (state, action) => {
    switch (action.type) {
      case "ADD_TODO":
        return [
          ...state,
          {
            title: action.title,
            description: action.description,
            completed: action.completed,
            id: state.length,
          },
        ];
      case "DELETE_TODO":
        return state.filter((item) => item.id !== action.id);
      case "CHECK_TODO":
        return state.map((item) =>
          item.id === action.id ? { ...item, completed: !item.completed } : item
        );
      case "COMPLETE_ALL_TODOS":
        return state.map((item) => {
          return { ...item, completed: true };
        });
      case "PEND_ALL_TODOS":
        return state.map((item) => {
          return { ...item, completed: false };
        });
      case "CLEAR_ALL_TODOS":
        return [];
      default:
        return state;
    }
  };

  //I chose to use useReducer cus using state would make the codebase unnecessarily large
  //todos stores current todo items
  //setTodos is a function that handles all functionality in the app depending on the type of action you want to perform
  //reducer is a function that updates state depending on the users' action, which in turn leads to a re-render i.e. since it changes state
  //initial holds the initial todo items which would be an empty array for new users of the app and an array of tasks for returning users
  const [todos, setTodos] = useReducer(reducer, initial);
  //the title and description useRefs target the input fields to collect data
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);

  const handleAddTodo = (e) => {
    e.preventDefault();
    //nothing should happen if either title or description is missing
    if (titleRef.current.value === "" || descriptionRef.current.value === "")
      return;
    //this adds a new todo with the required details
    setTodos({
      type: "ADD_TODO",
      title: titleRef.current.value,
      description: descriptionRef.current.value,
      completed: false,
    });
    titleRef.current.value = "";
    descriptionRef.current.value = "";
  };

  const handleDeleteTodo = (id) => {
    setTodos({
      type: "DELETE_TODO",
      id: id,
    });
  };

  const handleCompletion = (id) => {
    setTodos({
      type: "CHECK_TODO",
      id: id,
    });
  };

  const handleCompleteAll = () => {
    setTodos({
      type: "COMPLETE_ALL_TODOS",
    });
  };

  const handlePendAll = () => {
    setTodos({
      type: "PEND_ALL_TODOS",
    });
  };

  const handleClearAll = () => {
    setTodos({
      type: "CLEAR_ALL_TODOS",
    });
  };

  // save todos to local storage every time it changes
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  return (
    <div className="app">
      <h1>Todo App</h1>

      <form onSubmit={handleAddTodo}>
        <input type="text" ref={titleRef} placeholder="Enter todo title" />
        <input
          type="text"
          ref={descriptionRef}
          placeholder="Enter todo description"
        />
        <button type="submit">Add</button>
      </form>

      {todos.length === 0 ? (
        <p>No todos added</p>
      ) : (
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              <h2>{todo.title}</h2>
              <p>
                {todo.description}
                <span>{todo.completed ? " (Completed)" : " (Pending)"}</span>
              </p>
              <div>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleCompletion(todo.id)}
                />
                <button onClick={() => handleDeleteTodo(todo.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <button onClick={handleCompleteAll}>Mark all as completed</button>
      <button onClick={handlePendAll}>Mark all as pending</button>
      <button onClick={handleClearAll}>Clear all todos</button>
    </div>
  );
}

export default App;
