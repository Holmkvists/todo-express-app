const express = require("express");
const exphbs = require("express-handlebars");
const todosArray = require("./data/todos");

const app = express();

app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "main",
    extname: ".hbs",
  })
);

app.set("view engine", "hbs");

function createNewId(array) {
  let newId = 0;

  for (const item of array) {
    if (item.id > newId) {
      newId = item.id;
    }
  }

  return newId + 1;
}

function getDateTime() {
  let today = new Date();
  let date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  let time = today.getHours() + ":" + today.getMinutes();
  let currentDateTime = date + " " + time;

  return currentDateTime;
}

console.log(todosArray);

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("home", { todosArray });
});

app.post("/", (req, res) => {
  const id = createNewId(todosArray);

  const newTodo = {
    id: id,
    description: req.body.description,
    created: getDateTime(),
    status: "In progress",
  };

  console.log(newTodo);
  todosArray.push(newTodo);
  res.redirect("/");
});

app.get("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todosArray.find((t) => t.id === id);

  res.render("todo-detailed", todo);
});

app.get("/todos/:id/edit", (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todosArray.find((t) => t.id === id);

  res.render("todo-edit", todo);
});

app.post("/todos/:id/edit", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todosArray.findIndex((t) => t.id === id);

  todosArray[index].description = req.body.description;
  todosArray[index].status = req.body.status;

  console.log(todosArray);
  res.redirect("/todos/" + id);
});

app.get("/todos/:id/delete", (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todosArray.find((t) => t.id === id);

  res.render("todo-delete", todo);
});

app.post("/todos/:id/delete", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todosArray.findIndex((t) => t.id === id);

  todosArray.splice(index, 1);

  res.redirect("/");
});

app.listen(8000, () => {
  console.log("http://localhost:8000/");
});
