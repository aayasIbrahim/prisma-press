import app from "./app";
import "dotenv/config"
import { prisma } from "./lib/prisma";
import config from "./config";
const port = process.env.port
const main = async () => {
  try {
    // await prisma.$connect();
    console.log(`database connected`)
    app.listen(config.port, () => {
      console.log(`App listening on port ${port}`);
    });
  } catch (error) {
    console.error(`Error starting the server : ${error}`);
    // await prisma.$disconnect();
    process.exit(1);
  }
};
main();
