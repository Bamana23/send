const readmeContent = `# Projet: Envoi d'e-mails en masse

## Installation
1. Clonez ce dépôt
2. Installez les dépendances : \`npm install\`
3. Configurez le fichier \`.env\`
4. Lancez le serveur : \`node server.js\`

## Déploiement sur Render
- Assurez-vous d'ajouter les variables d'environnement EMAIL_USER et EMAIL_PASS dans Render.
- Déployez le projet en suivant les instructions de Render.`;
fs.writeFileSync("README.md", readmeContent);
console.log("Fichier README.md créé avec succès.");