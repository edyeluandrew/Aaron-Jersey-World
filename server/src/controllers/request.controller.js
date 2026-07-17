import { sendSuccess } from '../utils/apiResponse.js';
import * as requestService from '../services/request.service.js';

export async function createInquiry(req, res, next) {
  try {
    const inquiry = await requestService.createInquiry(req.body);

    sendSuccess(res, {
      message: 'Enquiry submitted successfully',
      data: inquiry,
      statusCode: 201,
    });
  } catch (error) {
    next(error);
  }
}

export async function createQuoteRequest(req, res, next) {
  try {
    const quoteRequest = await requestService.createQuoteRequest(req.body);

    sendSuccess(res, {
      message: 'Quote request submitted successfully',
      data: quoteRequest,
      statusCode: 201,
    });
  } catch (error) {
    next(error);
  }
}

export async function createBrandingRequest(req, res, next) {
  try {
    const brandingRequest = await requestService.createBrandingRequest(req.body);

    sendSuccess(res, {
      message: 'Branding request submitted successfully',
      data: brandingRequest,
      statusCode: 201,
    });
  } catch (error) {
    next(error);
  }
}

export async function createInstitutionalRequest(req, res, next) {
  try {
    const institutionalRequest = await requestService.createInstitutionalRequest(req.body);

    sendSuccess(res, {
      message: 'Institutional request submitted successfully',
      data: institutionalRequest,
      statusCode: 201,
    });
  } catch (error) {
    next(error);
  }
}

export async function listInquiries(req, res, next) {
  try {
    const result = await requestService.listInquiries(req.parsedQuery ?? req.query);
    sendSuccess(res, { message: 'Inquiries retrieved', data: result.inquiries, meta: result.meta });
  } catch (error) {
    next(error);
  }
}

export async function getInquiryById(req, res, next) {
  try {
    const inquiry = await requestService.getInquiryById(req.parsedParams?.id ?? req.params.id);
    sendSuccess(res, { message: 'Inquiry retrieved', data: inquiry });
  } catch (error) {
    next(error);
  }
}

export async function updateInquiryStatus(req, res, next) {
  try {
    const inquiry = await requestService.updateInquiryStatus(
      req.parsedParams?.id ?? req.params.id,
      req.body.status,
    );
    sendSuccess(res, { message: 'Inquiry status updated', data: inquiry });
  } catch (error) {
    next(error);
  }
}

export async function listQuoteRequests(req, res, next) {
  try {
    const result = await requestService.listQuoteRequests(req.parsedQuery ?? req.query);
    sendSuccess(res, { message: 'Quote requests retrieved', data: result.quotes, meta: result.meta });
  } catch (error) {
    next(error);
  }
}

export async function getQuoteRequestById(req, res, next) {
  try {
    const quote = await requestService.getQuoteRequestById(req.parsedParams?.id ?? req.params.id);
    sendSuccess(res, { message: 'Quote request retrieved', data: quote });
  } catch (error) {
    next(error);
  }
}

export async function updateQuoteRequestStatus(req, res, next) {
  try {
    const quote = await requestService.updateQuoteRequestStatus(
      req.parsedParams?.id ?? req.params.id,
      req.body.status,
    );
    sendSuccess(res, { message: 'Quote request status updated', data: quote });
  } catch (error) {
    next(error);
  }
}

export async function listBrandingRequests(req, res, next) {
  try {
    const result = await requestService.listBrandingRequests(req.parsedQuery ?? req.query);
    sendSuccess(res, {
      message: 'Branding requests retrieved',
      data: result.brandingRequests,
      meta: result.meta,
    });
  } catch (error) {
    next(error);
  }
}

export async function getBrandingRequestById(req, res, next) {
  try {
    const request = await requestService.getBrandingRequestById(req.parsedParams?.id ?? req.params.id);
    sendSuccess(res, { message: 'Branding request retrieved', data: request });
  } catch (error) {
    next(error);
  }
}

export async function updateBrandingRequestStatus(req, res, next) {
  try {
    const request = await requestService.updateBrandingRequestStatus(
      req.parsedParams?.id ?? req.params.id,
      req.body.status,
    );
    sendSuccess(res, { message: 'Branding request status updated', data: request });
  } catch (error) {
    next(error);
  }
}

export async function listInstitutionalRequests(req, res, next) {
  try {
    const result = await requestService.listInstitutionalRequests(req.parsedQuery ?? req.query);
    sendSuccess(res, {
      message: 'Institutional requests retrieved',
      data: result.institutionalRequests,
      meta: result.meta,
    });
  } catch (error) {
    next(error);
  }
}

export async function getInstitutionalRequestById(req, res, next) {
  try {
    const request = await requestService.getInstitutionalRequestById(req.parsedParams?.id ?? req.params.id);
    sendSuccess(res, { message: 'Institutional request retrieved', data: request });
  } catch (error) {
    next(error);
  }
}

export async function updateInstitutionalRequestStatus(req, res, next) {
  try {
    const request = await requestService.updateInstitutionalRequestStatus(
      req.parsedParams?.id ?? req.params.id,
      req.body.status,
    );
    sendSuccess(res, { message: 'Institutional request status updated', data: request });
  } catch (error) {
    next(error);
  }
}
