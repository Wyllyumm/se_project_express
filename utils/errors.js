module.exports = {
  error400: { status: 400, message: "Invalid data." },
  error404: { status: 404, message: "No user or item with the requested Id." },
  error500: { status: 500, message: "An error has occurred on the server." },
  error409: { status: 409, message: "Email already exists" },
  error401: { status: 401, message: "Unauthorized, you shall not pass!" },
  error403: {
    status: 403,
    message: "Forbidden - you don't have permission to access this resource",
  },
};
