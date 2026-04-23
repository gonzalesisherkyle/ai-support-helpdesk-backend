const KnowledgeArticle = require('../models/KnowledgeArticle');

class RagService {
  async findRelevantArticles(query) {
    try {
      // Basic text search using MongoDB $text index
      const articles = await KnowledgeArticle.find(
        { $text: { $search: query } },
        { score: { $meta: "textScore" } }
      )
      .sort({ score: { $meta: "textScore" } })
      .limit(3);

      return articles;
    } catch (error) {
      console.error('RAG Search Error:', error);
      return [];
    }
  }

  async getContextForQuery(query) {
    const articles = await this.findRelevantArticles(query);
    if (articles.length === 0) return "No relevant knowledge base articles found.";

    return articles.map(a => `Article: ${a.title}\nContent: ${a.content}`).join('\n\n---\n\n');
  }
}

module.exports = new RagService();
