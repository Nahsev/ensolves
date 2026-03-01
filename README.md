📝 Notes App – Full Stack Implementation Exercise

A simple Single Page Application (SPA) for creating, editing, archiving, deleting, and filtering notes with tags.

This project is divided into two phases:

Phase 1: Note creation (mandatory)

Phase 2: Tag application and filtering (extra points)

All data is persisted in a relational database using an ORM. No in-memory storage or mocks are used.

📦 Features
Phase 1 (Mandatory)

Create notes with title and content

Edit existing notes

Delete notes permanently

Archive / Unarchive notes

List active and archived notes

Phase 2 (Extra)

Add / remove tags (categories) for notes

Filter notes by one or multiple tags

🛠️ Technologies

Frontend: React

Backend: REST API

ORM / Database: Relational database (e.g., PostgreSQL, MySQL)

State Management: React useState + useEffect

Styling: CSS

Environment Variables: VITE_API_URL for backend API URL

The app is structured as an SPA, with frontend and backend in separate folders (frontend and backend).

📁 Project Structure
root/
│
├─ frontend/        # React SPA
│   ├─ src/
│   ├─ package.json
│   └─ ...
│
├─ backend/         # REST API
│   ├─ src/
│   ├─ package.json (or pom.xml if Java)
│   └─ ...
│
└─ start.sh           # Bash script to set up DB and run the app
🚀 Installation

Clone the repository:

git clone https://github.com/hirelens-challenges/blazquez-48e69a
cd notes-app

Run the setup script (Linux / macOS):

./start.sh

This script will:

Set up the database schema

Pre-create any required configuration files

Start both backend and frontend

Frontend runs at http://localhost:5173 (Vite dev server)

Backend runs at http://localhost:3000 (or your configured port)

📝 Usage
Creating Notes

Fill in Title, Content, and optional comma-separated Tags.

Click Submit.

Editing Notes

Click Edit on a note.

Form scrolls automatically to the top.

Modify fields and click Update.

Archiving / Unarchiving Notes

Click Archive / Unarchive to toggle note status.

Deleting Notes

Click Delete to permanently remove a note.

Filtering Notes

Filter by status: All, Active, Archived

Filter by tags: Enter tag name and click Search

Remove active tag filters by clicking ❌ on each tag

⚙️ Environment Variables

VITE_API_URL → Backend API URL (frontend)

DATABASE_URL → Database connection string (backend)

🧩 Notes

PUT is used for updating notes (REST standard)

POST is used for creating new notes

Smooth scroll is implemented for better UX when editing notes

Tag filtering works via both frontend state and backend query

🔧 Tools / Versions

Node.js 18.17+

npm 9.6+

React 18+

Vite 5+

Java 17+ (if backend is Spring Boot)

PostgreSQL / MySQL 14+