const mongoose = require('mongoose');

/**
 * Assets Schema
 * 
 * Represents financial assets for wealth tracking.
 * Tracks asset name, type, current value, and interest rate.
 */
const assetsSchema = new mongoose.Schema(
  {
    /**
     * Assets Name - Name or description of the asset
     * @type {String}
     * @required
     * @example "Savings Account", "Property - Main Street", "Stock Portfolio"
     */
    assetsName: {
      type: String,
      required: [true, 'Assets name is required'],
      trim: true,
      maxlength: [100, 'Assets name cannot exceed 100 characters'],
    },

    /**
     * Assets Type - Category of the asset
     * @type {String}
     * @required
     * @enum ["savings", "investment", "property", "vehicle", "stocks", "bonds", "cryptocurrency", "other"]
     */
    assetsType: {
      type: String,
      required: [true, 'Assets type is required'],
      enum: {
        values: ['savings', 'investment', 'property', 'vehicle', 'stocks', 'bonds', 'cryptocurrency', 'other'],
        message: '{VALUE} is not a valid assets type',
      },
      lowercase: true,
    },

    /**
     * Current Value - Current market or assessed value of the asset
     * @type {Number}
     * @required
     * @min 0
     */
    currentValue: {
      type: Number,
      required: [true, 'Current value is required'],
      min: [0, 'Current value cannot be negative'],
    },

    /**
     * Interest Rate - Annual interest rate or return rate (percentage)
     * @type {Number}
     * @default 0
     * @min 0
     * @max 100
     */
    interestRate: {
      type: Number,
      default: 0,
      min: [0, 'Interest rate cannot be negative'],
      max: [100, 'Interest rate cannot exceed 100%'],
    },

    /**
     * User ID - Reference to the user who owns this asset
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
assetsSchema.index({ createdBy: 1 });
assetsSchema.index({ assetsType: 1 });

module.exports = mongoose.model('Assets', assetsSchema);

