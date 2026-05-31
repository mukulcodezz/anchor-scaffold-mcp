import { readFileSync } from "fs";

export interface IdlInstruction {
  name: string;
  docs?: string[];
  accounts: IdlAccount[];
  args: IdlArg[];
}

export interface IdlAccount {
  name: string;
  isMut: boolean;
  isSigner: boolean;
  isOptional?: boolean;
  docs?: string[];
  pda?: {
    seeds: IdlSeed[];
    bump?: IdlSeed;
  };
  relations?: string[];
}

export interface IdlArg {
  name: string;
  type: string;
  docs?: string[];
}

export interface IdlSeed {
  kind: "const" | "arg" | "account";
  value?: string;
  path?: string;
}

export interface IdlError {
  code: number;
  name: string;
  msg: string;
}

export interface IdlType {
  name: string;
  type: {
    kind: string;
    fields?: Array<{ name: string; type: string }>;
    variants?: Array<{ name: string; fields?: Array<{ name: string; type: string }> }>;
  };
}

export interface ParsedIdl {
  programId: string;
  name: string;
  instructions: IdlInstruction[];
  accounts: IdlType[];
  types: IdlType[];
  errors: IdlError[];
  docs?: string[];
}

export function parseIdl(filePath: string): ParsedIdl {
  const content = readFileSync(filePath, "utf-8");
  const idl = JSON.parse(content);

  return {
    programId: idl.metadata?.address || idl.address || "11111111111111111111111111111111",
    name: idl.name,
    instructions: (idl.instructions || []).map(mapInstruction),
    accounts: (idl.accounts || []).map(mapType),
    types: (idl.types || []).map(mapType),
    errors: idl.errors || [],
    docs: idl.docs,
  };
}

function mapInstruction(instr: any): IdlInstruction {
  return {
    name: instr.name,
    docs: instr.docs,
    accounts: (instr.accounts || []).map(mapAccount),
    args: (instr.args || []).map(mapArg),
  };
}

function mapAccount(acc: any): IdlAccount {
  return {
    name: acc.name,
    isMut: acc.isMut || false,
    isSigner: acc.isSigner || false,
    isOptional: acc.isOptional,
    docs: acc.docs,
    pda: acc.pda
      ? {
          seeds: (acc.pda.seeds || []).map(mapSeed),
          bump: acc.pda.bump ? mapSeed(acc.pda.bump) : undefined,
        }
      : undefined,
    relations: acc.relations,
  };
}

function mapArg(arg: any): IdlArg {
  return {
    name: arg.name,
    type: typeof arg.type === "string" ? arg.type : JSON.stringify(arg.type),
    docs: arg.docs,
  };
}

function mapSeed(seed: any): IdlSeed {
  if (typeof seed === "object") {
    return {
      kind: seed.kind || "const",
      value: seed.value,
      path: seed.path,
    };
  }
  return { kind: "const", value: seed };
}

function mapType(type: any): IdlType {
  return {
    name: type.name,
    type: type.type || { kind: "struct" },
  };
}
