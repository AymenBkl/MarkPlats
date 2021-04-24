const mongoose = require('mongoose');

module.exports.validators = {
    orderValidator : (schema) => {
        schema.path('orderId').validate(async (value) => {
            const orderCount = await mongoose.models.order.countDocuments({orderId: value });
            return !orderCount;
          }, 'order already exists');
    },

}