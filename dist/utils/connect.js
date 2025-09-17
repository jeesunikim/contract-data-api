"use strict";
// Copyright 2024 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = connect;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const node_path_1 = require("node:path");
const cloud_sql_connector_1 = require("@google-cloud/cloud-sql-connector");
const prisma_1 = require("../../generated/prisma");
console.log("Using credentials file:", process.env.GOOGLE_APPLICATION_CREDENTIALS);
async function cleanupSocket() {
    const socketPath = path_1.default.join(process.cwd(), ".s.PGSQL.5432");
    try {
        if (fs_1.default.existsSync(socketPath)) {
            fs_1.default.unlinkSync(socketPath);
            console.log("🧹 Cleaned up existing socket file");
        }
    }
    catch (error) {
        console.warn("Warning: Could not clean up socket file:", error.message);
    }
}
async function connect({ instanceConnectionName, user, database, }) {
    const connector = new cloud_sql_connector_1.Connector();
    const socketPath = (0, node_path_1.resolve)(`.s.PGSQL.5432`);
    // Cleanup before starting
    await cleanupSocket();
    console.log("📁 Using credentials file:", process.env.GOOGLE_APPLICATION_CREDENTIALS);
    await connector.startLocalProxy({
        instanceConnectionName,
        ipType: cloud_sql_connector_1.IpAddressTypes.PUBLIC,
        authType: cloud_sql_connector_1.AuthTypes.IAM,
        listenOptions: { path: socketPath },
    });
    // const user = JSON.parse(
    //   process.env.GOOGLE_APPLICATION_CREDENTIALS
    // ).client_email;
    const datasourceUrl = `postgresql://${user}@localhost/${database}?host=${process.cwd()}`;
    const prisma = new prisma_1.PrismaClient({ datasourceUrl });
    // Return PrismaClient and close() function
    return {
        prisma,
        async close() {
            await prisma.$disconnect();
            connector.close();
        },
    };
}
//# sourceMappingURL=connect.js.map