const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generateInitialInvoice(user, subscriptionPrice) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const fileName = `facture-initiale-${user.id}.pdf`;
      const filePath = path.join(__dirname, fileName);
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      doc.fontSize(20).text('Facture initiale', { align: 'center' });
      doc.moveDown();

      doc.fontSize(14).text(`Client : ${user.fullName}`);
      doc.text(`Offre choisie : ${user.plan} (${subscriptionPrice} €/mois)`);
      doc.text(`Adresse de facturation : 
        ${user.billingAddress}, 
        ${user.billingCity} ${user.billingPostcode}, 
        ${user.billingCountry}
      `);
      doc.moveDown();

      doc.text('Merci pour votre confiance !', { align: 'right' });

      doc.end();

      stream.on('finish', () => {
        resolve(filePath);
      });
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { generateInitialInvoice };
