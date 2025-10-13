"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const authenticate = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer "))
        return res.status(401).json({ message: "Unauthorized" });
    const token = auth.split(" ")[1];
    try {
        const payload = (0, jwt_1.verifyJwt)(token);
        // @ts-ignore
        req.user = payload;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
exports.authenticate = authenticate;
