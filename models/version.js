const mongoose = require('mongoose');

const VersionSchema = new mongoose.Schema({
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
    title: String,
    description: String,
    filePath: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Version', VersionSchema);
