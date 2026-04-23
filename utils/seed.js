require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Team = require('../models/Team');
const Customer = require('../models/Customer');
const Ticket = require('../models/Ticket');
const Message = require('../models/Message');
const KnowledgeArticle = require('../models/KnowledgeArticle');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Team.deleteMany({});
    await Customer.deleteMany({});
    await Ticket.deleteMany({});
    await Message.deleteMany({});
    await KnowledgeArticle.deleteMany({});

    // Create Team
    const team = await Team.create({
      name: 'Tier 1 Support',
      description: 'Primary customer support team'
    });

    // Create Agent
    const agent = await User.create({
      name: 'Sarah Agent',
      email: 'agent@supportpilot.ai',
      password: 'password123',
      role: 'Support Agent',
      teamId: team._id
    });

    // Create Customers
    const customer1 = await Customer.create({
      name: 'John Doe',
      email: 'john@techcorp.com',
      company: 'TechCorp',
      plan: 'Pro',
      isVIP: true
    });

    const customer2 = await Customer.create({
      name: 'Jane Smith',
      email: 'jane@startup.io',
      company: 'Startup IO',
      plan: 'Basic'
    });

    // Create Knowledge Base Articles
    await KnowledgeArticle.create([
      {
        title: 'How to Reset Your Password',
        slug: 'reset-password',
        content: 'To reset your password, go to the login page and click "Forgot Password". You will receive an email with instructions.',
        category: 'Account Access',
        status: 'Published'
      },
      {
        title: 'API Authentication Guide',
        slug: 'api-auth',
        content: 'To authenticate with our API, use a Bearer token in the Authorization header. You can generate tokens in the settings dashboard.',
        category: 'Technical',
        status: 'Published'
      },
      {
        title: 'Billing Cycles and Invoices',
        slug: 'billing-cycles',
        content: 'We bill on the 1st of every month. Invoices are available in your account settings under the "Billing" tab.',
        category: 'Billing',
        status: 'Published'
      }
    ]);

    // Create Sample Ticket
    const ticket = await Ticket.create({
      customerId: customer1._id,
      subject: 'Urgent: Cannot access my account',
      description: 'I am getting a 403 error when trying to log in. I need this fixed ASAP as I have a meeting in 10 minutes.',
      status: 'New',
      priority: 'Urgent',
      category: 'Account Access',
      aiAnalysis: {
        summary: 'Customer John Doe from TechCorp (VIP) is unable to log in due to a 403 error and requires urgent assistance.',
        category: 'Account Access',
        subcategory: 'Login Error',
        urgencyScore: 9,
        sentiment: 'Frustrated',
        confidence: 0.95,
        recommendedRoute: 'Technical Support',
        escalationRequired: true
      }
    });

    await Message.create({
      ticketId: ticket._id,
      senderType: 'System',
      body: 'Ticket created and assigned to Tier 1 Support.'
    });

    console.log('Seeding complete!');
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seed();
