const mongoose = require('mongoose');
const moment = require('moment');

const Quote = mongoose.model('Quote');
const Invoice = mongoose.model('Invoice');
const { increaseBySettingKey, loadSettings } = require('@/middlewares/settings');

const convertQuoteToInvoice = async (req, res) => {
  try {
    const quote = await Quote.findOne({
      _id: req.params.id,
      removed: false,
    }).exec();

    if (!quote) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Quote not found',
      });
    }

    if (quote.converted) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'This quote has already been converted to an invoice',
      });
    }

    const settings = await loadSettings();
    const nextNumber = Number(settings.last_invoice_number || 0) + 1;
    const clientId = quote.client?._id || quote.client;

    const invoice = await new Invoice({
      createdBy: req.admin._id,
      number: nextNumber,
      year: quote.year || moment().year(),
      content: quote.content,
      date: quote.date,
      expiredDate: quote.expiredDate,
      client: clientId,
      items: quote.items.map((item) => ({
        itemName: item.itemName,
        description: item.description,
        quantity: item.quantity,
        price: item.price,
        total: item.total,
      })),
      taxRate: quote.taxRate || 0,
      subTotal: quote.subTotal,
      taxTotal: quote.taxTotal,
      total: quote.total,
      currency: quote.currency,
      discount: quote.discount || 0,
      notes: quote.notes,
      paymentStatus: 'unpaid',
      status: 'pending',
      converted: {
        from: 'quote',
        quote: quote._id,
      },
    }).save();

    const fileId = 'invoice-' + invoice._id + '.pdf';
    const savedInvoice = await Invoice.findOneAndUpdate(
      { _id: invoice._id },
      { pdf: fileId },
      { new: true }
    ).exec();

    await Quote.findOneAndUpdate(
      { _id: quote._id },
      { converted: true, status: 'accepted' },
      { new: true }
    ).exec();

    await increaseBySettingKey({
      settingKey: 'last_invoice_number',
    });

    return res.status(200).json({
      success: true,
      result: savedInvoice,
      message: 'Quote converted to invoice successfully',
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

module.exports = convertQuoteToInvoice;
