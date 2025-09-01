import { app, swaggerDocs } from './app.js';
import { initModels, initDb, insertDevs } from './models/init.models.js';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.APP_PORT || 3001;

async function main() {
    try {
        initModels()
        await initDb()
        if (process.env.APP_MODE === 'dev') {
                await insertDevs()
        } 

        app.listen(PORT, () => {
            console.log(`Servidor escuchando en el puerto ${PORT}`);
            swaggerDocs(app, PORT);
        });
    } catch (error) {
        console.error("error al iniciar Sequelize (DB)", error);
    }
}

main();