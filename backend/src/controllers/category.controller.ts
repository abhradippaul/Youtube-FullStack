import { Request, Response } from "express";
import { db } from "../db/index";
import { categories } from "../db/schema";

export async function getCategories(req: Request, res: Response) {
  try {
    const categoryList = await db
      .select({ id: categories.id, name: categories.name })
      .from(categories);

    res.status(200).json({
      categoryList,
      msg: "Category found successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      err,
      msg: "Some thing went wrong",
    });
  }
}
