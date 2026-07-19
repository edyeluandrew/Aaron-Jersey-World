import { sendSuccess } from '../utils/apiResponse.js';
import { getParams, getQuery } from '../middleware/validate.js';
import * as productService from '../services/product.service.js';

export async function listProducts(req, res, next) {
  try {
    const result = await productService.listProducts(getQuery(req));

    sendSuccess(res, {
      message: 'Products retrieved successfully',
      data: result.products,
      meta: result.meta,
    });
  } catch (error) {
    next(error);
  }
}

export async function getFeaturedProducts(req, res, next) {
  try {
    const products = await productService.getFeaturedProducts(getQuery(req).limit || 8);

    sendSuccess(res, {
      message: 'Featured products retrieved successfully',
      data: products,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProductBySlug(req, res, next) {
  try {
    const product = await productService.getProductBySlug(getParams(req).slug, {
      includeInactive: getQuery(req).includeInactive,
    });

    sendSuccess(res, {
      message: 'Product retrieved successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

export async function getRelatedProducts(req, res, next) {
  try {
    const products = await productService.getRelatedProducts(
      getParams(req).slug,
      getQuery(req).limit || 8,
    );

    sendSuccess(res, {
      message: 'Related products retrieved successfully',
      data: products,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProductFilterOptions(_req, res, next) {
  try {
    const options = await productService.getProductFilterOptions();

    sendSuccess(res, {
      message: 'Product filter options retrieved successfully',
      data: options,
    });
  } catch (error) {
    next(error);
  }
}

export async function listAdminProducts(req, res, next) {
  try {
    const result = await productService.listAdminProducts(getQuery(req));

    sendSuccess(res, {
      message: 'Products retrieved successfully',
      data: result.products,
      meta: result.meta,
    });
  } catch (error) {
    next(error);
  }
}

export async function getAdminProductById(req, res, next) {
  try {
    const product = await productService.getAdminProductById(getParams(req).id);

    sendSuccess(res, {
      message: 'Product retrieved successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req, res, next) {
  try {
    const product = await productService.createProduct(req.body);

    sendSuccess(res, {
      message: 'Product created successfully',
      data: product,
      statusCode: 201,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const product = await productService.updateProduct(getParams(req).id, req.body);

    sendSuccess(res, {
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    await productService.deleteProduct(getParams(req).id);

    sendSuccess(res, {
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

export async function addProductImage(req, res, next) {
  try {
    const image = await productService.addProductImage(getParams(req).id, req.body);

    sendSuccess(res, {
      message: 'Product image added successfully',
      data: image,
      statusCode: 201,
    });
  } catch (error) {
    next(error);
  }
}

export async function importProductImagesFromFolder(req, res, next) {
  try {
    const result = await productService.importProductImagesFromFolder(
      getParams(req).id,
      req.body.folder,
    );

    sendSuccess(res, {
      message: `Imported ${result.added} image${result.added === 1 ? '' : 's'} from Cloudinary folder`,
      data: result,
      statusCode: 201,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProductImage(req, res, next) {
  try {
    const image = await productService.updateProductImage(
      getParams(req).id,
      getParams(req).imageId,
      req.body,
    );

    sendSuccess(res, {
      message: 'Product image updated successfully',
      data: image,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteProductImage(req, res, next) {
  try {
    await productService.deleteProductImage(getParams(req).id, getParams(req).imageId);

    sendSuccess(res, {
      message: 'Product image deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

export async function addProductVariant(req, res, next) {
  try {
    const variant = await productService.addProductVariant(getParams(req).id, req.body);

    sendSuccess(res, {
      message: 'Product variant added successfully',
      data: variant,
      statusCode: 201,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProductVariant(req, res, next) {
  try {
    const variant = await productService.updateProductVariant(
      getParams(req).id,
      getParams(req).variantId,
      req.body,
    );

    sendSuccess(res, {
      message: 'Product variant updated successfully',
      data: variant,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteProductVariant(req, res, next) {
  try {
    await productService.deleteProductVariant(getParams(req).id, getParams(req).variantId);

    sendSuccess(res, {
      message: 'Product variant deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}
