const Customer = require('../models/Customer');
const Ticket = require('../models/Ticket');

exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ name: 1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    
    const tickets = await Ticket.find({ customerId: req.params.id }).sort({ createdAt: -1 });
    res.json({ customer, tickets });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCustomer = async (req, res) => {
  try {
    const { email, name, company } = req.body;
    
    // Find or create customer
    let customer = await Customer.findOne({ email });
    
    if (customer) {
      // Update existing customer info if provided
      if (name) customer.name = name;
      if (company) customer.company = company;
      await customer.save();
    } else {
      customer = new Customer(req.body);
      await customer.save();
    }
    
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
