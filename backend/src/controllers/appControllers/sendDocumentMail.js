const mongoose = require('mongoose');
const { Resend } = require('resend');
const { loadSettings } = require('@/middlewares/settings');

const sendDocumentMail = (modelName) => async (req, res) => {
  try {
    const Model = mongoose.model(modelName);
    const { id } = req.body;

    const document = await Model.findOne({
      _id: id,
      removed: false,
    }).exec();

    if (!document) {
      return res.status(404).json({
        success: false,
        result: null,
        message: `${modelName} not found`,
      });
    }

    const clientEmail = document.client?.email;
    if (!clientEmail) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Client email is missing',
      });
    }

    const settings = await loadSettings();
    const fromEmail = settings.idurar_app_company_email || settings.idurar_app_email;
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: fromEmail || 'Fortexa <onboarding@resend.dev>',
      to: clientEmail,
      subject: `${modelName} #${document.number}${document.year ? '/' + document.year : ''} · Fortexa`,
      html: `
        <p>Hello ${document.client?.name || ''},</p>
        <p>Your ${modelName.toLowerCase()} <strong>#${document.number}</strong> is ready.</p>
        <p>Total: <strong>${document.total || document.amount || 0} ${document.currency || ''}</strong></p>
        <p>Sent from Fortexa ERP CRM.</p>
      `,
    });

    return res.status(200).json({
      success: true,
      result: document,
      message: `Email sent to ${clientEmail}`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: error.message,
      error: error.message,
    });
  }
};

module.exports = sendDocumentMail;
