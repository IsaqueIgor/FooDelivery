const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressInfo = {
  street: String,
  locality: String,
  apt: String,
  cep: String,
  phone: Number,
  latitude: Number,
  longitude: Number,
};

const restaurantSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    tags: {
      type: String,
      required: true,
    },
    formattedAddress: {
      type: String,
      required: true,
    },
    imageUrl: [
      {
        type: String,
        required: true,
      },
    ],
    address: addressInfo,
    minOrderAmount: Number,
    costForOne: Number,
    payment: [
      {
        type: String,
        required: true,
      },
    ],
    account: { type: Schema.Types.ObjectId, required: true, ref: 'Account' },
    items: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Restaurant', restaurantSchema);
