const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const getCheckoutSession = catchAsync(async (req, res) => {
  // 1) Get currently vbooked tour
  const tour = await Tour.findById(req.params.tourId);

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [
          `https://www.google.com/url?sa=i&url=https%3A%2F%2Fstocksnap.io%2Fsearch%2Fnature&psig=AOvVaw1Q21IHuB3-wCXi_tHrZtC5&ust=1620070146023000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCIil9t_dq_ACFQAAAAAdAAAAABAD`,
        ],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1,
      },
    ],
  });

  // 3) Create session response
  res.status(200).json({
    status: 'success',
    session,
  });
});

module.exports = { getCheckoutSession };
