import { test } from "node:test";
import assert from "node:assert/strict";
import { parseIdl } from "../dist/parsers/idl-parser.js";

const idl = parseIdl("examples/token_vault.json");

test("parses program name", () => {
  assert.equal(idl.name, "token_vault");
});

test("parses all instructions", () => {
  assert.equal(idl.instructions.length, 3);
  assert.deepEqual(
    idl.instructions.map((i) => i.name),
    ["initialize", "deposit", "withdraw"]
  );
});

test("parses instruction accounts and args", () => {
  const init = idl.instructions.find((i) => i.name === "initialize");
  assert.equal(init.accounts.length, 4);
  assert.equal(init.args.length, 1);
  assert.equal(init.args[0].name, "capacity");
});

test("parses PDA seeds", () => {
  const init = idl.instructions.find((i) => i.name === "initialize");
  const vault = init.accounts.find((a) => a.name === "vault");
  assert.ok(vault.pda);
  assert.ok(vault.pda.seeds.length >= 1);
});

test("parses errors", () => {
  assert.equal(idl.errors.length, 3);
  assert.equal(idl.errors[0].name, "InsufficientBalance");
});

test("parses program id from metadata", () => {
  assert.equal(idl.programId, "11111111111111111111111111111111");
});
