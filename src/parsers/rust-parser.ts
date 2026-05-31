import { readFileSync } from "fs";

export interface RustProgram {
  name: string;
  instructions: RustInstruction[];
  accountStructs: RustAccountStruct[];
  errorEnum?: RustError;
}

export interface RustInstruction {
  name: string;
  accounts: string[];
  args: RustArg[];
  docs?: string;
}

export interface RustArg {
  name: string;
  type: string;
}

export interface RustAccountStruct {
  name: string;
  accounts: RustAccount[];
  docs?: string;
}

export interface RustAccount {
  name: string;
  type: string;
  isMut: boolean;
  isSigner: boolean;
  constraints: string[];
}

export interface RustError {
  variants: Array<{ name: string; code: number; msg: string }>;
}

export function parseRustProgram(filePath: string): RustProgram {
  const content = readFileSync(filePath, "utf-8");

  const programMatch = content.match(/#\[program\]\s*pub\s+mod\s+(\w+)/);
  const name = programMatch?.[1] || "unknown";

  const instructions = extractInstructions(content);
  const accountStructs = extractAccountStructs(content);
  const errorEnum = extractErrorEnum(content);

  return {
    name,
    instructions,
    accountStructs,
    errorEnum,
  };
}

function extractInstructions(content: string): RustInstruction[] {
  const instrRegex =
    /pub\s+fn\s+(\w+)\s*\(\s*ctx:\s*Context<(\w+)>(?:,\s*(.+?))?\s*\)\s*->\s*Result/gs;
  const instructions: RustInstruction[] = [];

  let match;
  while ((match = instrRegex.exec(content)) !== null) {
    const [, instrName, accountStructName, argsStr] = match;
    const args = parseArgs(argsStr || "");

    instructions.push({
      name: instrName,
      accounts: [accountStructName],
      args,
      docs: extractDocs(content, match.index),
    });
  }

  return instructions;
}

function extractAccountStructs(content: string): RustAccountStruct[] {
  const structRegex =
    /#\[derive\(Accounts\)\]\s*pub\s+struct\s+(\w+)<'info>\s*\{([\s\S]*?)\}/g;
  const structs: RustAccountStruct[] = [];

  let match;
  while ((match = structRegex.exec(content)) !== null) {
    const [, structName, body] = match;
    const accounts = parseAccountBody(body);

    structs.push({
      name: structName,
      accounts,
      docs: extractDocs(content, match.index),
    });
  }

  return structs;
}

function extractErrorEnum(content: string): RustError | undefined {
  const errorRegex = /#\[error_code\]\s*pub\s+enum\s+\w+\s*\{([\s\S]*?)\}/;
  const match = content.match(errorRegex);

  if (!match) return undefined;

  const variants = extractErrorVariants(match[1]);
  return { variants };
}

function parseArgs(argsStr: string): RustArg[] {
  if (!argsStr) return [];

  return argsStr.split(",").map((arg) => {
    const [name, type] = arg.trim().split(":").map((s) => s.trim());
    return { name, type };
  });
}

function parseAccountBody(body: string): RustAccount[] {
  const accounts: RustAccount[] = [];
  const lines = body.split("\n").filter((l) => l.trim());

  for (const line of lines) {
    if (line.includes("#[account")) {
      const constraints = extractConstraints(line);
      const nextLine = lines[lines.indexOf(line) + 1] || "";
      const typeMatch = nextLine.match(/pub\s+(\w+):\s*(\S+)/);

      if (typeMatch) {
        const [, accountName, accountType] = typeMatch;
        accounts.push({
          name: accountName,
          type: accountType,
          isMut: constraints.some((c) => c.includes("mut")),
          isSigner: accountType.includes("Signer"),
          constraints,
        });
      }
    }
  }

  return accounts;
}

function extractConstraints(line: string): string[] {
  const match = line.match(/#\[account\((.*?)\)\]/);
  if (!match) return [];

  return match[1]
    .split(",")
    .map((c) => c.trim())
    .filter((c) => c);
}

function extractErrorVariants(
  body: string
): Array<{ name: string; code: number; msg: string }> {
  const variants: Array<{ name: string; code: number; msg: string }> = [];
  const variantRegex =
    /#\[msg\("(.+?)"\)\]\s*(\w+)\s*=\s*(\d+)/g;

  let match;
  while ((match = variantRegex.exec(body)) !== null) {
    const [, msg, name, code] = match;
    variants.push({
      name,
      code: parseInt(code),
      msg,
    });
  }

  return variants;
}

function extractDocs(content: string, index: number): string | undefined {
  const before = content.substring(Math.max(0, index - 200), index);
  const docsMatch = before.match(/\/\/\/ (.*?)(?:\n|$)/);
  return docsMatch?.[1];
}
