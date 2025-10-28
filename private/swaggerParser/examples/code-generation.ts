import { CodeGenerator } from "../src";
import * as fs from "fs";
import * as path from "path";
import openApiDoc from "../base.json";

// Example OpenAPI document
// const openApiDoc = {
//   openapi: '3.0.0',
//   info: {
//     title: 'User Management API',
//     version: '1.0.0',
//   },
//   paths: {
//     '/users': {
//       get: {
//         operationId: 'listUsers',
//         summary: 'List all users',
//         parameters: [
//           {
//             name: 'limit',
//             in: 'query',
//             schema: { type: 'integer' },
//           },
//           {
//             name: 'role',
//             in: 'query',
//             schema: {
//               type: 'string',
//               enum: ['admin', 'user', 'guest'],
//             },
//           },
//         ],
//         responses: {
//           '200': {
//             description: 'Success',
//           },
//         },
//       },
//       post: {
//         operationId: 'createUser',
//         summary: 'Create a new user',
//         requestBody: {
//           required: true,
//           content: {
//             'application/json': {
//               schema: {
//                 $ref: '#/components/schemas/CreateUserRequest',
//               },
//             },
//           },
//         },
//         responses: {
//           '201': {
//             description: 'User created',
//           },
//         },
//       },
//     },
//     '/users/{userId}': {
//       get: {
//         operationId: 'getUserById',
//         summary: 'Get user by ID',
//         parameters: [
//           {
//             name: 'userId',
//             in: 'path',JJ
//             required: true,
//             schema: { type: 'string' },
//           },
//         ],
//         responses: {
//           '200': {
//             description: 'Success',
//           },
//         },
//       },
//       put: {
//         operationId: 'updateUser',
//         summary: 'Update user',
//         description: 'Update an existing user by ID',
//         parameters: [
//           {
//             name: 'userId',
//             in: 'path',
//             required: true,
//             schema: { type: 'string' },
//           },
//         ],
//         requestBody: {
//           required: true,
//           content: {
//             'application/json': {
//               schema: {
//                 $ref: '#/components/schemas/UpdateUserRequest',
//               },
//             },
//           },
//         },
//         responses: {
//           '200': {
//             description: 'User updated',
//           },
//         },
//       },
//       delete: {
//         operationId: 'deleteUser',
//         summary: 'Delete user',
//         deprecated: true,
//         parameters: [
//           {
//             name: 'userId',
//             in: 'path',
//             required: true,
//             schema: { type: 'string' },
//           },
//         ],
//         responses: {
//           '204': {
//             description: 'User deleted',
//           },
//         },
//       },
//     },
//   },
//   components: {
//     schemas: {
//       User: {
//         type: 'object',
//         required: ['id', 'email', 'role'],
//         properties: {
//           id: {
//             type: 'string',
//             description: 'User ID',
//           },
//           email: {
//             type: 'string',
//             format: 'email',
//             description: 'User email',
//           },
//           name: {
//             type: 'string',
//             nullable: true,
//             description: 'User full name',
//           },
//           role: {
//             type: 'string',
//             enum: ['admin', 'user', 'guest'],
//             description: 'User role',
//           },
//           age: {
//             type: 'integer',
//             description: 'User age',
//           },
//           metadata: {
//             type: 'object',
//             additionalProperties: true,
//             description: 'Additional metadata',
//           },
//         },
//       },
//       CreateUserRequest: {
//         type: 'object',
//         required: ['email', 'role'],
//         properties: {
//           email: {
//             type: 'string',
//             format: 'email',
//           },
//           name: {
//             type: 'string',
//           },
//           role: {
//             type: 'string',
//             enum: ['admin', 'user', 'guest'],
//           },
//           age: {
//             type: 'integer',
//           },
//         },
//       },
//       UpdateUserRequest: {
//         type: 'object',
//         properties: {
//           email: {
//             type: 'string',
//             format: 'email',
//           },
//           name: {
//             type: 'string',
//             nullable: true,
//           },
//           role: {
//             type: 'string',
//             enum: ['admin', 'user', 'guest'],
//           },
//         },
//       },
//       UserRole: {
//         type: 'string',
//         enum: ['admin', 'user', 'guest'],
//       },
//       UserList: {
//         type: 'array',
//         items: {
//           $ref: '#/components/schemas/User',
//         },
//       },
//     },
//   },
// };


const generator = new CodeGenerator();

// Generate complete code (types + APIs)
console.log("1. Generating complete TypeScript code...\n");
const fullCode = generator.generateFromDocument(openApiDoc);

console.log("Generated code:");
console.log("─".repeat(80));
console.log(fullCode);
console.log("─".repeat(80));
console.log();

// Generate only types
console.log("2. Generating only types...\n");
const typesOnly = generator.generateFromDocument(openApiDoc, {
  includeApis: false,
});

console.log("Types only:");
console.log("─".repeat(80));
console.log(typesOnly);
console.log("─".repeat(80));
console.log();

// Generate only APIs
console.log("3. Generating only API functions...\n");
const apisOnly = generator.generateFromDocument(openApiDoc, {
  includeTypes: false,
});

console.log("APIs only:");
console.log("─".repeat(80));
console.log(apisOnly);
console.log("─".repeat(80));
console.log();

// Save to file
const outputDir = path.join(__dirname, "../output");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputFile = path.join(outputDir, "generated-api.ts");
fs.writeFileSync(outputFile, fullCode, "utf-8");

console.log(`✅ Code saved to: ${outputFile}`);
console.log("\nYou can now use the generated code in your TypeScript project!");
