const express = require("express");
const cors = require("cors");
const pool = require("./db");
const bcrypt = require("bcrypt");
const { response } = require("express");
const jwtGenerator = require("./jwtGenerator");
const authorization = require("./middleware/authorization");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const stripe = require("stripe")(
  "sk_test_51JSONbCXjj4lbhryLD91uOc2aPH75q4mKfzvAyahn6kvINvCEiszohO0X68ynJpHcaXB4qGVxNpe1FdyEo9zRyIC00M6LuUEl6"
);

const app = express();

app.use(
  cors({
    origin: "https://samsfruitstore-pernstack.netlify.app",
    credentials: true,
  })
);
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.json());
app.get("/", async (req, res) => {
  res.send("hello world");
});

//get products

app.get("/products", async (req, res) => {
  try {
    const products = await pool.query(`SELECT * FROM products_table`);
    res.json(products.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get users

app.get("/users", async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM user_table");
    res.json(users.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get single user
app.get("/users/:id", authorization, async (req, res) => {
  try {
    const id = req.params.id;

    res.send(id);

    // const user = await pool.query(`SELECT * FROM user_table WHERE id = ${id}`);

    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//create user

app.post("/create_user", async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await pool.query(
      "INSERT INTO user_table(username, email, password) VALUES($1, $2, $3) RETURNING * ",
      [userName, email, hashedPassword]
    );

    // const token = jwtGenerator(newUser.rows[0].id)

    res.json(newUser);
  } catch (err) {
    console.error(err.message);

    res.status("400").send(err);
  }
});

//login

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query("SELECT * FROM user_table WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).send("incorrect password or email");
    }

    const hashedPassword = user.rows[0].password;

    let pwMatch = await bcrypt.compare(password, hashedPassword);

    if (!pwMatch) {
      return res.status(401).send("incorrect password or email");
    }

    const token = jwtGenerator(user.rows[0].id);
    const userName = user.rows[0].username;

    res.cookie("token", token, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
    });
    console.log("hello");

    res.json({ token, userName });
  } catch (err) {
    console.error(err.message);
  }
});

//verify user

app.get("/verify", async (req, res) => {
  try {
    const cookie = req.cookies.token;

    if (jwt.verify(cookie, process.env.JWT_SECRET)) {
      res.send("valid user");
    }
  } catch (err) {
    if (err.message === "jwt expired") {
      res.status(401).send(err.message);
      res.cookie("token", cookie, {
        secure: true,
        httpOnly: true,
        maxAge: 0,
        sameSite: "none",
      });
    } else {
      res.status(401).send("unauthorised");
    }
    console.error(err.message);
  }
});

//logout

app.get("/logout", async (req, res) => {
  const cookie = req.cookies.token;
  try {
    res
      .cookie("token", cookie, {
        secure: true,
        httpOnly: true,
        maxAge: 0,
        sameSite: "none",
      })
      .send("lovely jubbly");
  } catch (err) {
    res.status(401).send("unauthorised");
    console.error(err.message);
  }
});

app.post("/pay", async (req, res) => {
  const { total, items } = req.body;
  const products = await pool.query(`SELECT * FROM products_table`);
  const productArray = products.rows;
  const prices = [];
  productArray.forEach((prod) =>
    items.forEach((item) => {
      if (item.name === prod.product_name) {
        prices.push(parseFloat(prod.product_price) * item.qty);
      }
    })
  );

  const checkTotal = prices
    .reduce((total, current) => total + current)
    .toFixed(2);
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: parseInt(checkTotal * 100),
      currency: "gbp",
    });

    const id = paymentIntent.id;
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log(error);
    res.status("");
  }
});

app.post("/confirm_order", async (req, res) => {
  const token = req.cookies.token;
  const userId = parseInt(jwt.decode(token).user);
  const total = parseInt(JSON.stringify(req.body.total * 100));
  const date = Date();
  const items = req.body.items;
  try {
    const newOrder = await pool.query(
      "INSERT INTO orders_table(user_id, amount, order_date, items) VALUES($1, $2, $3, $4) RETURNING * ",
      [userId, total, date, items]
    );

    return res.status(200);
  } catch (error) {
    console.log(error.message);
  }
});

const PORT = 5432;

app.listen(process.env.PORT || PORT);
