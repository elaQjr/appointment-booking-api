const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Authentication required.' });
        };

        const userRoles = req.user.role;

        if (!allowedRoles.includes(userRoles)) {
            return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
        };
        next();
    };
};

module.exports = authorize;