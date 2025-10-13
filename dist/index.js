"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
require("reflect-metadata");
const ormconfig_1 = require("./ormconfig");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/auth", auth_routes_1.default);
const PORT = process.env.PORT || 5000;
ormconfig_1.AppDataSource.initialize()
    .then(() => {
    console.log("DB connected");
    app.listen(PORT, () => console.log("Server on", PORT));
})
    .catch((err) => {
    console.error("DB init error", err);
});
