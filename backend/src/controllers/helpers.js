import { NotFoundError } from "../utils/errors.js";

export const getPagination = (query) => {
  return {
    take: parseInt(query.take, 10) || 10,
    skip: parseInt(query.skip, 10) || 0,
  };
};

export const getSuccessMessage = (success) => {
  return `${success} retrieved successfully`;
};

export const getNotFoundMessage = (entity) => {
  return `${entity} not found`;
};

export const generateSkuCode = (productName) => {
  const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
  const namePart = productName.substring(0, 3).toUpperCase();
  return `${namePart}-${randomString}`;
};

export const buildPagination = (totalDocs, page, limit) => {
  const safeTotalDocs = Math.max(0, parseInt(totalDocs, 10) || 0);
  const safePage = Math.max(1, parseInt(page, 10) || 1);
  const safeLimit = Math.max(1, parseInt(limit, 10) || 10);

  const totalPages = Math.ceil(safeTotalDocs / safeLimit);
  const hasNextPage = safePage < totalPages;
  const hasPrevPage = safePage > 1;
  const nextPage = hasNextPage ? safePage + 1 : null;
  const prevPage = hasPrevPage ? safePage - 1 : null;

  return {
    totalPages,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    page: safePage,
    limit: safeLimit,
    totalDocs: safeTotalDocs,
    startIndex: (safePage - 1) * safeLimit + 1,
    endIndex: Math.min(safePage * safeLimit, safeTotalDocs),
  };
};
