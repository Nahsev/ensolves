const app = require("./src/app")
const sequelize = require("./src/config/database")
require("dotenv").config()



const PORT = process.env.PORT || 3000;
(async () => {
  try {
    await sequelize.authenticate(); // prueba la conexión
    console.log("Conectado a Neon con éxito!");
    
    await sequelize.sync(); // sincroniza los modelos (crea tablas si no existen)
    console.log("Database sincronizada correctamente");

    app.listen(PORT, () => {
      console.log(`Server corriendo en el puerto ${PORT}`);
    });

  } catch (error) {
    console.error("Error conectando a la base de datos:", error);
  }
})();