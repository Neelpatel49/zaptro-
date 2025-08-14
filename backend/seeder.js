// seed.js (idempotent/upsert-based)
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const User = require("./models/User");

const products = require("./data/products");

dotenv.config();

async function connect() {
  await mongoose.connect(process.env.MONGO_URI, {
    // optional: modern options
  });
}

async function seed({ reset = false } = {}) {
  await connect();

  try {
    if (reset) {
      // DANGEROUS: wipes data (what your current script does)
      await Promise.all([
        Product.deleteMany({}),
        // Keep users/orders if you want: remove these lines if not resetting all
        // require("./models/Cart").deleteMany({}),
        // require("./models/Checkout").deleteMany({}),
        // require("./models/Order").deleteMany({}),
      ]);
      console.log("Collections cleared (per --reset).");
    }

    // Ensure an admin user exists (idempotent)
    const admin = await User.findOneAndUpdate(
      { email: "admin@example.com" },
      { $setOnInsert: { name: "Admin User", password: "123456", role: "admin" } },
      { upsert: true, new: true }
    );

    // Make sure SKU has a unique index (prevents dupes)
    try {
      await Product.collection.createIndex({ sku: 1 }, { unique: true });
    } catch (_) { /* ignore if exists */ }

    // Build bulk upserts by SKU (no deletes)
    const ops = products.map((p) => ({
      updateOne: {
        filter: { sku: p.sku },
        update: {
          $set: { ...p, user: admin._id },  // replace fields to your source of truth
          $setOnInsert: { createdFromSeed: true },
        },
        upsert: true,
      },
    }));

    const res = await Product.bulkWrite(ops, { ordered: false });

    console.log("Upsert complete:");
    console.log(`  matched:  ${res.matchedCount ?? 0}`);
    console.log(`  modified: ${res.modifiedCount ?? 0}`);
    console.log(`  upserted: ${res.upsertedCount ?? 0}`);

  } catch (err) {
    console.error("Seeding error:", err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

// CLI: node seed.js          -> safe upsert (no wipes)
//      node seed.js --reset  -> wipe products then reinsert
const reset = process.argv.includes("--reset");
seed({ reset });
