import { test } from "node:test";
import assert from "node:assert/strict";
import {
  validateIdlPath,
  validateInstructionName,
  validateProgramName,
  validateDescription,
  validateApiKey,
} from "../dist/validation.js";

test("validateIdlPath rejects empty", () => {
  assert.equal(validateIdlPath("").isValid(), false);
});

test("validateIdlPath rejects non-json", () => {
  assert.equal(validateIdlPath("foo.txt").isValid(), false);
});

test("validateIdlPath rejects missing file", () => {
  assert.equal(validateIdlPath("does-not-exist.json").isValid(), false);
});

test("validateIdlPath accepts existing json", () => {
  assert.equal(validateIdlPath("examples/token_vault.json").isValid(), true);
});

test("validateInstructionName requires snake_case", () => {
  assert.equal(validateInstructionName("initialize").isValid(), true);
  assert.equal(validateInstructionName("Initialize").isValid(), false);
  assert.equal(validateInstructionName("").isValid(), false);
});

test("validateProgramName enforces snake_case and length", () => {
  assert.equal(validateProgramName("token_vault").isValid(), true);
  assert.equal(validateProgramName("TokenVault").isValid(), false);
  assert.equal(validateProgramName("a".repeat(65)).isValid(), false);
});

test("validateDescription enforces length bounds", () => {
  assert.equal(validateDescription("short").isValid(), false);
  assert.equal(validateDescription("a valid program description").isValid(), true);
  assert.equal(validateDescription("x".repeat(2001)).isValid(), false);
});

test("validateApiKey rejects short/empty", () => {
  assert.equal(validateApiKey("").isValid(), false);
  assert.equal(validateApiKey("short").isValid(), false);
  assert.equal(validateApiKey("sk-ant-aaaaaaaaaaaaaaaaaaaaaaaa").isValid(), true);
});
