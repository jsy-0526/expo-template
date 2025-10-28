import { RefResolver } from '../src';
import type { SchemaObject } from '../src';

console.log('=== $ref Resolution Examples ===\n');

// Example 1: Simple reference
console.log('1. Simple $ref resolution:\n');

const schemas1 = {
  User: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      email: { type: 'string', format: 'email' },
    },
    required: ['id', 'name'],
  },
} as Record<string, SchemaObject>;

const resolver1 = new RefResolver(schemas1);

const schemaWithRef = {
  $ref: '#/components/schemas/User',
} as SchemaObject;

const resolved1 = resolver1.resolve(schemaWithRef);
console.log('Original schema with $ref:');
console.log(JSON.stringify(schemaWithRef, null, 2));
console.log('\nResolved schema:');
console.log(JSON.stringify(resolved1, null, 2));
console.log('\n---\n');

// Example 2: Nested references
console.log('2. Nested $ref resolution:\n');

const schemas2 = {
  Address: {
    type: 'object',
    properties: {
      street: { type: 'string' },
      city: { type: 'string' },
      zipCode: { type: 'string' },
    },
  },
  User: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      address: {
        $ref: '#/components/schemas/Address',
      },
    },
  },
} as Record<string, SchemaObject>;

const resolver2 = new RefResolver(schemas2);

const userSchemaWithRef = {
  $ref: '#/components/schemas/User',
} as SchemaObject;

const resolved2 = resolver2.resolve(userSchemaWithRef);
console.log('User schema with nested $ref:');
console.log(JSON.stringify(userSchemaWithRef, null, 2));
console.log('\nResolved with Address expanded:');
console.log(JSON.stringify(resolved2, null, 2));
console.log('\n---\n');

// Example 3: Array items with references
console.log('3. Array with $ref in items:\n');

const schemas3 = {
  Pet: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      species: { type: 'string' },
    },
  },
} as Record<string, SchemaObject>;

const resolver3 = new RefResolver(schemas3);

const arraySchema = {
  type: 'array',
  items: {
    $ref: '#/components/schemas/Pet',
  },
} as SchemaObject;

const resolved3 = resolver3.resolve(arraySchema);
console.log('Array schema with $ref in items:');
console.log(JSON.stringify(arraySchema, null, 2));
console.log('\nResolved:');
console.log(JSON.stringify(resolved3, null, 2));
console.log('\n---\n');

// Example 4: Complex nested structure
console.log('4. Complex nested structure with multiple $refs:\n');

const schemas4 = {
  Tag: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
    },
  },
  Author: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      email: { type: 'string' },
    },
  },
  Comment: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      text: { type: 'string' },
      author: {
        $ref: '#/components/schemas/Author',
      },
    },
  },
  Post: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string' },
      content: { type: 'string' },
      author: {
        $ref: '#/components/schemas/Author',
      },
      tags: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Tag',
        },
      },
      comments: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Comment',
        },
      },
    },
  },
} as Record<string, SchemaObject>;

const resolver4 = new RefResolver(schemas4);

const postSchemaWithRef = {
  $ref: '#/components/schemas/Post',
} as SchemaObject;

const resolved4 = resolver4.resolve(postSchemaWithRef);
console.log('Complex Post schema with multiple nested $refs:');
console.log('\nResolved structure (showing property types):');
console.log(JSON.stringify(resolved4, null, 2));
console.log('\n---\n');

// Example 5: Error handling - invalid reference
console.log('5. Error handling for invalid $ref:\n');

const schemas5 = {} as Record<string, SchemaObject>;
const resolver5 = new RefResolver(schemas5);

const invalidRef = {
  $ref: '#/components/schemas/NonExistent',
} as SchemaObject;

try {
  resolver5.resolve(invalidRef);
  console.log('Should have thrown an error');
} catch (error) {
  console.log('✓ Correctly threw error for invalid reference:');
  console.log(`  Error: ${(error as Error).message}`);
}
