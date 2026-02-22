/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code
 */
export const sendSuccessResponse = (res, data = null, message = "Success", statusCode = 200) => {
  const response = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };

  return res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {*} errors - Error details
 */
export const sendErrorResponse = (res, message = "Error", statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send paginated response
 * @param {Object} res - Express response object
 * @param {*} data - Response data
 * @param {Object} pagination - Pagination info
 * @param {string} message - Success message
 */
export const sendPaginatedResponse = (
  res,
  data,
  pagination,
  message = "Success"
) => {
  const response = {
    success: true,
    message,
    data,
    pagination: {
      currentPage: pagination.currentPage || 1,
      totalPages: pagination.totalPages || 1,
      totalItems: pagination.totalItems || 0,
      itemsPerPage: pagination.itemsPerPage || 10,
    },
    timestamp: new Date().toISOString(),
  };

  return res.status(200).json(response);
};
