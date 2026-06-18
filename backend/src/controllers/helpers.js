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

export const buildPagination = (totalDocs, skip, take) => {
  const safeTotalDocs = Math.max(0, Number(totalDocs) || 0);
  const safeSkip = Math.max(0, Number(skip) || 0);
  const safeTake = Math.max(1, Number(take) || 10);

  const safePage = Math.floor(safeSkip / safeTake) + 1;

  const totalPages = Math.ceil(safeTotalDocs / safeTake);

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
    take: safeTake,

    totalDocs: safeTotalDocs,

    startIndex: safeSkip + 1,
    endIndex: Math.min(safeSkip + safeTake, safeTotalDocs),
  };
};
