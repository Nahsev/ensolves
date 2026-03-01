const sequelize = require("./src/config/database");
const Note = require("./src/models/note.model");
const User = require("./src/models/user.model");
const bcrypt = require("bcrypt");

(async () => {
    try {
        await sequelize.authenticate();
        console.log("DB connected");

        await sequelize.sync({ alter: true });
        console.log("DB synced");

        const password = await bcrypt.hash("password123", 10);

        let u1 = await User.findOne({ where: { username: "user1" } });
        if (!u1) u1 = await User.create({ username: "user1", password });

        let u2 = await User.findOne({ where: { username: "user2" } });
        if (!u2) u2 = await User.create({ username: "user2", password });

        console.log(`User1 ID: ${u1.id}, User2 ID: ${u2.id}`);

        // === NOTES FOR USER 1 ===
        await Note.create({ title: "Work Tasks", content: "Finish the Q1 report and send it.", tags: ["work", "urgent"], userId: u1.id });
        await Note.create({ title: "Reading List", content: "The Pragmatic Programmer, Clean Code, DDIA.", tags: ["books", "learning"], userId: u1.id });
        await Note.create({ title: "Weekend Plans", content: "Go hiking on Saturday, grocery shopping Sunday.", tags: ["personal"], userId: u1.id });
        await Note.create({ title: "Meeting Agenda", content: "Discuss Q2 roadmap and team velocity.", tags: ["work", "meetings"], userId: u1.id });
        await Note.create({ title: "Ideas for side project", content: "Build a budgeting app using React and Supabase.", tags: ["ideas", "dev"], userId: u1.id });

        console.log("5 notes created for user1");

        // === NOTES FOR USER 2 ===
        await Note.create({ title: "Project Ideas", content: "Build a task manager with drag-and-drop.", tags: ["dev", "ideas"], userId: u2.id });
        await Note.create({ title: "Grocery List", content: "Milk, eggs, bread, butter, cheese.", tags: ["home", "shopping"], userId: u2.id });
        await Note.create({ title: "Fitness Goals", content: "Run 5km three times a week. Start Monday.", tags: ["health", "fitness"], userId: u2.id });
        await Note.create({ title: "Travel Plans", content: "Book flights to Tokyo for August.", tags: ["travel", "personal"], userId: u2.id });
        await Note.create({ title: "Study Notes", content: "Review Docker, Kubernetes and CI/CD pipelines.", tags: ["learning", "devops"], userId: u2.id });

        console.log("5 notes created for user2");

        process.exit(0);
    } catch (err) {
        console.error("Error:", err.message);
        process.exit(1);
    }
})();
