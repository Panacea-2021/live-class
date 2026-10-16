# Live Class Website

Teacher broadcasts live, enrolled students watch. Node.js + LiveKit.

## Sample logins
Teachers (password teacher123): ravi@school.com, priya@school.com, arjun@school.com
Students (password student123): anil@student.com, sneha@student.com, kiran@student.com, meena@student.com, rahul@student.com

## Environment variables (set these on your host)
- APP_SECRET        any long random text
- LIVEKIT_URL       wss://your-project.livekit.cloud
- LIVEKIT_API_KEY   from livekit.io
- LIVEKIT_API_SECRET from livekit.io

## Run locally
npm install
cp .env.example .env   (fill values)
npm start
Open http://localhost:3000

## Start command for hosting: npm start
## Build command for hosting: npm install

## Adding your own data
Edit data.json:
- users: add people (unique id, name, email, password, role = "teacher" or "student")
- classes: add classes (unique id, title, description, time, teacherId, enrolled = list of student ids)
After editing, commit the change on GitHub; Render redeploys automatically.
