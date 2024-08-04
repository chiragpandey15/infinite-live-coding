const Document = require('../models/version');
const Version = require('../models/version');
const fs = require('fs');
const path = require('path');

// Create Document
exports.createDocument = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        const userId = req.user.id;
        const filePath = req.file.path;
        const document = new Document({
            title,
            description,
            filePath,
            userId
        });
        await document.save();
        res.status(201).json(document);
    } catch (err) {
        next(err);
    }
};

// Get Documents
exports.getDocuments = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const documents = await Document.find({ userId });
        res.json(documents);
    } catch (err) {
        next(err);
    }
};

// Download Document
exports.downloadDocument = async (req, res, next) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) return res.status(404).json({ message: 'Document not found' });
        res.download(path.resolve(document.filePath));
    } catch (err) {
        next(err);
    }
};

// Update Document
exports.updateDocument = async (req, res, next) => {
    try {
        const document = await Document.findById(req.params.id);
        if (!document) return res.status(404).json({ message: 'Document not found' });
        if (document.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
        
        document.title = req.body.title || document.title;
        document.description = req.body.description || document.description;

        if (req.file) {
            fs.unlinkSync(path.resolve(document.filePath)); // Delete old file
            document.filePath = req.file.path;
        }
        
        const version = new Version({
            documentId: document._id,
            title: document.title,
            description: document.description,
            filePath: document.filePath
        });
        await version.save();

        await document.save();
        res.json(document);
    } catch (err) {
        next(err);
    }
};

exports.searchDocuments = async (req, res, next) => {
    try {
        const { query } = req.query;
        const userId = req.user.id;
        const documents = await Document.find({ 
            userId,
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        });
        res.json(documents);
    } catch (err) {
        next(err);
    }
};

// Get Document Versions
exports.getDocumentVersions = async (req, res, next) => {
    try {
        const versions = await Version.find({ documentId: req.params.id });
        res.json(versions);
    } catch (err) {
        next(err);
    }
};
