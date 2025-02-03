const nodemailer = require('nodemailer');
const path = require('path');

async function sendWelcomeEmail(userEmail, userName, pdfPath) {
  try {
    // 1. Configurer le transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'tonEmail@gmail.com',
        pass: 'tonMotDePasseOuApplicationPassword'
      }
    });

    // 2. Préparer l'email
    const mailOptions = {
      from: '"WeeBat" <tonEmail@gmail.com>',
      to: userEmail,
      subject: 'Bienvenue sur WeeBat',
      text: `Bonjour ${userName},\n\nMerci pour votre inscription !\n\nVeuillez trouver ci-joint votre première facture.`,
      // Si on a un pdfPath, on l’ajoute en pièce jointe
      attachments: pdfPath
        ? [
            {
              filename: path.basename(pdfPath),
              path: pdfPath
            }
          ]
        : []
    };

    // 3. Envoyer
    const info = await transporter.sendMail(mailOptions);
    console.log('Email envoyé: ' + info.response);
  } catch (err) {
    console.error('Erreur lors de l’envoi de l’email:', err);
  }
}

module.exports = { sendWelcomeEmail };
