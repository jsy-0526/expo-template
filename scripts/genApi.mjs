import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { CodeGenerator } from '../private/swaggerParser/dist/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SWAGGER_JSON_PATH = path.join(__dirname, 'base.json'); // Local swagger JSON file
const OUTPUT_DIR = path.join(__dirname, '../src/hooks/api');

/**
 * Fetch content from URL using http/https module
 */
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;

    client.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        // Handle redirects
        const redirectUrl = res.headers.location;
        if (redirectUrl) {
          return fetchUrl(redirectUrl).then(resolve).catch(reject);
        }
      }

      if (res.statusCode !== 200) {
        reject(new Error(`Failed to fetch: ${res.statusCode}`));
        return;
      }

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(data);
      });
    }).on('error', reject);
  });
}

/**
 * Generate SWR hook function name from API endpoint
 */
function generateHookName(api) {
  if (api.operationId) {
    // Convert operationId to hook name
    const operationId = api.operationId;

    // If already starts with 'use', keep it
    if (operationId.startsWith('use')) {
      return operationId;
    }

    // For all cases, just prepend 'use' and capitalize
    return 'use' + capitalize(operationId);
  }

  // Generate from path and method
  const pathParts = api.path.split('/').filter(p => p && !p.startsWith('{'));
  const resource = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2] || 'data';
  const method = api.method.toLowerCase();

  // Map method to verb
  const methodToVerb = {
    'get': 'Get',
    'post': 'Create',
    'put': 'Update',
    'patch': 'Update',
    'delete': 'Delete'
  };

  const verb = methodToVerb[method] || capitalize(method);
  return `use${verb}${capitalize(resource)}`;
}

/**
 * Generate params interface name
 */
function generateParamsInterfaceName(hookName) {
  return `${capitalize(hookName)}Params`;
}

/**
 * Capitalize first letter
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Extract path parameters from path string
 */
function extractPathParams(path) {
  const matches = path.match(/\{([^}]+)\}/g);
  if (!matches) return [];
  return matches.map(m => m.slice(1, -1));
}

/**
 * Generate TypeScript interface for hook parameters
 */
function generateParamsInterface(api) {
  const pathParams = extractPathParams(api.path);
  const queryParams = api.parameters?.filter(p => p.in === 'query') || [];

  if (pathParams.length === 0 && queryParams.length === 0) {
    return null;
  }

  const hookName = generateHookName(api);
  const interfaceName = generateParamsInterfaceName(hookName);

  const properties = [];

  // Add path parameters (always required)
  pathParams.forEach(param => {
    properties.push(`  ${param}: string;`);
  });

  // Add query parameters
  queryParams.forEach(param => {
    const type = getParameterType(param);
    const optional = !param.required ? '?' : '';
    properties.push(`  ${param.name}${optional}: ${type};`);
  });

  return `export interface ${interfaceName} {\n${properties.join('\n')}\n}`;
}

/**
 * Get TypeScript type for parameter
 */
function getParameterType(param) {
  if (!param.schema) return 'any';

  const schema = param.schema;

  if (schema.enum) {
    return schema.enum.map(v => typeof v === 'string' ? `"${v}"` : v).join(' | ');
  }

  switch (schema.type) {
    case 'integer':
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'array':
      return 'any[]';
    case 'object':
      return 'Record<string, any>';
    default:
      return 'string';
  }
}

/**
 * Convert schema to TypeScript type string
 */
function schemaToTypeString(schema, depth = 0) {
  if (!schema) return 'any';

  // Handle $ref
  if (schema.$ref) {
    const typeName = schema.$ref.split('/').pop();
    return typeName || 'any';
  }

  // Handle array
  if (schema.type === 'array') {
    if (schema.items) {
      const itemType = schemaToTypeString(schema.items, depth + 1);
      return `${itemType}[]`;
    }
    return 'any[]';
  }

  // Handle object
  if (schema.type === 'object' && schema.properties) {
    const indent = '  '.repeat(depth + 1);
    const properties = Object.entries(schema.properties).map(([key, propSchema]) => {
      const optional = schema.required?.includes(key) ? '' : '?';
      const type = schemaToTypeString(propSchema, depth + 1);
      return `${indent}${key}${optional}: ${type};`;
    });
    return `{\n${properties.join('\n')}\n${'  '.repeat(depth)}}`;
  }

  // Handle enum
  if (schema.enum) {
    return schema.enum.map(v => typeof v === 'string' ? `"${v}"` : v).join(' | ');
  }

  // Handle primitive types
  switch (schema.type) {
    case 'integer':
    case 'number':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'string':
      return 'string';
    case 'object':
      return 'Record<string, any>';
    default:
      return 'any';
  }
}

/**
 * Generate response type from API endpoint
 */
function generateResponseType(api) {
  // Try to get response schema from 200 or 201 response
  const successResponse = api.responses['200'] || api.responses['201'];

  if (!successResponse?.content) return 'any';

  const jsonContent = successResponse.content['application/json'];
  if (!jsonContent?.schema) return 'any';

  const schema = jsonContent.schema;
  return schemaToTypeString(schema);
}

/**
 * Generate SWR hook code
 */
