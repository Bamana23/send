const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 2000;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "frontend")));

// Vérification du chargement des variables d'environnement
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("Erreur: EMAIL_USER et EMAIL_PASS doivent être définis dans le fichier .env");
    process.exit(1);
}

// Configuration du transporteur Nodemailer
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587, // Changement du port pour tester avec TLS
    secure: false, // TLS activé
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

// Vérification de la connexion SMTP
transporter.verify((error, success) => {
    if (error) {
        console.error("Erreur de connexion SMTP:", error);
    } else {
        console.log("Serveur SMTP prêt à envoyer des e-mails");
    }
});

// Route API pour envoyer des e-mails
app.post("/send", async (req, res) => {
    const { recipients, subject, message } = req.body;
    
    if (!recipients || !subject || !message) {
        return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    try {
        const mailOptions = {
            from: `"${process.env.SENDER_NAME || "Expéditeur"}" <${process.env.EMAIL_USER}>`, // Utilisation de SENDER_NAME
            to: Array.isArray(recipients) ? recipients.join(",") : recipients,
            subject: subject,
            text: message.replace(/<[^>]*>?/gm, ''), // Convertir le HTML en texte brut
            html: `<!DOCTYPE html><html><body><p>${message}</p></body></html>`, // Assurer une bonne structure HTML
        };

        await new Promise(resolve => setTimeout(resolve, 2000)); // Pause pour éviter le blocage
        await transporter.sendMail(mailOptions);
        res.json({ success: "E-mails envoyés avec succès." });
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'e-mail:", error);
        res.status(500).json({ error: error.message });
    }
});

// Servir l'interface React
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
