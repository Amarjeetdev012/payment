import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true }); // options can be passed, e.g. {allErrors: true}
addFormats(ajv);

const schemaRegister = {
  type: 'object',
  properties: {
    fname: { type: 'string' },
    lname: { type: 'string' },
    email: { type: 'string', format: 'email' },
    password: { type: 'string' },
  },
  required: ['fname', 'lname', 'email', 'password'],
  additionalProperties: false,
};

const schemaLogin = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string' },
  },
  required: ['email', 'password'],
  additionalProperties: false,
};

export const registerSchema = ajv.compile(schemaRegister);
export const loginSchema = ajv.compile(schemaLogin);
