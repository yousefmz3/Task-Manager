const path = require("path");
const notFound = (req, res) => {
  const filePath = path.join(
    __dirname,
    "..",
    "public",
    "error-page",
    "error.html",
  );
  res.status(404).sendFile(filePath);
  console.log(`Not Found: ${req.originalUrl}`);
};

module.exports = notFound;
