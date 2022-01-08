// Todo Model //////////////////////////////////////////////////////////////////

const Todo = require("../datastore");

// Configure Express ///////////////////////////////////////////////////////////
import bodyParser from "body-parser";
// const bodyParser = require('body-parser');
import express, { Request, Response } from "express";
// const express = require("express");
import morgan from "morgan";
// const morgan = require("morgan");
import path from "path";
// const path = require("path");

const app = express();
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "./public")));

// RESTful Routes for CRUD operations //////////////////////////////////////////

// Create (Crud) -- collection route
app.post("/todo", (req: Request, res: Response) => {
  Todo.create(req.body.todoText, (err: any, newTodo: string) => {
    if (err) {
      res.sendStatus(400);
    } else {
      res.status(201).json(newTodo);
    }
  });
});

// Read all (cRud) -- collection route
app.get("/todo", (_req: Request, res: Response) => {
  Todo.readAll((err: any, todos: string[]) => {
    if (err) {
      res.sendStatus(400);
    } else {
      res.status(200).json(todos);
    }
  });
});

// Read one (cRud) -- member route
app.get("/todo/:id", (req: Request, res: Response) => {
  Todo.readOne(req.params.id, (err: any, todo: string) => {
    if (err) {
      res.sendStatus(404);
    } else {
      res.status(200).json(todo);
    }
  });
});

// Update (crUd) -- member route
app.put("/todo/:id", (req, res) => {
  Todo.update(req.params.id, req.body.todoText, (err: any, todo: string) => {
    if (err) {
      res.sendStatus(404);
    } else {
      res.status(200).json(todo);
    }
  });
});

// Delete (cruD) -- member route
app.delete("/todo/:id", (req: Request, res: Response) => {
  Todo.delete(req.params.id, (err: any) => {
    if (err) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  });
});

app.get("/", (_req: Request, res: Response) => {
  res.send("ok");
});

// Start & Initialize Web Server ///////////////////////////////////////////////

const port = 3000;
app.listen(port, () => {
  console.log("CRUDdy Todo server is running in the terminal");
  console.log(`To get started, visit: http://localhost:${port}`);
});

Todo.initialize();
