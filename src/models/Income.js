const mongoose = require('mongoose');

/**
 * Income Schema
 * 
 * Represents income sources and earnings for financial tracking.
 * Tracks income source, amount, frequency (e.g., monthly, weekly), and date received.
 */
const incomeSchema = new mongoose.Schema(
  {
    /**
     * Income Source - Description of the income source
     * @type {String}
     * @required
     * @example "Salary", "Freelance", "Investment Returns"
     */
    incomeSource: {
      type: String,
      required: [true, 'Income source is required'],
      trim: true,
      maxlength: [100, 'Income source cannot exceed 100 characters'],
    },

    /**
     * Amount - Income amount
     * @type {Number}
     * @required
     * @min 0
     */
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },

    /**
     * Frequency - How often the income is received
     * @type {String}
     * @required
     * @enum ["daily", "weekly", "bi-weekly", "monthly", "quarterly", "yearly", "one-time"]
     */
    frequency: {
      type: String,
      required: [true, 'Frequency is required'],
      enum: {
        values: ['daily', 'weekly', 'bi-weekly', 'monthly', 'quarterly', 'yearly', 'one-time'],
        message: '{VALUE} is not a valid frequency',
      },
      lowercase: true,
    },

    /**
     * Date Received - Date when the income was received
     * @type {Date}
     * @required
     */
    dateReceived: {
      type: Date,
      required: [true, 'Date received is required'],
    },

    /**
     * User ID - Reference to the user who owns this income record
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
incomeSchema.index({ createdBy: 1, dateReceived: -1 });
incomeSchema.index({ frequency: 1 });

module.exports = mongoose.model('Income', incomeSchema);


