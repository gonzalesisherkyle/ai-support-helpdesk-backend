const mongoose = require('mongoose');

const knowledgeArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  category: { type: String },
  visibility: { type: String, enum: ['Internal', 'Public'], default: 'Public' },
  tags: [String],
  status: { type: String, enum: ['Draft', 'Published', 'Archived'], default: 'Draft' },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  viewCount: { type: Number, default: 0 },
  usefulCount: { type: Number, default: 0 },
  notUsefulCount: { type: Number, default: 0 },
}, { timestamps: true });

// Basic text search index
knowledgeArticleSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('KnowledgeArticle', knowledgeArticleSchema);
