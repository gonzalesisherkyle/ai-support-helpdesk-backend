const KnowledgeArticle = require('../models/KnowledgeArticle');

exports.getArticles = async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};
    if (search) {
      query.$text = { $search: search };
    }
    if (category) {
      query.category = category;
    }
    const articles = await KnowledgeArticle.find(query).sort({ updatedAt: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createArticle = async (req, res) => {
  try {
    const article = new KnowledgeArticle({
      ...req.body,
      authorId: req.user.id,
      slug: req.body.title.toLowerCase().replace(/ /g, '-')
    });
    await article.save();
    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getArticleById = async (req, res) => {
  try {
    const article = await KnowledgeArticle.findById(req.params.id);
    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
