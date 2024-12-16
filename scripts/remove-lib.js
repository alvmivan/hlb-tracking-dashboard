import fs from 'fs-extra';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const libDir = join(__dirname, '../src/lib/hlb-api-library');

try {
    // Primero intentamos eliminar el submódulo de git
    try {
        // Eliminar el submódulo del .git/config
        execSync('git submodule deinit -f src/lib/hlb-api-library');
        // Eliminar el submódulo del .git/modules
        execSync('git rm -rf src/lib/hlb-api-library');
        // Limpiar el directorio .git/modules
        const gitModulesPath = join(__dirname, '../.git/modules/src/lib/hlb-api-library');
        if (fs.existsSync(gitModulesPath)) {
            fs.removeSync(gitModulesPath);
        }
        // Limpiar la entrada del archivo .gitmodules
        try {
            execSync('git config --file=.gitmodules --remove-section submodule.src/lib/hlb-api-library');
        } catch (e) {
            // Es normal que falle si la sección no existe
        }
        console.log('Submódulo Git eliminado exitosamente');
    } catch (gitErr) {
        console.log('No se encontró submódulo Git previo o error al eliminarlo:', gitErr.message);
    }

    // Luego eliminamos el directorio físicamente si existe
    if (fs.existsSync(libDir)) {
        fs.removeSync(libDir);
        console.log('Directorio de librería eliminado exitosamente');
    } else {
        console.log('El directorio no existe, continuando...');
    }

    // Limpiar el índice de git
    try {
        execSync('git rm --cached -rf src/lib/hlb-api-library');
    } catch (e) {
        // Es normal que falle si no está en el índice
    }

} catch (err) {
    console.error('Error al eliminar el directorio:', err);
    process.exit(1);
} 