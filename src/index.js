import { app, swaggerDocs } from './app.js';
import { sequelize } from './config/dbconfig/db.config.js';
import { initModels } from './models/init.models.js';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.APP_PORT || 3001;

async function main() {
    try {
        await sequelize.authenticate();
        initModels();
        await sequelize.sync();
        app.listen(PORT, () => {
            console.log(`Servidor escuchando en el puerto ${PORT}`);
            swaggerDocs(app, PORT);
        });
    } catch (error) {
        console.error("error al iniciar Sequelize (DB)", error);
    }
}

main();