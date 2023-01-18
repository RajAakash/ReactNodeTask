import { Avatar } from "../Avatar/Avatar";

export const TodoDetails = ({ todo }) => {
  return (
    <>
      <div>
        <h3>{todo.title}</h3>
        <Avatar character={todo.assignee.charAt(0)} />
        <p>{todo.status}</p>
      </div>
      <div>{todo.description}</div>
    </>
  );
};
