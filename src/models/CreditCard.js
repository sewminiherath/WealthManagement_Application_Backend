const mongoose = require('mongoose');

/**
 * Credit Card Schema
 * 
 * Represents credit card accounts for financial tracking.
 * Tracks bank name, card name, credit limit, outstanding balance, interest rate, and due date.
 */
const creditCardSchema = new mongoose.Schema(
  {
    /**
     * Bank Name - Name of the issuing bank
     * @type {String}
     * @required
     * @example "Chase Bank", "Bank of America", "Capital One"
     */
    bankName: {
      type: String,
      required: [true, 'Bank name is required'],
      trim: true,
      maxlength: [100, 'Bank name cannot exceed 100 characters'],
    },

    /**
     * Card Name - Name or type of the credit card
     * @type {String}
     * @required
     * @example "Visa Platinum", "Mastercard Gold", "Amex Blue"
     */
    cardName: {
      type: String,
      required: [true, 'Card name is required'],
      trim: true,
      maxlength: [100, 'Card name cannot exceed 100 characters'],
    },

    /**
     * Credit Limit - Maximum credit available
     * @type {Number}
     * @required
     * @min 0
     */
    creditLimit: {
      type: Number,
      required: [true, 'Credit limit is required'],
      min: [0, 'Credit limit cannot be negative'],
    },

    /**
     * Outstanding Balance - Current balance owed
     * @type {Number}
     * @required
     * @min 0
     */
    outstandingBalance: {
      type: Number,
      required: [true, 'Outstanding balance is required'],
      min: [0, 'Outstanding balance cannot be negative'],
      validate: {
        validator: function(value) {
          return value <= this.creditLimit;
        },
        message: 'Outstanding balance cannot exceed credit limit',
      },
    },

    /**
     * Interest Rate - Annual interest rate (APR) percentage
     * @type {Number}
     * @required
     * @min 0
     * @max 100
     */
    interestRate: {
      type: Number,
      required: [true, 'Interest rate is required'],
      min: [0, 'Interest rate cannot be negative'],
      max: [100, 'Interest rate cannot exceed 100%'],
    },

    /**
     * Due Date - Next payment due date
     * @type {Date}
     * @required
     */
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },

    /**
     * User ID - Reference to the user who owns this credit card
     * @type {ObjectId}
     * @ref User
     */
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Virtual field for available credit
creditCardSchema.virtual('availableCredit').get(function() {
  return this.creditLimit - this.outstandingBalance;
});

// Virtual field for utilization percentage
creditCardSchema.virtual('utilizationRate').get(function() {
  return this.creditLimit > 0 ? ((this.outstandingBalance / this.creditLimit) * 100).toFixed(2) : 0;
});

// Ensure virtuals are included in JSON
creditCardSchema.set('toJSON', { virtuals: true });
creditCardSchema.set('toObject', { virtuals: true });

// Index for faster queries
creditCardSchema.index({ createdBy: 1, dueDate: 1 });
creditCardSchema.index({ bankName: 1 });

module.exports = mongoose.model('CreditCard', creditCardSchema);


