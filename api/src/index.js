import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import knex from "./database_client.js";
import nestedRouter from "./routers/nested.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const apiRouter = express.Router();

//future-meals
apiRouter.get("/future-meals", async(req, res) => {
try {
  //Get the current day and time
  const currentDateTime = new Date();

  //Query all the meals where "when" is in the future
  const futureMeals = await knex('Meal').where('when_meal', '>', currentDateTime);

  //Send the future meals a JSON responde
  res.json(futureMeals);
} catch (error) {
  console.error("Error fetching future meals:", error);
  res.status(500).json({error: "Internal Server Error"});
  }
});

//past-meals
apiRouter.get("/past-meals", async(req,res) => {
try{
  const currentDateTime = new Date();
  const pastMeals = await knex('Meal').where('when_meal', '<', currentDateTime);

  res.json(pastMeals);
} catch(error) {
  console.error("Error fetching past meals:", error);
  res.status(500).json({error: "Internal Server Error"});
}
});

//all-meals	Respond with all meals sorted by ID

apiRouter.get("/all-meals", async(req,res) => {
try {
  const allMeals = await knex('Meal')
  .select('*')
  .orderBy('id', 'asc');
  res.json(allMeals);
} catch(error) {
  console.error("Error fetching past meals:", error);
  res.status(500).json({error: "Internal Server Error"});
}

});

//First-meal
apiRouter.get("/first-meal", async(req,res) => {
  try {
    const firstMeal = await knex('Meal')
    .select('*')
    .orderBy('id', 'asc')
    .first();
    res.json(firstMeal);
  } catch(error) {
    console.error("Error fetching past meals:", error);
    res.status(500).json({error: "Internal Server Error"});
  }
  
  });

  //Last-meal
apiRouter.get("/last-meal", async(req,res) => {
  try {
    const lastMeal = await knex('Meal')
    .select('*')
    .orderBy('id', 'desc')
    .first();
    if (lastMeal) {
      res.json(lastMeal);
    } else {
      res.status(404).json({ error: "No meals found" });
    }
  } catch(error) {
    console.error("Error fetching past meals:", error);
    res.status(500).json({error: "Internal Server Error"});
  }
  
  });

// apiRouter.get("/future-meals", async (req, res) => {
  
//   const SHOW_TABLES_QUERY =
//     process.env.DB_CLIENT === "pg"
//       /? "SELECT * FROM pg_catalog.pg_tables;"
//       : "SHOW TABLES;";
//   const tables = await knex.raw(SHOW_TABLES_QUERY);
//   res.json({ tables });
// });

// This nested router example can also be replaced with your own sub-router
apiRouter.use("/nested", nestedRouter);

app.use("/api", apiRouter);

app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});
