const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const stripe = require("stripe")(
  "sk_test_51NqcirHz9IynMNXvwPBGT0V0sqxD58E3pzZsofmf0dlynU8qr1Wnfo1hT7DIebgg3ueee9ZQ9apzOgLEmAjHM8sc00HAek0WUy"
);
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const nodemailer = require("nodemailer");
const port = process.env.PORT || 3000;
const axios = require("axios");
const imageDirectory = "/images";
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dycrj9mhl",
  api_key: "481351461482194",
  api_secret: "AWKoERtw5mOzEKgcQGDTAV4Fdls",
});
// Middle Ware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(
  "/uploads",
  express.static(path.join(__dirname, imageDirectory), {
    index: false,
    fallthrough: false,
  })
);
app.use(
  "/stories",
  express.static(path.join(__dirname, "/stories"), {
    index: false,
    fallthrough: false,
  })
);
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const fileName = `${Date.now()}${ext}`;
    cb(null, fileName);
  },
});
const storyStorage = multer.diskStorage({
  destination: "./stories",
  filename: function (req, file, cb) {
    cb(null, "story_" + Date.now() + path.extname(file.originalname));
  },
});

const storyUpload = multer({
  storage: storyStorage,
});

const upload = multer({ storage });
const VerifyJwt = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  const token = authorization.split(" ")[1];
  jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: "Forbidden Access" });
    }
    req.decoded = decoded;
    next();
  });
};

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_KEY}@cluster0.xgpzvkj.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
// When a user visits the website, store their information

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    const productCollections = client
      .db("version-originale")
      .collection("products");
    const userCollections = client.db("version-originale").collection("users");
    const categoriesCollections = client
      .db("version-originale")
      .collection("categories");
    const storyCollections = client
      .db("version-originale")
      .collection("stories");
    const couponCollection = client
      .db("version-originale")
      .collection("coupon");
    const orderCollection = client.db("version-originale").collection("orders");
    const storyTimeLine = client
      .db("version-originale")
      .collection("storyTimeLine");
    const cartCollection = client
      .db("version-originale")
      .collection("cart-products");
    const userInfoCollection = client
      .db("version-originale")
      .collection("user-info");
    const visitorsCollection = client
      .db("version-originale")
      .collection("visitors");
    //payment stripe
    app.post("/create-payment-intent", async (req, res) => {
      const { price } = req.body;
      const amount = price * 100;

      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount,
          currency: "AED",
          payment_method_types: ["card"],
        });

        res.send({ clientSecret: paymentIntent.client_secret });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Read datas from database
    function calculateTotalPages(totalItems, itemsPerPage) {
      return Math.ceil(totalItems / itemsPerPage);
    }

    function generatePageNumbers(totalPages) {
      const pageNumbers = [];
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
      return pageNumbers;
    }

    app.get("/products/all", async (req, res) => {
      try {
        const totalItems = await productCollections.countDocuments();
        const itemsPerPage = 16;
        const totalPages = calculateTotalPages(totalItems, itemsPerPage);
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * itemsPerPage;
        const limit = itemsPerPage;

        const collection = await productCollections
          .find()
          .sort({ date: -1 })
          .skip(skip)
          .limit(limit)
          .toArray();

        const pageNumbers = generatePageNumbers(totalPages);

        res.json({ products: collection, totalPages, pageNumbers });
      } catch (error) {
        console.error("Error fetching stories:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });
    app.put("/change/stock/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };

      try {
        const product = await productCollections.findOne(query);

        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }
        if (product.stock !== undefined) {
          product.stock =
            product.stock === "available" ? "unavailable" : "available";
        } else {
          product.stock = "unavailable";
        }
        const update = await productCollections.updateOne(query, {
          $set: { stock: product.stock },
        });

        if (update.modifiedCount > 0) {
          res.json({ message: "Stock availability updated successfully" });
        } else {
          res
            .status(500)
            .json({ message: "Failed to update stock availability" });
        }
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });

    app.get("/location", (req, res) => {
      const ipList =
        req.headers["x-forwarded-for"] || req.connection.remoteAddress;
      const clientIp = ipList.split(",")[0].trim();
      res.json({ ip: clientIp });
    });

    // app.get("/location", async (req, res) => {
    //   try {
    //     const ipList = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    //     const clientIp = ipList.split(",")[0].trim();
    //     const currentDate = new Date();
    //     const currentMonth = currentDate.getMonth();
    //     const currentYear = currentDate.getFullYear();
    //     const existingVisitor = await visitorsCollection.findOne({
    //       ip: clientIp,
    //       date: {
    //         $gte: new Date(currentYear, currentMonth, 1),
    //         $lt: new Date(currentYear, currentMonth + 1, 1),
    //       },
    //     });

    //     if (existingVisitor) {
    //       res.status(400).json({ message: 'Visitor already exists for this month' });
    //     } else {
    //       const visitor = {
    //         ip: clientIp,
    //         date: new Date()
    //       };
    //       await visitorsCollection.insertOne(visitor);
    //       res.json({ ip: clientIp });
    //     }
    //   } catch (error) {
    //     console.error(error);
    //     res.status(500).json({ message: 'Internal Server Error' });
    //   }
    // });

    app.get("/newProducts", async (req, res) => {
      const result = await productCollections.find().toArray();
      res.send(result);
    });
    app.get("/order/customer/az", async (req, res) => {
      const result = await orderCollection.find().toArray();
      console.log(result);
      res.send(result);
    });
    app.get("/newProduct/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollections.findOne(query);
      res.send(result);
    });

    app.get("/category/products", async (req, res) => {
      const { query } = req.query;
      const searchQuery = { category: query };
      const result = await productCollections.find(searchQuery).toArray();
      res.send(result);
    });
    app.get("/featured", async (req, res) => {
      const searchQuery = { featured: true };
      const result = await productCollections.find(searchQuery).toArray();
      res.send(result);
    });
    app.get("/api/categories", async (req, res) => {
      const result = await categoriesCollections.find().toArray();
      res.send(result);
    });
    app.delete("/vo/api/delete/category/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await categoriesCollections.deleteOne(query);
      res.send(result);
    });
    app.get("/categories", async (req, res) => {
      const result = await categoriesCollections.find().toArray();
      const pipeline = [
        {
          $group: {
            _id: "$category",
            productCount: { $sum: 1 },
          },
        },
      ];
      const categoryCounts = await productCollections
        .aggregate(pipeline)
        .toArray();
      const categoryCountMap = {};
      categoryCounts.forEach((count) => {
        categoryCountMap[count._id] = count.productCount;
      });

      const transformedData = result.map((item) => ({
        category: item.category,
        subCategory: item.subCategory || [],
        totalProducts: categoryCountMap[item.category] || 0,
      }));

      res.json(transformedData);
    });
    app.delete(
      "/categories/:categoryName/subcategories/:subCategoryName",
      async (req, res) => {
        const categoryName = req.params.categoryName;
        const subCategoryName = req.params.subCategoryName;
        try {
          const result = await categoriesCollections.updateOne(
            { category: categoryName },
            { $pull: { subCategory: subCategoryName } }
          );

          if (result.modifiedCount === 0) {
            return res
              .status(404)
              .json({ message: "Category or SubCategory not found" });
          }

          res.status(200).json({ message: "SubCategory deleted successfully" });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Internal server error" });
        }
      }
    );

    app.get("/products/search", async (req, res) => {
      const query = req.query.query;
      const regex = new RegExp(query, "i");
      const collection = await productCollections
        .find({
          productName: { $regex: regex },
        })
        .toArray();
      res.send(collection);
    });
    app.get("/sort", async (req, res) => {
      const sort = req.query.query;
      const sortQuery =
        sort === "newest"
          ? { date: 1 }
          : sort === "oldest"
          ? { date: -1 }
          : sort === "price_low_to_high"
          ? { price: 1 }
          : sort === "price_high_to_low"
          ? { price: -1 }
          : {};

      if (sort !== "") {
        const result = await productCollections
          .find()
          .sort(sortQuery)
          .toArray();
        res.send(result);
      }
    });
    app.get("/order/user/:email", async (req, res) => {
      const { email } = req.params;

      const query = { email: email };
      const result = await orderCollection.find(query).toArray();
      res.send(result);
    });
    app.get("/filter/mobile", async (req, res) => {
      const {
        minPrice,
        maxPrice,
        selectedCategories,
        selectedColors,
        selectedCurrency,
        selectedSizes,
        sort,
        page,
      } = req.query;

      let sortQuery = {};

      if (sort) {
        switch (sort) {
          case "best-selling":
            sortQuery = { featured: -1 };
            break;
          case "newest":
            sortQuery = { date: -1 };
            break;
          case "oldest":
            sortQuery = { date: 1 };
            break;
          case "price-low-to-high":
            sortQuery =
              selectedCurrency === "BDT" ? { bdPrice: 1 } : { dubaiPrice: 1 };
            break;
          case "price-high-to-low":
            sortQuery =
              selectedCurrency === "BDT" ? { bdPrice: -1 } : { dubaiPrice: -1 };
            break;
          default:
            break;
        }
      }

      const pipeline = [];

      if (selectedCategories) {
        const categoriesArray = Array.isArray(selectedCategories)
          ? selectedCategories
          : selectedCategories.split(",");
        const categoryRegexArray = categoriesArray.map(
          (category) => new RegExp(category, "i")
        );

        pipeline.push({
          $match: {
            category: { $in: categoryRegexArray },
          },
        });
      }

      // if (selectedSizes) {
      //   const sizesArray = Array.isArray(selectedSizes)
      //     ? selectedSizes
      //     : selectedSizes.split(",");

      //   // Convert sizes to lowercase
      //   const lowercaseSizes = sizesArray.map((size) => size.toLowerCase());

      //   pipeline.push({
      //     $match: {
      //       sizes: { $in: sizesArray },
      //     },
      //   });
      // }

      if (selectedColors) {
        const colorsArray = Array.isArray(selectedColors)
          ? selectedColors
          : selectedColors.split(",").map((color) => color.trim());

        // Create an array of regular expressions for selected colors
        const colorRegexArray = colorsArray.map(
          (color) => new RegExp(color, "i")
        );

        pipeline.push({
          $match: {
            colors: { $in: colorRegexArray },
          },
        });
      }
      if (selectedCurrency === "AED" || selectedCurrency === "BDT") {
        const priceField =
          selectedCurrency === "BDT" ? "bdPrice" : "dubaiPrice";
        const convertedMinPrice = minPrice ? parseFloat(minPrice) : undefined;
        const convertedMaxPrice = maxPrice ? parseFloat(maxPrice) : undefined;

        const priceMatch = {};

        if (convertedMinPrice) {
          priceMatch.$gte = convertedMinPrice;
        }

        if (convertedMaxPrice) {
          priceMatch.$lte = convertedMaxPrice;
        }

        if (Object.keys(priceMatch).length > 0) {
          pipeline.push({
            $match: {
              [priceField]: priceMatch,
            },
          });
        }
      }
      if (Object.keys(sortQuery).length > 0) {
        pipeline.push({
          $sort: sortQuery,
        });
      }

      const result = await productCollections.aggregate(pipeline).toArray();

      res.send(result);
    });

    app.post("/addtocart", async (req, res) => {
      const item = req.body;

      const userCart = await cartCollection
        .find({ added_by: item.added_by })
        .toArray();
      if (userCart.length > 0) {
        const firstItemCurrency = userCart[0].currency;
        if (item.currency !== firstItemCurrency) {
          return res
            .status(400)
            .json({ error: "Please change currency to add to cart." });
        }
      }
      const addItem = await cartCollection.insertOne(item);
      res.send(addItem);
    });

    app.delete("/cart/delete/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });
    app.put("/cart/increase/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.updateOne(query, {
        $inc: { quantity: 1 },
      });
      res.send(result);
    });
    app.put("/cart/decrease/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.updateOne(query, {
        $inc: { quantity: -1 },
      });
      res.send(result);
    });
    app.get("/cart/item", async (req, res) => {
      const { email } = req.query;

      const query = { added_by: email };
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/maxPrices", async (req, res) => {
      const maxPrices = await productCollections
        .aggregate([
          {
            $group: {
              _id: null,
              maxBdPrice: { $max: { $toInt: "$bdPrice" } },
              maxDubaiPrice: { $max: { $toInt: "$dubaiPrice" } },
            },
          },
        ])
        .toArray();
      res.send({
        maxBdPrice: maxPrices.length > 0 ? maxPrices[0].maxBdPrice : null,
        maxDubaiPrice: maxPrices.length > 0 ? maxPrices[0].maxDubaiPrice : null,
      });
    });

    app.put("/update/product/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const {
          productName,
          bdPrice,
          dubaiPrice,
          bdPriceSale,
          dubaiPriceSale,
          colorsValue,
          sizesValue,
          description,
        } = req.body;

        const query = { _id: new ObjectId(id) };

        const update = {
          $set: {
            productName: productName,
            bdPrice: bdPrice,
            dubaiPrice: dubaiPrice,
            bdPriceSale: bdPriceSale,
            dubaiPriceSale: dubaiPriceSale,
            colorsValue: colorsValue,
            sizesValue: sizesValue,
          },
        };

        if (description) {
          update.$set.description = description;
        }

        const result = await productCollections.updateOne(query, update);

        if (result.modifiedCount === 1) {
          return res
            .status(200)
            .json({ message: "Product updated successfully" });
        } else {
          return res.status(500).json({ message: "Failed to update product" });
        }
      } catch (error) {
        console.error("Error updating product:", error);
        return res.status(500).json({ message: `Internal server error ` });
      }
    });

    app.put("/update/story/:id", async (req, res) => {
      const { id } = req.params;
      const { title, content } = req.body;

      try {
        const query = { _id: new ObjectId(id) };
        const update = {
          $set: {
            title,
            content,
          },
        };

        const result = await storyCollections.updateOne(query, update);

        if (result.modifiedCount === 1) {
          return res
            .status(200)
            .json({ message: "Story updated successfully" });
        } else {
          return res.status(500).json({ message: "Failed to update story" });
        }
      } catch (error) {
        console.error("Error updating story:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    app.get("/filter", async (req, res) => {
      try {
        const {
          minPrice,
          maxPrice,
          selectedCategories,
          selectedColors,
          selectedCurrency,
          selectedSizes,
          page,
        } = req.query;
        console.log(selectedSizes);
        const pipeline = [];

        if (selectedCategories) {
          const categoriesArray = Array.isArray(selectedCategories)
            ? selectedCategories
            : selectedCategories.split(",");
          const categoryRegexArray = categoriesArray.map(
            (category) => new RegExp(category, "i")
          );

          pipeline.push({
            $match: {
              category: { $in: categoryRegexArray },
            },
          });
        }

        if (selectedColors) {
          const colorsArray = Array.isArray(selectedColors)
            ? selectedColors
            : selectedColors.split(",").map((color) => color.trim());

          // Create an array of regular expressions for selected colors
          const colorRegexArray = colorsArray.map(
            (color) => new RegExp(color, "i")
          );

          pipeline.push({
            $match: {
              colors: { $in: colorRegexArray },
            },
          });
        }
        if (selectedCurrency === "AED" || selectedCurrency === "BDT") {
          const priceField =
            selectedCurrency === "BDT" ? "bdPrice" : "dubaiPrice";
          const convertedMinPrice = minPrice ? parseFloat(minPrice) : undefined;
          const convertedMaxPrice = maxPrice ? parseFloat(maxPrice) : undefined;

          const priceMatch = {};

          if (convertedMinPrice) {
            priceMatch.$gte = convertedMinPrice;
          }

          if (convertedMaxPrice) {
            priceMatch.$lte = convertedMaxPrice;
          }

          if (Object.keys(priceMatch).length > 0) {
            pipeline.push({
              $match: {
                [priceField]: priceMatch,
              },
            });
          }
        }

        const products = await productCollections
          .aggregate(pipeline)
          .sort({ date: -1 })
          .toArray();
        res.send(products);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    app.get("/colors", async (req, res) => {
      try {
        const colors = await productCollections
          .aggregate([
            { $unwind: "$colors" },
            {
              $group: {
                _id: { $toLower: "$colors" },
                uniqueColors: { $addToSet: { $toLower: "$colors" } },
              },
            },
            { $project: { _id: 0, colors: "$uniqueColors" } },
            { $group: { _id: null, allColors: { $addToSet: "$colors" } } },
            { $project: { _id: 0, colors: "$allColors" } },
          ])
          .toArray();
        const flattenedColors =
          colors.length > 0 ? colors[0].colors.flat() : [];

        res.send(flattenedColors);
      } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });
    app.get("/sort/filter", async (req, res) => {
      const { sort, selectedCurrency } = req.query;
      let sortQuery = {};

      switch (sort) {
        case "best-selling":
          sortQuery = { featured: 1 };
          break;
        case "newest":
          sortQuery = { date: -1 };
          break;
        case "oldest":
          sortQuery = { date: 1 };
          break;
        case "price-low-to-high":
          sortQuery =
            selectedCurrency === "BDT" ? { bdPrice: 1 } : { dubaiPrice: 1 };
          break;
        case "price-high-to-low":
          sortQuery =
            selectedCurrency === "BDT" ? { bdPrice: -1 } : { dubaiPrice: -1 };
          break;
        default:
          sortQuery = { date: -1 };
          break;
      }
      if (Object.keys(sortQuery).length > 0) {
        const result = await productCollections
          .find()
          .sort(sortQuery)
          .toArray();
        res.send(result);
      } else {
        res.status(400).send("Invalid sorting option");
      }
    });

    app.get("/user", async (req, res) => {
      const email = req.query.email;
      const collection = await userCollections.findOne({ email: email });

      if (!collection) {
        res.status(404).json({ error: "User not found" });
      } else {
        res.send(collection);
      }
    });

    app.get("/product/:id", async (req, res) => {
      const { id } = req.params;
      if (id.length < 24) {
        return;
      } else {
        console.log(id.length);
        const query = { _id: new ObjectId(id) };
        const result = await productCollections.find(query).toArray();
        if (!result) {
          res.json("no data found");
        } else {
          res.send(result);
        }
      }
    });
    app.get("/user/info", async (req, res) => {
      const { email } = req.query;

      const result = await userInfoCollection
        .find({ "backup_user_data.email": email })
        .toArray();

      res.send(result);
    });

    app.get("/story/all", async (req, res) => {
      try {
        const totalItems = await storyCollections.countDocuments();
        const itemsPerPage = 6;
        const totalPages = calculateTotalPages(totalItems, itemsPerPage);
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * itemsPerPage;
        const limit = itemsPerPage;

        const collection = await storyCollections
          .find()
          .sort({ date: -1 })
          .skip(skip)
          .limit(limit)
          .toArray();

        const pageNumbers = generatePageNumbers(totalPages);

        res.json({ stories: collection, totalPages, pageNumbers });
      } catch (error) {
        console.error("Error fetching stories:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });
    app.get("/admin/story", async (req, res) => {
      const result = await storyCollections.find().toArray();
      res.send(result);
    });
    app.post("/update-user-name", async (req, res) => {
      try {
        const { email, firstName, lastName } = req.body;
        const user = await userCollections.findOne({ email: email });

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        const query = { _id: new ObjectId(user._id) };
        const update = { $set: { firstName: firstName, lastName: lastName } };

        const result = await userCollections.updateOne(query, update);

        if (result.modifiedCount === 1) {
          res.status(200).json({ message: "User name updated successfully" });
        } else {
          res.status(500).json({ message: "Failed to update user name" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    });
    app.get("/orders/all", async (req, res) => {
      try {
        const collection = await orderCollection
          .find()
          .sort({ date: -1 })
          .toArray();
        res.send(collection);
      } catch (error) {
        console.error("Error fetching:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });
    app.get("/total/orders", async (req, res) => {
      const result = await orderCollection.countDocuments();
      res.send({ result });
    });
    app.get("/revenue/admin", async (req, res) => {
      try {
        const totalRevenue = await orderCollection
          .aggregate([
            {
              $group: {
                _id: "$currency",
                total: { $sum: "$totalPrice" },
              },
            },
          ])
          .toArray();
        const totalBDT = totalRevenue.find((item) => item._id === "BDT");
        const totalBDTRevenue = totalBDT ? totalBDT.total : 0;
        const totalAED = totalRevenue.find((item) => item._id === "AED");
        const totalAEDRevenue = totalAED ? totalAED.total : 0;
        res.json({
          totalRevenue: {
            BDT: totalBDTRevenue,
            AED: totalAEDRevenue,
          },
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    });
    app.get("/orders/current-month", async (req, res) => {
      try {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        const effectiveYear =
          currentMonth === 1 ? currentYear - 1 : currentYear;
        const last5Months = [];

        // Create revenue structures for each currency
        const currencies = ["BDT", "AED"]; // Add other currencies as needed

        for (let i = 0; i < 5; i++) {
          const effectiveMonth = (currentMonth - i + 12) % 12;
          const month = effectiveMonth === 0 ? 12 : effectiveMonth;
          const year = effectiveMonth === 0 ? effectiveYear - 1 : effectiveYear;
          const monthStructure = {
            name: `${year}-${String(month).padStart(2, "0")}`,
            orders: 0,
            revenue: {},
            thisMonthAEDOrder: 0, // Initialize this month order counts
            thisMonthBDTOrder: 0, // Initialize this month order counts
          };

          // Initialize revenue for each currency
          currencies.forEach((currency) => {
            monthStructure.revenue[currency] = 0;
          });

          last5Months.push(monthStructure);
        }

        const ordersWithISODate = await orderCollection.find().toArray();
        ordersWithISODate.forEach((order) => {
          order.date = new Date(order.date).toISOString();
        });

        const ordersWithinLast5Months = await orderCollection
          .aggregate([
            {
              $addFields: {
                date: {
                  $toDate: "$date",
                },
              },
            },
            {
              $match: {
                date: {
                  $gte: new Date(effectiveYear, currentMonth - 4, 1),
                  $lte: currentDate,
                },
              },
            },
            {
              $group: {
                _id: {
                  year: { $year: "$date" },
                  month: { $month: "$date" },
                  currency: "$currency", // Group by currency as well
                },
                count: { $sum: 1 },
                totalRevenue: { $sum: "$totalPrice" },
              },
            },
          ])
          .toArray();

        ordersWithinLast5Months.forEach((result) => {
          const monthIndex = last5Months.findIndex(
            (month) =>
              month.name ===
              `${result._id.year}-${String(result._id.month).padStart(2, "0")}`
          );
          if (monthIndex !== -1) {
            last5Months[monthIndex].orders += result.count;
            last5Months[monthIndex].revenue[result._id.currency] +=
              result.totalRevenue;
            if (result._id.currency === "AED") {
              last5Months[monthIndex].thisMonthAEDOrder += result.count;
            } else if (result._id.currency === "BDT") {
              last5Months[monthIndex].thisMonthBDTOrder += result.count;
            }
          }
        });

        last5Months.sort((a, b) => {
          if (
            a.name ===
            `${effectiveYear}-${String(currentMonth + 1).padStart(2, "0")}`
          ) {
            return -1;
          } else if (
            b.name ===
            `${effectiveYear}-${String(currentMonth + 1).padStart(2, "0")}`
          ) {
            return 1;
          } else {
            return a.name.localeCompare(b.name);
          }
        });
        const totalRevenue = await orderCollection
          .aggregate([
            {
              $group: {
                _id: "$currency",
                total: { $sum: "$totalPrice" },
              },
            },
          ])
          .toArray();

        const totalRevenues = {};
        totalRevenue.forEach((item) => {
          totalRevenues[item._id] = item.total;
        });

        res.json({
          totalRevenue: totalRevenues,
          last5MonthsOrders: last5Months,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.delete("/vo/api/v1/delete/product/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await productCollections.deleteOne(query);
      res.send(result);
    });
    app.get("/returning", async (req, res) => {
      try {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        const effectiveYear =
          currentMonth === 1 ? currentYear - 1 : currentYear;
        const last5Months = [];

        for (let i = 0; i < 5; i++) {
          const effectiveMonth = (currentMonth - i + 12) % 12;
          const month = effectiveMonth === 0 ? 12 : effectiveMonth;
          const year = effectiveMonth === 0 ? effectiveYear : effectiveYear;
          const monthStructure = {
            name: `${year}-${String(month).padStart(2, "0")}`,
            newCustomers: 0,
            returningCustomers: 0,
          };

          const startDate = new Date(year, month - 1, 1);
          const endDate = new Date(year, month, 0, 23, 59, 59);

          const aggregationPipeline = [
            {
              $addFields: {
                date: {
                  $toDate: "$date",
                },
              },
            },
            {
              $match: {
                date: {
                  $gte: startDate,
                  $lte: endDate,
                },
              },
            },
            {
              $group: {
                _id: "$email",
                firstOrderDate: { $min: "$date" },
              },
            },
            {
              $group: {
                _id: "$_id",
                orderDates: { $push: "$firstOrderDate" },
                emails: { $first: "$email" },
              },
            },
            {
              $project: {
                _id: 1,
                orderDates: 1,
                email: 1,
                hasOrderPreviousMonth: {
                  $gte: [startDate, { $min: "$orderDates" }],
                },
                hasOrderCurrentMonth: {
                  $lte: [endDate, { $max: "$orderDates" }],
                },
              },
            },

            {
              $group: {
                _id: "$_id",
                newCustomers: {
                  $sum: {
                    $cond: {
                      if: { $eq: ["$hasOrderPreviousMonth", false] },
                      then: 1,
                      else: 0,
                    },
                  },
                },
                returningCustomers: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $eq: ["$hasOrderPreviousMonth", true] },
                          { $eq: ["$hasOrderCurrentMonth", true] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },

                email: { $first: "$email" },
              },
            },

            {
              $sort: {
                _id: 1,
              },
            },
            {
              $project: {
                _id: 0,
                name: "$_id",
                newCustomers: 1,
                returningCustomers: 1,
                emails: 1,
              },
            },
          ];

          const result = await orderCollection
            .aggregate(aggregationPipeline)
            .toArray();

          if (result.length > 0) {
            monthStructure.newCustomers = result[0].newCustomers;
            monthStructure.returningCustomers = result[0].returningCustomers;
          }

          last5Months.push(monthStructure);
        }
        last5Months.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });

        res.json({
          last5MonthsCustomers: last5Months,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.get("/data/current-month/each-day", async (req, res) => {
      try {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        const currentDay = currentDate.getDate();

        // Create revenue structures for each currency
        const currencies = ["BDT", "AED"]; // Add other currencies as needed
        const currentMonthData = [];

        for (let day = 1; day <= currentDay; day++) {
          const date = new Date(currentYear, currentMonth - 1, day);
          const monthStructure = {
            name: `${currentYear}-${String(currentMonth).padStart(
              2,
              "0"
            )}-${String(day).padStart(2, "0")}`,
            orders: 0,
            revenue: {},
          };

          // Initialize revenue for each currency
          currencies.forEach((currency) => {
            monthStructure.revenue[currency] = 0;
          });

          currentMonthData.push(monthStructure);
        }

        const ordersWithISODate = await orderCollection.find().toArray();
        ordersWithISODate.forEach((order) => {
          order.date = new Date(order.date).toISOString();
        });

        const ordersWithinCurrentMonth = await orderCollection
          .aggregate([
            {
              $addFields: {
                date: {
                  $toDate: "$date",
                },
              },
            },
            {
              $match: {
                date: {
                  $gte: new Date(currentYear, currentMonth - 1, 1),
                  $lte: currentDate,
                },
              },
            },
            {
              $group: {
                _id: {
                  year: { $year: "$date" },
                  month: { $month: "$date" },
                  day: { $dayOfMonth: "$date" },
                  currency: "$currency", // Group by currency as well
                },
                count: { $sum: 1 },
                totalRevenue: { $sum: "$totalPrice" },
              },
            },
          ])
          .toArray();

        ordersWithinCurrentMonth.forEach((result) => {
          const dayIndex = currentMonthData.findIndex(
            (day) =>
              day.name ===
              `${result._id.year}-${String(result._id.month).padStart(
                2,
                "0"
              )}-${String(result._id.day).padStart(2, "0")}`
          );
          if (dayIndex !== -1) {
            currentMonthData[dayIndex].orders += result.count;
            currentMonthData[dayIndex].revenue[result._id.currency] +=
              result.totalRevenue;
          }
        });

        const totalRevenue = await orderCollection
          .aggregate([
            {
              $group: {
                _id: "$currency",
                total: { $sum: "$totalPrice" },
              },
            },
          ])
          .toArray();

        const totalRevenues = {};
        totalRevenue.forEach((item) => {
          totalRevenues[item._id] = item.total;
        });

        res.json({
          totalRevenue: totalRevenues,
          currentMonthData: currentMonthData,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.post("/add/category", async (request, response) => {
      const { category } = request.body;

      const existingCategory = await categoriesCollections.findOne({
        category: category,
      });

      if (existingCategory) {
        return response.status(400).json({ error: "Category already exists." });
      }
      const schema = { category, subCategory: [] };
      const result = await categoriesCollections.insertOne(schema);

      response.status(201).json({
        message: "Category added successfully",
        category: result,
      });
    });

    app.post("/add/subCategory", async (request, response) => {
      const { category, subCategory } = request.body;
      const dbCategory = await categoriesCollections.findOne({
        category: category,
      });
      if (!dbCategory) {
        return response.status(404).json({ message: "Category not found" });
      }
      if (dbCategory.subCategory.includes(subCategory)) {
        return response
          .status(400)
          .json({ message: "Subcategory already exists" });
      }
      const updatedCategory = await categoriesCollections.updateOne(
        { category: category },
        { $push: { subCategory: subCategory } }
      );
      if (updatedCategory.modifiedCount === 0) {
        return response
          .status(500)
          .json({ message: "Failed to add subcategory" });
      } else {
        response
          .status(200)
          .json({ message: "Subcategory added successfully" });
      }
    });
    app.post("/admin/order/custom/create", async (req, res) => {
      const email = req.query.email;
      const { payment_info } = req.body;
      const result = await orderCollection.insertOne(payment_info);
      const errorMessages = [];
      for (const orderItem of payment_info.order_items) {
        const product = orderItem.item;
        const newSize = JSON.parse(product.sizes);
        const orderedQuantity = orderItem.quantity;
        const orderedSize = orderItem.size;
        const orderedColor = orderItem.color;
        if (newSize[orderedSize] < orderedQuantity) {
          errorMessages.push(`Not enough stock for size ${orderedSize}`);
        } else {
          newSize[orderedSize] -= orderedQuantity;
          const updatedSizes = JSON.stringify(newSize);

          const updateResult = await productCollections.updateOne(
            { _id: new ObjectId(product._id) },
            { $set: { sizes: updatedSizes } }
          );

          if (updateResult.modifiedCount !== 1) {
            errorMessages.push(
              `Failed to update size for product: ${product._id}`
            );
          }
        }
      }
      res.send(result);
    });

    app.post("/custom/order", async (req, res) => {
      const email = req.query.email;
      const { payment_info } = req.body;

      const result = await orderCollection.insertOne(payment_info);
      const deleteFromCart = await cartCollection.deleteMany({
        added_by: email,
      });

      const errorMessages = [];
      for (const orderItem of payment_info.order_items) {
        const product = orderItem.item;
        const newSize = JSON.parse(product.sizes);
        const orderedQuantity = orderItem.quantity;
        const orderedSize = orderItem.size;

        if (newSize[orderedSize] < orderedQuantity) {
          errorMessages.push(`Not enough stock for size ${orderedSize}`);
        } else {
          newSize[orderedSize] -= orderedQuantity;
          const updatedSizes = JSON.stringify(newSize);

          const updateResult = await productCollections.updateOne(
            { _id: new ObjectId(product._id) },
            { $set: { sizes: updatedSizes } }
          );

          if (updateResult.modifiedCount !== 1) {
            errorMessages.push(
              `Failed to update size for product: ${product._id}`
            );
          }
        }
        const itemRows = payment_info.order_items
          .map((item) => {
            return `
          <tr>
            <td>${item.item.productName}</td>
            <td>${item.quantity}</td>
            <td>${item.price} ${payment_info.currency}</td>
            <td>${(item.quantity * item.price).toFixed(2)} ${
              payment_info.currency
            }</td>
          </tr>
        `;
          })
          .join("");

        const transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
          },
        });

        const mail_option = {
          from: {
            name: "Version Originale",
            address: "web.versionoriginale@gmail.com",
          },
          to: payment_info.email,
          subject: "Order Confirmation - Version Originale",
          html: `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Order Confirmation</title>
              <style>
          body,
          p {
            margin: 0;
            padding: 0;
          }
    
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            text-align: center;
          }
    
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border: 1px solid #e1e1e1;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            padding: 20px;
            text-align: left;
          }
    
          .header {
            background-color: #38453e;
            color: #fff;
            padding: 15px;
            text-align: center;
          }
    
          .logo {
            max-width: 150px;
            margin: 0 auto;
          }
    
          .order-details {
            margin-top: 20px;
          }
    
          .order-details h2 {
            font-size: 20px;
            color: #333;
          }
    
          .order-details p {
            font-size: 16px;
            color: #666;
          }
    
          .order-summary {
            margin-top: 20px;
            border-top: 1px solid #e1e1e1;
            padding-top: 20px;
          }
    
          .order-summary h3 {
            font-size: 18px;
            color: #333;
          }
    
          .order-summary p {
            font-size: 16px;
            color: #666;
          }
    
          .footer {
            margin-top: 20px;
            background-color: #f4f4f4;
            padding: 10px 0;
            color: #666;
          }
        </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <img
                    class="logo"
                    src="https://cdn.discordapp.com/attachments/1033802282560659519/1152680328608092240/logo.webp"
                    alt="Company Logo"
                  />
                </div>
                <div class="order-details">
                  <h2>Order Confirmation</h2>
                  <p>Dear ${payment_info.firstName} ${
            payment_info.lastName
          },</p>
                  <p>Your order #${
                    result.insertedId
                  } has been confirmed. Here are the details:</p>
                  <ul>
                    <li>Order Date: ${new Date(
                      payment_info.date
                    ).toLocaleDateString()}</li>
                    <li>Shipping Address: ${payment_info.address}, ${
            payment_info.city
          }, ${payment_info.country}</li>
                    <li>Payment Method: ${payment_info.method}</li>
                  </ul>
                </div>
                <div class="order-summary">
                  <h3>Order Summary</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemRows}
                    </tbody>
                    <tfoot>
                      <tr>
                      <tr>
                      <td colspan="3">Subtotal</td>
                      <td>
                        ${(
                          payment_info.totalPrice -
                          payment_info.totalPrice * 0.15 -
                          (payment_info.currency === "BDT" ? 80 : 10)
                        ).toFixed(2)} ${payment_info.currency}
                      </td>
                    </tr>
                    <tr>
                      <td colspan="3">Tax</td>
                      <td>${(payment_info.totalPrice * 0.15).toFixed(2)} ${
            payment_info.currency
          }</td>
                    </tr>
                    <tr>
                      <td colspan="3">Shipping</td>
                      <td>${
                        payment_info.currency === "BDT" ? "80 BDT" : "10 AED"
                      }</td>
                    </tr>
                    <tr>
                      <td colspan="3">Total</td>
                      <td>${payment_info.totalPrice.toFixed(2)} ${
            payment_info.currency
          }</td>
                    </tr>
                    
                    </tfoot>
                  </table>
                </div>
                <div class="footer">
                  <p>
                    If you have any questions or concerns, please contact our customer
                    support at web.versionoriginale@gmail.com.
                  </p>
                  <p>Thank you for shopping with us!</p>
                </div>
              </div>
            </body>
          </html>
        `,
        };

        transporter.sendMail(mail_option, (error, info) => {
          if (error) {
            console.log(error);
            res.status(500).json({ error: "Error sending email" });
          } else {
            res.status(200).json({ message: "Email sent successfully" });
          }
        });

        res.send(result);
      }
    });
    app.post("/add/product", upload.array("files", 5), async (req, res) => {
      try {
        const formData = req.body;
        const files = req.files;

        const resizedImageLinks = await Promise.all(
          files.map(async (file) => {
            const resizedImageResult = await cloudinary.uploader.upload(
              file.path,
              {
                width: 325,
                height: 246,
                crop: "fit",
              }
            );
            return resizedImageResult.secure_url;
          })
        );

        const imageLinks = await Promise.all(
          files.map(async (file) => {
            const originalImageResult = await cloudinary.uploader.upload(
              file.path
            );
            return originalImageResult.secure_url;
          })
        );

        const newProduct = {
          productName: formData.productName,
          bdPrice: parseFloat(formData.bdPrice),
          bdPriceSale: parseFloat(formData.bdPriceSale),
          dubaiPrice: parseFloat(formData.dubaiPrice),
          dubaiPriceSale: parseFloat(formData.dubaiPriceSale),
          category: formData.category,
          subCategory: formData.subCategory,
          featured: formData.featured,
          colors: formData.colors,
          sizes: formData.sizes,
          sizesValue: formData.sizesValue,
          colorsValue: formData.colorsValue,
          description: formData.description,
          productImage: imageLinks,
          resizedImages: resizedImageLinks,
          date: new Date(),
        };

        const result = await productCollections.insertOne(newProduct);
        res.json({ message: "Form data received successfully", result });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    });
    app.post("/newsletter", (request, response) => {
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mail_option = {
        from: {
          name: request.body?.email,
          address: request.body?.email,
        },
        to: "web.versionoriginale@gmail.com",
        subject: "New Subscriber to Newsletter",
        html: `
          <p>Dear <b>Version Orginals,</b> </p>
          <p> ${request.body?.email} has subscribed to your newsletter.</p>
          <p><b>Contact Email:</b> ${request.body?.email}</p>
          <p> <b> With regards, </b> </p>
          <p>Customer </p>
        `,
      };

      transporter.sendMail(mail_option, (error, info) => {
        if (error) {
          console.log(error);
          response.status(500).json({ error: "Error sending email" });
        } else {
          response.status(200).json({ message: "Email sent successfully" });
        }
      });
    });
    // Node Mailer //
    app.post("/send", (request, response) => {
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mail_option = {
        from: {
          name: request.body?.firstName + " " + request.body?.lastName,
          address: request.body?.email,
        },
        to: "web.versionoriginale@gmail.com",
        subject: request.body?.reason,
        html: `
                <p>Dear <b>Version Orginals,</b> </p>
                <p>${request.body?.feedback}</p>
                <p> <b> With regards, </b> </p>
                <p>${request.body?.firstName} ${request.body?.lastName} </p>
            `,
      };

      transporter.sendMail(mail_option, (error, info) => {
        if (error) {
          console.log(error);
          response.status(500).json({ error: "Error sending email" });
        } else {
          response.status(200).json({ message: "Email sent successfully" });
        }
      });
    });

    app.put("/order/status/update/:id", async (req, res) => {
      const { id } = req.params;
      const active_status = req.body.active_status;
      const query = { _id: new ObjectId(id) };
      const order = await orderCollection.updateOne(query, {
        $set: { active_status: active_status },
      });
      res.send(order);
    });
    app.post("/add/story", storyUpload.single("file"), async (req, res) => {
      const title = req.body.title;
      const content = req.body.content;
      const category = req.body.category;
      const file = req.file;
      const result = await cloudinary.uploader.upload(file.path);
      const image = result.secure_url;
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate
        .toLocaleString("en-US", { month: "long" })
        .toLowerCase();

      const newStory = {
        title: title,
        content: content,
        image: image,
        category: category,
        year: year,
        month: month,
        date: currentDate,
      };
      try {
        const result = await storyCollections.insertOne(newStory);
        const storyTimeLineDocument = await storyTimeLine.findOne();
        if (!storyTimeLineDocument) {
          await storyTimeLine.insertOne({
            dynamicArray: [{ year, months: [month] }],
          });
        } else {
          const existingYearEntry = storyTimeLineDocument.dynamicArray.find(
            (entry) => entry.year === year
          );

          if (existingYearEntry) {
            if (!existingYearEntry.months.includes(month)) {
              existingYearEntry.months.push(month);
            }
          } else {
            storyTimeLineDocument.dynamicArray.push({ year, months: [month] });
          }

          await storyTimeLine.updateOne(
            { _id: storyTimeLineDocument._id },
            {
              $set: { dynamicArray: storyTimeLineDocument.dynamicArray },
            }
          );
        }

        res.status(200).json({ message: "Story added successfully", result });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    });
    app.delete("/delete/story/:id", async (req, res) => {
      const storyId = req.params.id;

      try {
        // Find the story to delete by its _id
        const deletedStory = await storyCollections.findOneAndDelete({
          _id: new ObjectId(storyId),
        });

        if (!deletedStory.value) {
          return res.status(404).json({ error: "Story not found" });
        }

        // Get the year and month of the deleted story
        const { year, month } = deletedStory.value;

        // Check if there are any other stories for the same year and month
        const otherStoriesInMonth = await storyCollections.findOne({
          year,
          month,
        });

        if (!otherStoriesInMonth) {
          // If no other stories exist for the same month, remove it from the timeline
          await storyTimeLine.updateOne(
            {},
            { $pull: { dynamicArray: { year, months: [month] } } }
          );
        }

        res.status(200).json({ message: "Story deleted successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.get("/order", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const order = await orderCollection.find(query).toArray();
      res.send(order);
    });
    app.post("/user/info", async (req, res) => {
      const backupUserData = req.body;
      const userEmail = backupUserData.email;

      // Try to find a document with the provided email
      const existingUser = await userInfoCollection.findOne({
        email: userEmail,
      });

      if (existingUser) {
        // If a document with the email exists, update it
        const result = await userInfoCollection.updateOne(
          { email: userEmail },
          { $set: backupUserData }
        );

        if (result.modifiedCount > 0) {
          res.status(200).json({ message: "User information updated" });
        } else {
          res.status(400).json({ message: "User information not updated" });
        }
      } else {
        // If no document with the email is found, insert a new one
        const insertResult = await userInfoCollection.insertOne(backupUserData);

        if (insertResult.insertedCount === 1) {
          res.status(201).json({ message: "User information inserted" });
        } else {
          res.status(400).json({ message: "User information not inserted" });
        }
      }
    });

    app.get("/story/timeline", async (req, res) => {
      const result = await storyTimeLine.find().toArray();
      res.send(result);
    });
    app.get("/story/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await storyCollections.find(query).toArray();
      res.send(result);
    });

    app.get("/filtered/stories", async (req, res) => {
      const year = req.query.year;
      const month = req.query.month;
      const query = { year: parseInt(year), month: month };
      const result = await storyCollections.find(query).toArray();
      res.send(result);
    });
    app.get("/customers", async (req, res) => {
      const query = { role: "customer" };
      const result = await userCollections.find(query).toArray();
      res.send(result);
    });

    app.post("/add-coupon", async (req, res) => {
      const { code, discount } = req.body;
      try {
        const result = await couponCollection.insertOne({
          code,
          discount,
          validity: true,
        });
        res.status(201).json(result.ops[0]);
      } catch (error) {
        res.status(500).json({ error: "Error adding coupon" });
      }
    });
    app.get("/get-coupons", async (req, res) => {
      const result = await couponCollection.find({ validity: true }).toArray();
      res.send(result);
    });
    app.get("/coupon", async (req, res) => {
      const { code } = req.query;

      const result = await couponCollection.findOne({ code: code });

      if (!result) {
        return res.status(404).json({ message: "Coupon Code Not Found" });
      }

      if (!result.validity) {
        return res.status(400).json({ message: "Expired Coupon Code" });
      }

      res.status(200).json({ valid: true, data: result });
    });

    app.put("/expired/coupon/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const update = await couponCollection.updateOne(query, {
        $set: { validity: false },
      });
      res.send(update);
    });

    app.put("/change/featured/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const item = await productCollections.findOne(query);
      if (item.featured) {
        const result = await productCollections.updateOne(query, {
          $set: { featured: false },
        });
        res.send(result);
      }
      if (!item.featured) {
        const result = await productCollections.updateOne(query, {
          $set: { featured: true },
        });
        res.send(result);
      }
    });

    app.get("/success", (request, response) => {
      response.send("Your Message was Successfully Send!");
    });

    app.post("/user/:email", async (req, res) => {
      const email = req.params.email;
      const isExist = await userCollections.findOne({ email: email });
      if (isExist) {
        return res.send({ exist: true });
      }
      const user = req.body;
      const result = await userCollections.insertOne(user);
      res.send(result);
    });

    // jwt
    // app.post("/jwt", (req, res) => {
    //   const { email } = req.body;
    //   const token = jwt.sign(email, process.env.TOKEN_SECRET, {
    //     expiresIn: "30d",
    //   });
    //   res.send({ token });
    // });

    // Verify Admin
    // const VerifyAdmin = async (req, res, next) => {
    //   const email = req.decoded.email;
    //   const query = { email: email };
    //   const user = await userCollections.findOne(query);
    //   if (user?.role !== "admin") {
    //     return res.status(401).send({ message: "Unauthorized" });
    //   }
    //   next();
    // };

    // Check Admin

    app.get("/admin/:email", VerifyJwt, async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      if (req.decoded.email !== email) {
        return res.send({ admin: false });
      }
      const user = await userCollections.findOne(query);
      res.send({ admin: user?.role === "admin" });
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Version Originals");
});

app.listen(port, () => {
  console.log(`port is running in ${port}`);
});