function generateHook(api) {
  const hookName = generateHookName(api);
  const paramsInterface = generateParamsInterface(api);
  const responseType = generateResponseType(api);

  const pathParams = extractPathParams(api.path);
  const hasParams = pathParams.length > 0 || (api.parameters?.some(p => p.in === 'query'));

  let code = '';

  // Add interface if needed
  if (paramsInterface) {
    code += paramsInterface + '\n\n';
  }

  // Generate function signature
  let functionParams = '';
  if (hasParams) {
    const paramName = `{ ${pathParams.join(', ')}${pathParams.length > 0 && api.parameters?.some(p => p.in === 'query') ? ', ' : ''}${api.parameters?.filter(p => p.in === 'query').map(p => p.name).join(', ') || ''} }`;
    const paramType = `: ${generateParamsInterfaceName(hookName)}`;
    functionParams = paramName + paramType;
  }

  code += `export function ${hookName}(${functionParams}) {\n`;

  // Build API path
  let apiPath = api.path;
  pathParams.forEach(param => {
    apiPath = apiPath.replace(`{${param}}`, `\${${param}}`);
  });

  // Build SWR key
  const keyParts = [`"${api.path}"`];
  pathParams.forEach(param => {
    keyParts.push(param);
  });

  const queryParams = api.parameters?.filter(p => p.in === 'query') || [];
  queryParams.forEach(param => {
    keyParts.push(param.name);
  });

  const swrKey = keyParts.length > 1 ? `[${keyParts.join(', ')}]` : keyParts[0];

  // Determine if key should be conditional
  const requiredParams = [...pathParams];
  const shouldBeConditional = requiredParams.length > 0;

  const conditionalKey = shouldBeConditional
    ? `${requiredParams.join(' && ')} ? ${swrKey} : null`
    : swrKey;

  // Generate fetcher function
  const method = api.method.toLowerCase();
  const hasRequestBody = api.requestBody;

  let fetcherCode = '';
  if (method === 'get') {
    const queryParamsObj = queryParams.length > 0
      ? `{ params: { ${queryParams.map(p => p.name).join(', ')} } }`
      : '';
    fetcherCode = `    const res = await fetcher.get(\`${apiPath}\`${queryParamsObj ? ', ' + queryParamsObj : ''});\n    return res.data;`;
  } else {
    const bodyParam = queryParams.length > 0
      ? `{ ${queryParams.map(p => p.name).join(', ')} }`
      : '{}';
    fetcherCode = `    const res = await fetcher.${method}(\`${apiPath}\`, ${bodyParam});\n    return res.data;`;
  }

  code += `  return useSWR<${responseType}, HttpError>(${conditionalKey}, async () => {\n`;
  code += fetcherCode + '\n';
  code += '  });\n';
  code += '}\n';

  return code;
}

/**
 * Generate all hooks code
 */
function generateHooksCode(apis) {
  let code = 'import useSWR from "swr";\n';
  code += 'import { fetcher, type HttpError } from "../../infrastructure";\n\n';

  apis.forEach((api, index) => {
    code += generateHook(api);
    if (index < apis.length - 1) {
      code += '\n';
    }
  });

  return code;
}

/**
 * Generate index.ts export file
 */
function generateIndexFile(apis) {
  let code = '// API hooks\n';

  const hookNames = apis.map(api => generateHookName(api));
  const uniqueHookNames = Array.from(new Set(hookNames));

  code += `export { ${uniqueHookNames.join(', ')} } from './useApi';\n\n`;

  return code;
}

/**
 * Generate types code from schemas
 */
function generateTypesCode(schemas) {
  const generator = new CodeGenerator();
  const parseResult = {
    info: { title: '', version: '' },
    apis: [],
    schemas,
  };

  return generator.generateTypes(parseResult);
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('🚀 Generating API hooks from Swagger...\n');

    // Read local Swagger JSON file
    console.log(`📥 Reading Swagger document from: ${SWAGGER_JSON_PATH}`);
    const swaggerJson = fs.readFileSync(SWAGGER_JSON_PATH, 'utf-8');
    const swaggerDoc = JSON.parse(swaggerJson);

    // Parse using SwaggerParser
    console.log('📝 Parsing Swagger document...');
    const codeGenerator = new CodeGenerator();
    const parseResult = JSON.parse(JSON.stringify(codeGenerator['parser'].parse(swaggerDoc)));

    console.log(`   Found ${parseResult.apis.length} API endpoints`);
    console.log(`   Found ${Object.keys(parseResult.schemas).length} schemas\n`);

    // Generate hooks code
    console.log('🔨 Generating hooks...');
    const hooksCode = generateHooksCode(parseResult.apis);

    // Generate types code
    console.log('🔨 Generating types...');
    const typesCode = generateTypesCode(parseResult.schemas);

    // Generate index file
    console.log('🔨 Generating index file...');
    const indexCode = generateIndexFile(parseResult.apis);

    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Write files
    fs.writeFileSync(path.join(OUTPUT_DIR, 'useApi.ts'), hooksCode, 'utf-8');
    fs.writeFileSync(path.join(OUTPUT_DIR, 'types.ts'), typesCode, 'utf-8');
    fs.writeFileSync(path.join(OUTPUT_DIR, 'index.ts'), indexCode, 'utf-8');

    console.log('\n✅ API hooks generated successfully!');
    console.log(`   Output directory: ${OUTPUT_DIR}`);
    console.log('   Files:');
    console.log('   - useApi.ts (hooks)');
    console.log('   - types.ts (TypeScript types)');
    console.log('   - index.ts (exports)');

  } catch (error) {
    console.error('❌ Error generating API hooks:', error);
    process.exit(1);
  }
}

main();
