import { Avatar } from "../Avatar/Avatar";

export const TodoCard = ({ title, assignee = "" }) => {
  return (
    <div className="card">
      <span>{title}</span>
      <div style={{ display: "flex" }}>
        Assignee <Avatar character={assignee.charAt(0)} />
      </div>
    </div>
  );
};
