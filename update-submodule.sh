#!/bin/bash

# Ruta del submódulo
SUBMODULE_DIR="src/lib/hlb-api-library"

# URL del repositorio
REPO_URL="https://github.com/alvmivan/hlb-api-library"

# Enlazar el repositorio si no existe
if [ ! -d "$SUBMODULE_DIR" ]; then
  echo "Enlazando el repositorio $REPO_URL en $SUBMODULE_DIR..."
  git clone "$REPO_URL" "$SUBMODULE_DIR"
else
  echo "El repositorio ya existe, haciendo git pull..."
  cd "$SUBMODULE_DIR"
  git pull origin main
fi

# Eliminar cualquier rastro de Git en la carpeta del submódulo
echo "Eliminando rastro de git en $SUBMODULE_DIR..."
rm -rf "$SUBMODULE_DIR/.git"
