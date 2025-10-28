# Examples

This directory contains example usage of the swagger-parser library.

## Running Examples

Make sure you've built the library first:

```bash
pnpm build
```

Then run the examples:

```bash
# Basic usage example
pnpm example:basic

# $ref resolution example
pnpm example:ref
```

## Files

- **`basic-usage.ts`** - Comprehensive example showing how to parse an OpenAPI document, extract APIs, schemas, and filter results
- **`ref-resolution.ts`** - Examples of manual `$ref` resolution for different scenarios (simple, nested, arrays, complex structures)

## Example Output

### Basic Usage
Shows:
- API information (title, version, description)
- All API endpoints with details
- Schema definitions
- Filtering APIs by method, parameters, etc.

### Ref Resolution
Demonstrates:
- Simple reference resolution
- Nested references
- Array items with references
- Complex multi-level references
- Error handling for invalid references
