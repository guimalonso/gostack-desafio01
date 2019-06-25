const express = require("express");

const app = express();

app.use(express.json());

let numberOfReqs = 0;

// Middleware para contar e exibir número de requisições
app.use((req, res, next) => {
  console.log(`Total de requisições: ${++numberOfReqs}`);

  return next();
});

const projects = [];

// Middleware para verificar se projeto com determinado id existe
function checkProjectExists(req, res, next) {
  const id = req.params.id;
  const index = projects.findIndex(item => item.id == id);
  if (index == -1) {
    return res.status(400).json({ error: "Project does not exist" });
  }

  req.index = index;

  return next();
}

// GET /projects
// Retorna todos os projetos cadastrados.
app.get("/projects", (req, res) => {
  return res.json(projects);
});

// POST /projects
// Adiciona um novo projeto.
app.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(projects);
});

// PUT /projects/:id
// Edita o título de um projeto com determinado id.
app.put("/projects/:id", checkProjectExists, (req, res) => {
  const { title } = req.body;

  const index = req.index;
  projects[index].title = title;

  return res.json(projects[index]);
});

// DELETE /projects/:id
// Remove um projeto com determinado id.
app.delete("/projects/:id", checkProjectExists, (req, res) => {
  const index = req.index;
  projects.splice(index, 1);

  return res.send();
});

// POST /projects/:id/tasks
// Adiciona uma tarefa a um projeto com determinado id.
app.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { title } = req.body;

  const index = req.index;
  projects[index].tasks.push(title);

  return res.json(projects[index]);
});

app.listen(3000);
