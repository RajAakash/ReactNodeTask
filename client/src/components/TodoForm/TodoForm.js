export const TodoForm = ({
  onSubmit,
  users = [],
  values = {},
  setFieldValue,
  cancel,
  me,
}) => {
  return (
    <div
      style={{
        width: "inherit",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            flex: 1,
            width: "80%",
          }}
        >
          <label>Title</label>
          <input
            required
            type="text"
            value={values.title}
            onChange={(e) => {
              setFieldValue("title", e.target.value);
            }}
          />
        </div>
        <div>Assigned To:</div>
        <select
          onChange={(e) => {
            setFieldValue("assignee", e.target.value);
          }}
          value={values.assignee}
        >
          {users?.map((user) => (
            <option key={user.email} value={user._id}>
              {user.email === me ? "ME" : user.email}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Description</label>
        <textarea
          required
          rows={10}
          value={values.description}
          cols={100}
          onChange={(e) => {
            setFieldValue("description", e.target.value);
          }}
        />
      </div>

      <button type="submit">Submit</button>
      <button onSubmit={cancel}>Cancel</button>
    </div>
  );
};
