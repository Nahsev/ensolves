const API = "http://localhost:3000";

async function login(username, password) {
    const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    console.log(`[login] ${username} -> status: ${res.status}, token: ${data.token ? data.token.slice(0, 30) + "..." : "NONE"}`);
    return data.token;
}

async function createNote(token, title, content, tags = []) {
    const res = await fetch(`${API}/notes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, tags }),
    });
    const data = await res.json();
    console.log(`[POST /notes] "${title}" -> status: ${res.status}, id: ${data.id}, userId: ${data.userId}`);
    return data;
}

(async () => {
    console.log("=== Logging in user1 ===");
    const token1 = await login("user1", "password123");

    console.log("\n=== Creating notes for user1 ===");
    await createNote(token1, "User1 - Work Tasks", "Finish the Q1 report and send it.", ["work", "urgent"]);
    await createNote(token1, "User1 - Reading List", "The Pragmatic Programmer, Clean Code.", ["books"]);
    await createNote(token1, "User1 - Weekend Plans", "Go hiking on Saturday, grocery shopping.", ["personal"]);

    console.log("\n=== Logging in user2 ===");
    const token2 = await login("user2", "password123");

    console.log("\n=== Creating notes for user2 ===");
    await createNote(token2, "User2 - Project Ideas", "Build a task manager with drag-and-drop.", ["dev", "ideas"]);
    await createNote(token2, "User2 - Grocery List", "Milk, eggs, bread, butter.", ["home"]);
    await createNote(token2, "User2 - Fitness Goals", "Run 5km three times a week.", ["health"]);

    console.log("\nDone!");
})();
