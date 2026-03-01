const sequelize = require("./src/config/database");

(async () => {
    try {
        await sequelize.authenticate();
        console.log("=======================================");
        console.log("Conexion a la base de datos EXITOSA!!!");
        console.log("=======================================");
        process.exit(0);
    } catch (error) {
        console.error("=======================================");
        console.error("ERROR conectando a la base de datos:");
        console.error(error);
        console.error("=======================================");
        process.exit(1);
    }
})();
