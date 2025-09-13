import { categories } from "../db/schema";
import { db } from "../db/index";

export const categoryNames = [
  "Cars and vehicles",
  "Comedy",
  "Education",
  "Gaming",
  "Entertainment",
  "Flim and animation",
  "How-to and style",
  "Music",
  "News and politics",
  "People and blogs",
  "Pets and animals",
  "Science and technology",
  "Sports",
  "Travel and events",
];

async function main() {
  try {
    const values = categoryNames.map((name) => ({ name }));
    await db.insert(categories).values(values);
    console.log("Category seeded successfully");
  } catch (err) {
    console.log(err);
  }
}

export { main };
