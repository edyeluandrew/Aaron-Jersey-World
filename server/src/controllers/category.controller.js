import { sendSuccess } from '../utils/apiResponse.js';
import { getParams, getQuery } from '../middleware/validate.js';
import * as categoryService from '../services/category.service.js';

export async function listCategories(req, res, next) {
  try {
    const categories = await categoryService.listCategories({
      includeInactive: getQuery(req).includeInactive,
    });

    sendSuccess(res, {
      message: 'Categories retrieved successfully',
      data: categories,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCategoryBySlug(req, res, next) {
  try {
    const category = await categoryService.getCategoryBySlug(getParams(req).slug, {
      includeInactive: getQuery(req).includeInactive,
    });

    sendSuccess(res, {
      message: 'Category retrieved successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
}

export async function listAdminCategories(_req, res, next) {
  try {
    const categories = await categoryService.listAdminCategories();

    sendSuccess(res, {
      message: 'Categories retrieved successfully',
      data: categories,
    });
  } catch (error) {
    next(error);
  }
}

export async function createCategory(req, res, next) {
  try {
    const category = await categoryService.createCategory(req.body);

    sendSuccess(res, {
      message: 'Category created successfully',
      data: category,
      statusCode: 201,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateCategory(req, res, next) {
  try {
    const category = await categoryService.updateCategory(getParams(req).id, req.body);

    sendSuccess(res, {
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteCategory(req, res, next) {
  try {
    await categoryService.deleteCategory(getParams(req).id);

    sendSuccess(res, {
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}
