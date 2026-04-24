# 🌳 BFHL Full Stack Hierarchy Analyzer

A full-stack application that processes hierarchical node relationships, detects cycles, and generates structured insights using a REST API and an interactive frontend.

---

## 🚀 Live Demo

- 🔗 Frontend: https://bfhl-fullstack-one.vercel.app  
- 🔗 Backend API: https://bfhl-fullstack-1b8j.onrender.com/bfhl  

---

## 📌 Features

- ✅ Build hierarchical trees from node relationships  
- 🔄 Detect cycles in graph structures  
- ⚠️ Identify invalid input formats  
- 🔁 Handle duplicate edges efficiently  
- 📊 Generate summary statistics:
  - Total Trees
  - Total Cycles
  - Largest Tree Root  
- 🎨 Clean and interactive UI for visualization  

---

## 🧠 How It Works

1. User enters node relationships (e.g., `A->B, B->C`)
2. Frontend sends data to backend (`POST /bfhl`)
3. Backend:
   - Validates inputs
   - Removes duplicates
   - Builds graph structure
   - Detects cycles
   - Calculates tree depth
4. Response is displayed in structured format (cards)

---

## 🛠️ Tech Stack
Backend
Node.js
Express.js
CORS Middleware
Frontend
HTML
CSS
JavaScript (Vanilla)
Deployment
Backend: Render
Frontend: Vercel
