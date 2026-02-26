#!/usr/bin/env node

// ============================================
// CHEFMII STRIPE PRODUCTS SETUP SCRIPT
// ============================================
// Usage:
// 1. npm install stripe
// 2. Set STRIPE_SECRET_KEY in .env or .env.local
// 3. Run: node scripts/setup-stripe-products.cjs

const Stripe = require('stripe');
require('dotenv').config({ path: '.env.local' });
if (!process.env.STRIPE_SECRET_KEY) {
  require('dotenv').config({ path: '.env' });
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const SUBSCRIPTION_PRODUCTS = [
  {
    name: 'ChefMii Starter',
    description: 'Essential tools for booking chefs',
    metadata: { tier: 'starter' },
    prices: [
      { amount: 2900, interval: 'month', nickname: 'Starter Monthly' },
      { amount: 27800, interval: 'year', nickname: 'Starter Annual (20% off)' },
    ],
  },
  {
    name: 'ChefMii Professional',
    description: 'Advanced features for serious foodies',
    metadata: { tier: 'professional', popular: 'true' },
    prices: [
      { amount: 7500, interval: 'month', nickname: 'Professional Monthly' },
      { amount: 72000, interval: 'year', nickname: 'Professional Annual (20% off)' },
    ],
  },
  {
    name: 'ChefMii Influencer',
    description: 'For culinary content creators',
    metadata: { tier: 'influencer' },
    prices: [
      { amount: 10900, interval: 'month', nickname: 'Influencer Monthly' },
      { amount: 104600, interval: 'year', nickname: 'Influencer Annual (20% off)' },
    ],
  },
  {
    name: 'ChefMii Business',
    description: 'Comprehensive solutions for teams and enterprises',
    metadata: { tier: 'business' },
    prices: [
      { amount: 74900, interval: 'month', nickname: 'Business Monthly' },
      { amount: 719000, interval: 'year', nickname: 'Business Annual (20% off)' },
    ],
  },
];

const B2B_PRODUCTS = [
  {
    name: 'ChefMii Business Starter',
    description: '2 events/month, up to 25 guests per event, Certified Chef',
    metadata: { tier: 'b2b_starter', events: '2', guests: '25' },
    prices: [{ amount: 150000, interval: 'month', nickname: 'B2B Starter Monthly' }],
  },
  {
    name: 'ChefMii Business Growth',
    description: '4 events/month, up to 50 guests per event, Senior Chef',
    metadata: { tier: 'b2b_growth', events: '4', guests: '50', popular: 'true' },
    prices: [{ amount: 280000, interval: 'month', nickname: 'B2B Growth Monthly' }],
  },
];

const EVENT_PACKAGES = [
  { name: 'Birthday Bash Package', description: 'Perfect birthday celebration with private chef', metadata: { category: 'celebrations', type: 'birthday' }, price: 40000 },
  { name: 'Wedding Feast Package', description: 'Complete wedding catering solution', metadata: { category: 'celebrations', type: 'wedding', popular: 'true' }, price: 300000 },
  { name: 'Bridal Shower Package', description: 'Elegant bridal or bachelor celebration', metadata: { category: 'celebrations', type: 'bridal' }, price: 70000 },
  { name: 'Corporate Event Package', description: 'Professional corporate catering', metadata: { category: 'business', type: 'corporate' }, price: 200000 },
  { name: 'Michelin-at-Home Experience', description: 'Fine dining in your home', metadata: { category: 'luxury', type: 'michelin', popular: 'true' }, price: 150000 },
  { name: 'Yacht Chef Services', description: 'Private chef for yacht trips', metadata: { category: 'luxury', type: 'yacht' }, price: 500000 },
];

const ACADEMY_COURSES = [
  { name: 'Home Cook Weekend Intensive', description: '2-day intensive cooking course', metadata: { category: 'academy', duration: '2 days' }, price: 19900 },
  { name: 'Cuisine Masterclass', description: 'Specialized cuisine training', metadata: { category: 'academy', duration: '1-2 weeks' }, price: 35000 },
  { name: 'Food Safety Level 2', description: 'Essential food safety certification', metadata: { category: 'academy', duration: '1 day' }, price: 15000 },
  { name: 'Professional Chef Training', description: 'Full professional chef certification', metadata: { category: 'academy', duration: '6-12 months' }, price: 250000 },
];

const KIDS_ZONE = [
  { name: 'Kids Single Cooking Class', description: 'Single cooking class for ages 5-12', metadata: { category: 'kids', age: '5-12' }, price: 2500 },
  { name: 'Teen Chef Program', description: 'Cooking program for ages 13-17', metadata: { category: 'kids', age: '13-17' }, price: 4500 },
  { name: 'Kids Birthday Party Package', description: 'Cooking-themed birthday party', metadata: { category: 'kids', type: 'birthday' }, price: 15000 },
  { name: 'Holiday Camp - Full Week', description: 'Full week cooking holiday camp', metadata: { category: 'kids', type: 'camp' }, price: 20000 },
];

async function createSubscriptionProduct(product) {
  console.log(`Creating product: ${product.name}...`);
  const stripeProduct = await stripe.products.create({ name: product.name, description: product.description, metadata: product.metadata });
  const prices = [];
  for (const priceConfig of product.prices) {
    const price = await stripe.prices.create({ product: stripeProduct.id, unit_amount: priceConfig.amount, currency: 'gbp', recurring: { interval: priceConfig.interval }, nickname: priceConfig.nickname });
    prices.push({ interval: priceConfig.interval, priceId: price.id, amount: priceConfig.amount });
  }
  return { productId: stripeProduct.id, productName: product.name, prices };
}

async function createOneTimeProduct(product) {
  console.log(`Creating product: ${product.name}...`);
  const stripeProduct = await stripe.products.create({ name: product.name, description: product.description, metadata: product.metadata });
  const price = await stripe.prices.create({ product: stripeProduct.id, unit_amount: product.price, currency: 'gbp' });
  return { productId: stripeProduct.id, productName: product.name, priceId: price.id, amount: product.price };
}

async function main() {
  console.log('Starting ChefMii Stripe Products Setup...\n');
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('Error: STRIPE_SECRET_KEY not found');
    process.exit(1);
  }

  const results = { subscriptions: [], b2b: [], eventPackages: [], academy: [], kidsZone: [] };

  try {
    console.log('\nCreating Platform Subscriptions...');
    for (const product of SUBSCRIPTION_PRODUCTS) { results.subscriptions.push(await createSubscriptionProduct(product)); }

    console.log('\nCreating Business Subscriptions...');
    for (const product of B2B_PRODUCTS) { results.b2b.push(await createSubscriptionProduct(product)); }

    console.log('\nCreating Event Packages...');
    for (const product of EVENT_PACKAGES) { results.eventPackages.push(await createOneTimeProduct(product)); }

    console.log('\nCreating Academy Courses...');
    for (const product of ACADEMY_COURSES) { results.academy.push(await createOneTimeProduct(product)); }

    console.log('\nCreating Kids Zone Products...');
    for (const product of KIDS_ZONE) { results.kidsZone.push(await createOneTimeProduct(product)); }

    console.log('\n\nSETUP COMPLETE!\n');
    console.log('='.repeat(60));
    console.log(' PRICE IDS FOR .env FILE');
    console.log('='.repeat(60));

    for (const sub of results.subscriptions) {
      for (const price of sub.prices) {
        const envKey = `STRIPE_PRICE_${sub.productName.replace('ChefMii ', '').toUpperCase()}_${price.interval.toUpperCase()}`;
        console.log(`${envKey}=${price.priceId}`);
      }
    }

    console.log('\n# Business Subscriptions');
    for (const sub of results.b2b) {
      const envKey = `STRIPE_PRICE_${sub.productName.replace('ChefMii ', '').replace(/\s+/g, '_').toUpperCase()}`;
      console.log(`${envKey}=${sub.prices[0].priceId}`);
    }

    console.log('\n# Event Packages');
    for (const pkg of results.eventPackages) { console.log(`STRIPE_PRICE_${pkg.productName.replace(/\s+/g, '_').toUpperCase()}=${pkg.priceId}`); }

    console.log('\n# Academy');
    for (const course of results.academy) { console.log(`STRIPE_PRICE_${course.productName.replace(/\s+/g, '_').toUpperCase()}=${course.priceId}`); }

    console.log('\n# Kids Zone');
    for (const item of results.kidsZone) { console.log(`STRIPE_PRICE_${item.productName.replace(/\s+/g, '_').toUpperCase()}=${item.priceId}`); }

    const fs = require('fs');
    fs.writeFileSync('stripe-products-output.json', JSON.stringify(results, null, 2));
    console.log('\nFull results saved to: stripe-products-output.json');
  } catch (error) {
    console.error('\nError during setup:', error.message);
    process.exit(1);
  }
}

main();
