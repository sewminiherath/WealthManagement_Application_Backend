const mongoose = require('mongoose');

/**
 * Liability Schema
 * 
 * Represents financial liabilities and debts.
 * Tracks liability name, type, outstanding amount, interest rate, and due date.
 */
const liabilitySchema = new mongoose.Schema(
  {
    /**
     * Liability Name - Name or description of the liability
     * @type {String}
     * @required
     * @example "Home Loan", "Car Loan", "Personal Loan"
     */
    liabilityName: {
      type: String,
      required: [true, 'Liability name is required'],
      trim: true,
      maxlength: [100, 'Liability name cannot exceed 100 characters'],
    },

    /**
     * Type - Category of the liability
     * @type {String}
     * @required
     * @enum ["loan", "mortgage", "personal-loan", "car-loan", "student-loan", "medical", "other"]
     */
    type: {
      type: String,
      required: [true, 'Liability type is required'],
      enum: {
        values: ['loan', 'mortgage', 'personal-loan', 'car-loan', 'student-loan', 'medical', 'other'],
        message: '{VALUE} is not a valid liability type',
      },
      lowercase: true,
    },

    /**
     * Outstanding Amount - Current amount owed
     * @type {Number}
     * @required
     * @min 0
     */
    outstandingAmount: {
      type: Number,
      required: [true, 'Outstanding amount is required'],
      min: [0, 'Outstanding amount cannot be negative'],
    },

    /**
     * Interest Rate - Annual interest rate (percentage)
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
     * Due Date - Next payment or final repayment due date
     * @type {Date}
     * @required
     */
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },

    /**
     * User ID - Reference to the user who owns this liability
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

// Index for faster queries
liabilitySchema.index({ createdBy: 1, dueDate: 1 });
liabilitySchema.index({ type: 1 });

module.exports = mongoose.model('Liability', liabilitySchema);


