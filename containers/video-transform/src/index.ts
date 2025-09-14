import dotenv from "dotenv";
import { reciveMessage } from "./aws/sqs.js";
dotenv.config();

setInterval(() => {
  console.log("Interval running");
  reciveMessage();
}, 20000);
