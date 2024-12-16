import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// En módulos ES, __dirname no está disponible, así que lo creamos
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sourceDir = join(__dirname, '../src/lib/hlb-api-library');
const backupDir = join(__dirname, '../src/lib/hlb-api-library.backup');

try {
    // Asegurarse de que el directorio existe
    if (fs.existsSync(sourceDir)) {
        // Remover backup anterior si existe
        if (fs.existsSync(backupDir)) {
            fs.removeSync(backupDir);
        }
        // Copiar directorio
        fs.copySync(sourceDir, backupDir);
        console.log('Backup completado exitosamente');
    } else {
        console.log('El directorio source no existe, saltando backup');
    }
} catch (err) {
    console.error('Error durante el backup:', err);
    process.exit(1);
} 