/**
 * Sample Data Generator for Financial Recommendation System
 * 
 * This script populates the database with sample financial data
 * to test the recommendation system
 * 
 * Run with: node sample-data.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Import models
const Assets = require('./src/models/Assets');
const Income = require('./src/models/Income');
const Liability = require('./src/models/Liability');
const CreditCard = require('./src/models/CreditCard');

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Sample data
const sampleAssets = [
  {
    assetsName: 'Emergency Savings Account',
    assetsType: 'savings',
    currentValue: 15000,
    interestRate: 2.5
  },
  {
    assetsName: '401k Retirement Fund',
    assetsType: 'investment',
    currentValue: 45000,
    interestRate: 7.2
  },
  {
    assetsName: 'Stock Portfolio - Tech Stocks',
    assetsType: 'stocks',
    currentValue: 25000,
    interestRate: 12.5
  },
  {
    assetsName: 'Primary Residence',
    assetsType: 'property',
    currentValue: 350000,
    interestRate: 0
  },
  {
    assetsName: 'Investment Property',
    assetsType: 'property',
    currentValue: 180000,
    interestRate: 0
  },
  {
    assetsName: 'Tesla Model 3',
    assetsType: 'vehicle',
    currentValue: 35000,
    interestRate: 0
  },
  {
    assetsName: 'Bitcoin Holdings',
    assetsType: 'cryptocurrency',
    currentValue: 8000,
    interestRate: 0
  },
  {
    assetsName: 'Government Bonds',
    assetsType: 'bonds',
    currentValue: 12000,
    interestRate: 3.8
  }
];

const sampleIncome = [
  {
    incomeSource: 'Software Engineer Salary',
    amount: 8500,
    frequency: 'monthly',
    dateReceived: new Date('2024-01-15')
  },
  {
    incomeSource: 'Freelance Web Development',
    amount: 2500,
    frequency: 'monthly',
    dateReceived: new Date('2024-01-10')
  },
  {
    incomeSource: 'Investment Dividends',
    amount: 800,
    frequency: 'quarterly',
    dateReceived: new Date('2024-01-01')
  },
  {
    incomeSource: 'Rental Property Income',
    amount: 2200,
    frequency: 'monthly',
    dateReceived: new Date('2024-01-01')
  },
  {
    incomeSource: 'Annual Bonus',
    amount: 15000,
    frequency: 'yearly',
    dateReceived: new Date('2023-12-15')
  }
];

const sampleLiabilities = [
  {
    liabilityName: 'Home Mortgage',
    type: 'mortgage',
    outstandingAmount: 280000,
    interestRate: 4.2,
    dueDate: new Date('2024-02-01')
  },
  {
    liabilityName: 'Student Loan',
    type: 'student-loan',
    outstandingAmount: 25000,
    interestRate: 5.8,
    dueDate: new Date('2024-01-15')
  },
  {
    liabilityName: 'Car Loan',
    type: 'car-loan',
    outstandingAmount: 18000,
    interestRate: 3.9,
    dueDate: new Date('2024-01-20')
  },
  {
    liabilityName: 'Personal Loan',
    type: 'personal-loan',
    outstandingAmount: 8000,
    interestRate: 7.5,
    dueDate: new Date('2024-01-25')
  }
];

const sampleCreditCards = [
  {
    bankName: 'Chase Bank',
    cardName: 'Chase Sapphire Preferred',
    creditLimit: 15000,
    outstandingBalance: 3200,
    interestRate: 18.9,
    dueDate: new Date('2024-01-15')
  },
  {
    bankName: 'American Express',
    cardName: 'Amex Gold Card',
    creditLimit: 25000,
    outstandingBalance: 1800,
    interestRate: 19.2,
    dueDate: new Date('2024-01-20')
  },
  {
    bankName: 'Capital One',
    cardName: 'Capital One Venture',
    creditLimit: 8000,
    outstandingBalance: 1200,
    interestRate: 20.5,
    dueDate: new Date('2024-01-18')
  },
  {
    bankName: 'Bank of America',
    cardName: 'Bank of America Cash Rewards',
    creditLimit: 12000,
    outstandingBalance: 4500,
    interestRate: 17.9,
    dueDate: new Date('2024-01-22')
  }
];

// Create sample data
const createSampleData = async () => {
  try {
    console.log('📊 Creating sample financial data...');
    
    // Clear existing data
    await Promise.all([
      Assets.deleteMany({}),
      Income.deleteMany({}),
      Liability.deleteMany({}),
      CreditCard.deleteMany({})
    ]);
    
    console.log('🗑️ Cleared existing data');
    
    // Create sample assets
    const createdAssets = await Assets.insertMany(sampleAssets);
    console.log(`✅ Created ${createdAssets.length} assets`);
    
    // Create sample income
    const createdIncome = await Income.insertMany(sampleIncome);
    console.log(`✅ Created ${createdIncome.length} income records`);
    
    // Create sample liabilities
    const createdLiabilities = await Liability.insertMany(sampleLiabilities);
    console.log(`✅ Created ${createdLiabilities.length} liabilities`);
    
    // Create sample credit cards
    const createdCreditCards = await CreditCard.insertMany(sampleCreditCards);
    console.log(`✅ Created ${createdCreditCards.length} credit cards`);
    
    // Calculate totals
    const totalAssets = sampleAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
    const totalIncome = sampleIncome.reduce((sum, income) => {
      const amount = income.amount;
      switch (income.frequency) {
        case 'monthly': return sum + amount;
        case 'quarterly': return sum + (amount / 3);
        case 'yearly': return sum + (amount / 12);
        default: return sum + amount;
      }
    }, 0);
    const totalLiabilities = sampleLiabilities.reduce((sum, liab) => sum + liab.outstandingAmount, 0);
    const totalCreditCardDebt = sampleCreditCards.reduce((sum, card) => sum + card.outstandingBalance, 0);
    const netWorth = totalAssets - totalLiabilities - totalCreditCardDebt;
    
    console.log('\n📈 Financial Summary:');
    console.log(`💰 Total Assets: $${totalAssets.toLocaleString()}`);
    console.log(`💵 Monthly Income: $${totalIncome.toLocaleString()}`);
    console.log(`🏠 Total Liabilities: $${totalLiabilities.toLocaleString()}`);
    console.log(`💳 Credit Card Debt: $${totalCreditCardDebt.toLocaleString()}`);
    console.log(`📊 Net Worth: $${netWorth.toLocaleString()}`);
    
    console.log('\n🎉 Sample data created successfully!');
    console.log('💡 You can now test the recommendation system with:');
    console.log('   curl http://localhost:3000/api/recommendations/general');
    console.log('   curl http://localhost:3000/api/recommendations/all');
    
  } catch (error) {
    console.error('❌ Error creating sample data:', error.message);
    throw error;
  }
};

// Main function
const main = async () => {
  try {
    await connectDB();
    await createSampleData();
    
    console.log('\n✅ Sample data setup complete!');
    console.log('🚀 Start your server and test the recommendations:');
    console.log('   npm start');
    console.log('   node test-recommendations.js');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
  }
};

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  sampleAssets,
  sampleIncome,
  sampleLiabilities,
  sampleCreditCards,
  createSampleData
};



