const sequelize = require("./src/config/database");
const Note = require("./src/models/note.model");
const User = require("./src/models/user.model");

(async () => {
    try {
        await sequelize.authenticate();
        console.log("DB connected");

        const notes = await Note.findAll({ limit: 5 });
        console.log("Sample notes with userId:");
        console.log(JSON.stringify(notes, null, 2));

        const check = await sequelize.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'Notes'");
        console.log("Columns in Notes table:");
        console.log(JSON.stringify(check[0], null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
