import { existsSync } from "fs";

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export class ValidationResult {
  errors: ValidationError[] = [];

  addError(field: string, message: string, code: string) {
    this.errors.push({ field, message, code });
  }

  isValid(): boolean {
    return this.errors.length === 0;
  }

  toString(): string {
    return this.errors.map((e) => `${e.field}: ${e.message}`).join("\n");
  }
}

export function validateIdlPath(path: string): ValidationResult {
  const result = new ValidationResult();

  if (!path) {
    result.addError("idl_path", "IDL path is required", "MISSING_IDL");
    return result;
  }

  if (!path.endsWith(".json")) {
    result.addError(
      "idl_path",
      "IDL path must end with .json",
      "INVALID_IDL_EXT"
    );
    return result;
  }

  if (!existsSync(path)) {
    result.addError("idl_path", `IDL file not found: ${path}`, "IDL_NOT_FOUND");
    return result;
  }

  return result;
}

export function validateInstructionName(name: string): ValidationResult {
  const result = new ValidationResult();

  if (!name) {
    result.addError(
      "instruction_name",
      "Instruction name is required",
      "MISSING_INSTR"
    );
    return result;
  }

  if (!/^[a-z_]+$/.test(name)) {
    result.addError(
      "instruction_name",
      "Instruction name must be snake_case",
      "INVALID_INSTR_NAME"
    );
    return result;
  }

  return result;
}

export function validateProgramName(name: string): ValidationResult {
  const result = new ValidationResult();

  if (!name) {
    result.addError(
      "program_name",
      "Program name is required",
      "MISSING_PROG_NAME"
    );
    return result;
  }

  if (!/^[a-z_]+$/.test(name)) {
    result.addError(
      "program_name",
      "Program name must be snake_case",
      "INVALID_PROG_NAME"
    );
    return result;
  }

  if (name.length > 64) {
    result.addError(
      "program_name",
      "Program name too long (max 64 chars)",
      "PROG_NAME_TOO_LONG"
    );
    return result;
  }

  return result;
}

export function validateDescription(desc: string): ValidationResult {
  const result = new ValidationResult();

  if (!desc) {
    result.addError(
      "description",
      "Description is required",
      "MISSING_DESC"
    );
    return result;
  }

  if (desc.length < 10) {
    result.addError(
      "description",
      "Description must be at least 10 characters",
      "DESC_TOO_SHORT"
    );
    return result;
  }

  if (desc.length > 2000) {
    result.addError(
      "description",
      "Description too long (max 2000 chars)",
      "DESC_TOO_LONG"
    );
    return result;
  }

  return result;
}

export function validateApiKey(key: string): ValidationResult {
  const result = new ValidationResult();

  if (!key) {
    result.addError(
      "SCAFFOLD_API_KEY",
      "API key not configured. Set SCAFFOLD_API_KEY env var or ~/.anchor-scaffold/config.json",
      "MISSING_API_KEY"
    );
    return result;
  }

  if (key.length < 20) {
    result.addError(
      "SCAFFOLD_API_KEY",
      "API key appears invalid (too short)",
      "INVALID_API_KEY"
    );
    return result;
  }

  return result;
}
