import express from "express";
const router = express.Router();
import { 
  createCategory, 
  getAllCategory, 
  deleteCategory,
  restoreCategoryById
} from '../controllers/category.controller.js'

router.route('/')
  .get(getAllCategory)
  .post(createCategory);

router.route('/:id')
  .put(restoreCategoryById)
  .delete(deleteCategory);


export default router