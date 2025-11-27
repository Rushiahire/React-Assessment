# Task Management Application

A modern, responsive, drag-and-drop **Task Manager** built using **React, TypeScript, Redux Toolkit, Vite, and JSON-Server**.  
It includes user authentication, task CRUD operations, kanban-style dragging, form validation, modals, protected routes, and more.

---

## 🚀 Features

### 🔐 Authentication

- Login & Register (username/email + password)
- Google reCAPTCHA v2 verification
- Redux-based auth state
- Protected Routes
- Auto-redirect logged-in users

### 🗂️ Task Management

- Create, Edit, Delete Tasks
- Prevent Duplicate Tasks
- Task Properties: **priority**, **deadline**, **stage**
- Stages:
  - Backlog
  - To Do
  - Ongoing
  - Done

---

## Tech Stack

### **Frontend**

- React 18
- TypeScript
- Redux Toolkit
- React Router
- Formik + Yup
- Bootstrap
- @hello-pangea/dnd (Drag & Drop)
- React Icons
- React Toastify
- Vite

## 📦 Installation

### Clone the repository

```bash
git clone https://github.com/Rushiahire/React-Assessment.git
cd kanban-board

npm install

npx json-server --watch db.json --port 5000
npm run dev

```
