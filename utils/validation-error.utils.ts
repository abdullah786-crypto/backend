import { ValidationError } from "class-validator";

interface TransformedError {
    field: string,
    message: string
}

export function transformValidationErrors (errors: ValidationError[]): TransformedError[] {
    
    const formatted: TransformedError[] = []
    errors.forEach((error) => {
    if (error.constraints) {
      Object.values(error.constraints).forEach((message) => {
        formatted.push({
          field: error.property,
          message,
        });
      });
    }

    if (error.children && error.children.length > 0) {
      const childErrors = transformValidationErrors(error.children);
      formatted.push(...childErrors);
    }
  });
    return formatted;

}