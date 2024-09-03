import mongoose, { Schema, Document, model } from 'mongoose';

// Define the Order interface
export interface IOrder extends Document {
    orderType: 'buy' | 'sell';  // Buy (long) or Sell (short)
    pair: string;               // Trading pair, e.g., EUR/USD, BTC/USD
    positionSize: number;       // Amount of money used for the trade
    leverage: number;           // Leverage multiplier
    stopLoss: number;           // Stop Loss value
    takeProfit: number;         // Take Profit value
    entryPrice: number;         // Price at which the order was opened
    exitPrice?: number;         // Price at which the order was closed (optional, only when closed)
    status: 'open' | 'closed';  // Whether the trade is open or closed
}

// Define the Order Schema
const OrderSchema: Schema = new Schema(
    {
        orderType: {
            type: String,
            enum: ['buy', 'sell'],
            required: [true, "Please specify if this is a buy or sell order"],
        },
        pair: {
            type: String,
            required: [true, "Please specify the trading pair"],
        },
        positionSize: {
            type: Number,
            required: [true, "Please specify the position size"],
        },
        leverage: {
            type: Number,
            required: [true, "Please specify the leverage"],
            default: 1,  // Default leverage value
        },
        stopLoss: {
            type: Number,
            required: [true, "Please specify a stop loss"],
        },
        takeProfit: {
            type: Number,
            required: [true, "Please specify a take profit"],
        },
        entryPrice: {
            type: Number,
            required: [true, "Please specify the entry price"],
        },
        exitPrice: {
            type: Number,
            default: null,  // Exit price is set when the order is closed
        },
        status: {
            type: String,
            enum: ['open', 'closed'],
            default: 'open',  // Order starts as open
        },
    },
    {
        timestamps: true,  // Automatically manage createdAt and updatedAt fields
    }
);

// Create and export the Order model
export const Order = model<IOrder>("Order", OrderSchema);
