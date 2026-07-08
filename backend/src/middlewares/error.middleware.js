export const notFoundHandler = (req, res) => {
    res.status(404).json({ message: "Route not found" });
}

export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ message: err.message ||"Internal Server Error" });
}