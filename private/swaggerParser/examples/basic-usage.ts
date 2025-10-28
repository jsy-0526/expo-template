import { SwaggerParser } from '../src';

// Example OpenAPI document
const openApiDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Pet Store API',
    version: '1.0.0',
    description: 'A sample pet store API to demonstrate swagger-parser',
  },
  servers: [
    {
      url: 'https://api.petstore.com/v1',
      description: 'Production server',
    },
  ],
  tags: [
    {
      name: 'pets',
      description: 'Pet operations',
    },
  ],
  paths: {
    '/pets': {
      get: {
        operationId: 'listPets',
        summary: 'List all pets',
        description: 'Returns a list of all pets in the store',
        tags: ['pets'],
        parameters: [
          {
            name: 'limit',
            in: 'query',
            description: 'Maximum number of pets to return',
            required: false,
            schema: {
              type: 'integer',
              format: 'int32',
              minimum: 1,
              maximum: 100,
              default: 20,
            },
          },
        ],
        responses: {
          '200': {
            description: 'A paged array of pets',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Pet',
                  },
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
          },
        },
      },
      post: {
        operationId: 'createPet',
        summary: 'Create a pet',
        description: 'Creates a new pet in the store',
        tags: ['pets'],
        requestBody: {
          description: 'Pet to add to the store',
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/NewPet',
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Pet created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Pet',
                },
              },
            },
          },
          '400': {
            description: 'Invalid input',
          },
        },
      },
    },
    '/pets/{petId}': {
      get: {
        operationId: 'getPetById',
        summary: 'Get a pet by ID',
        description: 'Returns a single pet',
        tags: ['pets'],
        parameters: [
          {
            name: 'petId',
            in: 'path',
            description: 'ID of pet to return',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '200': {
            description: 'A pet',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Pet',
                },
              },
            },
          },
          '404': {
            description: 'Pet not found',
          },
        },
      },
      put: {
        operationId: 'updatePet',
        summary: 'Update a pet',
        description: 'Updates an existing pet',
        tags: ['pets'],
        parameters: [
          {
            name: 'petId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/NewPet',
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Pet updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Pet',
                },
              },
            },
          },
          '404': {
            description: 'Pet not found',
          },
        },
      },
      delete: {
        operationId: 'deletePet',
        summary: 'Delete a pet',
        tags: ['pets'],
        parameters: [
          {
            name: 'petId',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          '204': {
            description: 'Pet deleted successfully',
          },
          '404': {
            description: 'Pet not found',
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Pet: {
        type: 'object',
        required: ['id', 'name'],
        properties: {
          id: {
            type: 'string',
            description: 'Unique identifier',
          },
          name: {
            type: 'string',
            description: 'Pet name',
          },
          tag: {
            type: 'string',
            description: 'Pet tag',
          },
          status: {
            type: 'string',
            enum: ['available', 'pending', 'sold'],
            description: 'Pet status in the store',
          },
        },
      },
      NewPet: {
        type: 'object',
        required: ['name'],
        properties: {
          name: {
            type: 'string',
            description: 'Pet name',
          },
          tag: {
            type: 'string',
            description: 'Pet tag',
          },
          status: {
            type: 'string',
            enum: ['available', 'pending', 'sold'],
            default: 'available',
          },
        },
      },
    },
  },
};

// Parse the document
console.log('=== Parsing OpenAPI Document ===\n');
const parser = new SwaggerParser();
const result = parser.parse(openApiDocument);

// Display API Information
console.log('📋 API Information:');
console.log(`  Title: ${result.info.title}`);
console.log(`  Version: ${result.info.version}`);
console.log(`  Description: ${result.info.description}`);
console.log();

// Display Servers
if (result.servers && result.servers.length > 0) {
  console.log('🌐 Servers:');
  result.servers.forEach((server) => {
    console.log(`  - ${server.url} (${server.description})`);
  });
  console.log();
}

// Display Tags
if (result.tags && result.tags.length > 0) {
  console.log('🏷️  Tags:');
  result.tags.forEach((tag) => {
    console.log(`  - ${tag.name}: ${tag.description}`);
  });
  console.log();
}

// Display APIs
console.log('🔌 API Endpoints:');
console.log(`  Total: ${result.apis.length} endpoints\n`);

result.apis.forEach((api, index) => {
  console.log(`  ${index + 1}. ${api.method.toUpperCase()} ${api.path}`);
  console.log(`     Operation ID: ${api.operationId}`);
  console.log(`     Summary: ${api.summary}`);

  if (api.tags && api.tags.length > 0) {
    console.log(`     Tags: ${api.tags.join(', ')}`);
  }

  if (api.parameters && api.parameters.length > 0) {
    console.log(`     Parameters:`);
    api.parameters.forEach((param) => {
      const required = param.required ? '(required)' : '(optional)';
      console.log(`       - ${param.name} (${param.in}) ${required}`);
    });
  }

  if (api.requestBody) {
    console.log(`     Request Body: ${api.requestBody.required ? 'Required' : 'Optional'}`);
  }

  const responseStatuses = Object.keys(api.responses);
  console.log(`     Responses: ${responseStatuses.join(', ')}`);
  console.log();
});

// Display Schemas
console.log('📦 Schemas:');
console.log(`  Total: ${Object.keys(result.schemas).length} schemas\n`);

Object.entries(result.schemas).forEach(([name, schema]) => {
  console.log(`  ${name}:`);
  console.log(`    Type: ${schema.type}`);

  if (schema.required && schema.required.length > 0) {
    console.log(`    Required: ${schema.required.join(', ')}`);
  }

  if (schema.properties) {
    console.log(`    Properties:`);
    Object.entries(schema.properties).forEach(([propName, propSchema]) => {
      const propType = propSchema.type || (propSchema.$ref ? 'reference' : 'unknown');
      console.log(`      - ${propName}: ${propType}`);
    });
  }
  console.log();
});

// Example: Filter APIs by method
console.log('=== Filtering Examples ===\n');

const getApis = result.apis.filter((api) => api.method === 'get');
console.log(`GET endpoints: ${getApis.length}`);
getApis.forEach((api) => {
  console.log(`  - ${api.path}`);
});
console.log();

const postApis = result.apis.filter((api) => api.method === 'post');
console.log(`POST endpoints: ${postApis.length}`);
postApis.forEach((api) => {
  console.log(`  - ${api.path}`);
});
console.log();

// Example: Get APIs with path parameters
const apisWithParams = result.apis.filter(
  (api) => api.parameters && api.parameters.some((p) => p.in === 'path')
);
console.log(`Endpoints with path parameters: ${apisWithParams.length}`);
apisWithParams.forEach((api) => {
  console.log(`  - ${api.method.toUpperCase()} ${api.path}`);
});
console.log();

// Example: Get APIs with request body
const apisWithBody = result.apis.filter((api) => api.requestBody);
console.log(`Endpoints with request body: ${apisWithBody.length}`);
apisWithBody.forEach((api) => {
  console.log(`  - ${api.method.toUpperCase()} ${api.path}`);
});
