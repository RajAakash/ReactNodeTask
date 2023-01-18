import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import cors from "cors";
import jwt from "jsonwebtoken";
import { Todo } from "./models/Todo.js";
import { User } from "./models/User.js";

const secret = "secret123";

await mongoose.connect("mongodb://localhost:27017/auth-todo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.log);

const app = express();
app.use(cookieParser());
app.use(bodyParser.json({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.get("/", (req, res) => {
  res.send("ok");
});

app.get("/users", (req, res) => {
  if (!req.cookies.token) {
    return res.json({});
  }
  User.find()
    .select({ _id: 1, email: 1 })
    .then((users) => {
      if (!users || !users?.length) {
        return res.json([]);
      }
      res.json(users);
    });
});
app.get("/user", (req, res) => {
  if (!req.cookies.token) {
    return res.json({});
  }
  const payload = jwt.verify(req.cookies.token, secret);
  User.findById(payload.id)
    .select({ _id: 1, email: 1 })
    .then((userInfo) => {
      if (!userInfo) {
        return res.json({});
      }
      res.json(userInfo);
    });
});

app.post("/register", (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = new User({ password: hashedPassword, email });
  user.save().then((userInfo) => {
    jwt.sign(
      { id: userInfo._id, email: userInfo.email },
      secret,
      (err, token) => {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        } else {
          res
            .cookie("token", token)
            .json({ id: userInfo._id, email: userInfo.email });
        }
      }
    );
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).then((userInfo) => {
    if (!userInfo) {
      return res.sendStatus(401);
    }
    const passOk = bcrypt.compareSync(password, userInfo.password);
    if (passOk) {
      jwt.sign({ id: userInfo._id, email }, secret, (err, token) => {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        } else {
          res
            .cookie("token", token)
            .json({ id: userInfo._id, email: userInfo.email });
        }
      });
    } else {
      res.sendStatus(401);
    }
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").send();
});

app.get("/todos", (req, res) => {
  Todo.find()
    .populate("assignee")
    .sort({
      createdDate: -1,
    })
    .then((response) => {
      res.json(response);
    });
});

app.put("/todos", (req, res) => {
  const payload = jwt.verify(req.cookies.token, secret);
  const todo = new Todo({
    text: req.body.text,
    done: false,
    user: new mongoose.Types.ObjectId(payload.id),
  });
  todo.save().then((todo) => {
    res.json(todo);
  });
});

app.post("/todos", (req, res) => {
  const payload = jwt.verify(req.cookies.token, secret);
  const newTodo = new Todo({
    assignee: req.body.assignee,
    title: req.body.title,
    description: req.body.description,
    assigner: payload._id,
  });
  newTodo.save().then((data) => {
    data
      .populate("assignee")
      .execPopulate()
      .then((todo) => res.json(todo));
  });
});

app.listen(4000);
