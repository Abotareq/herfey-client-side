import { z, ZodError } from "zod";

// Helper function to validate ObjectId format (basic validation)
const isValidObjectId = (value) => /^[0-9a-fA-F]{24}$/.test(value);

// Create Store Validation Schema
export const createStoreSchema = z.object({
  owner: z
    .string()
    .optional()
    .refine((value) => !value || isValidObjectId(value), {
      message: "Invalid ObjectId format",
    }),

  name: z
    .string({
      required_error: "name is a required field",
      invalid_type_error: "name should be a type of 'text'",
    })
    .trim()
    .min(3, { message: "name should have a minimum length of 3" })
    .max(100, { message: "name should have a maximum length of 100" }),

  description: z
    .string({
      required_error: "description is a required field",
      invalid_type_error: "description should be a type of 'text'",
    })
    .trim()
    .min(10, { message: "description should have a minimum length of 10" }),

  logoUrl: z.instanceof(File, { message: "Logo must be a file" }).optional(),

  status: z
    .enum(["pending", "approved", "rejected", "suspended"], {
      invalid_type_error: "status should be a type of 'text'",
    })
    .optional(),

  location: z
    .object({
      type: z.enum(["Point"]).optional(),
      coordinates: z
        .array(z.number())
        .length(2, { message: "location.coordinates must have exactly 2 items" })
        .refine(
          ([longitude, latitude]) =>
            longitude >= -180 &&
            longitude <= 180 &&
            latitude >= -90 &&
            latitude <= 90,
          {
            message:
              "location.coordinates[0] must be between -180 and 180, and coordinates[1] must be between -90 and 90",
          }
        )
        .optional(),
    })
    .optional(),

  address: z.object({
    city: z
      .string({
        required_error: "address.city is required",
        invalid_type_error: "address.city should be a type of 'text'",
      })
      .trim()
      .min(1, { message: "address.city cannot be empty" }),

    postalCode: z
      .union([z.string(), z.number()], {
        required_error: "address.postalCode is required",
      })
      .transform((val) => {
        const num = typeof val === "string" ? parseInt(val, 10) : val;
        if (isNaN(num)) throw new Error("address.postalCode must be a valid number");
        return num;
      }),

    street: z
      .string({
        required_error: "address.street is required",
        invalid_type_error: "address.street should be a type of 'text'",
      })
      .trim()
      .min(1, { message: "address.street cannot be empty" }),
  }),

  policies: z
    .object({
      shipping: z.string().optional(),
      returns: z.string().optional(),
    })
    .optional(),
});

// Update Store Validation Schema = كل الحقول optional
export const updateStoreSchema = createStoreSchema.partial();

// ----------------------------
// Utility functions
// ----------------------------
const formatZodError = (error) => {
  if (error instanceof ZodError) {
    return error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));
  }
  return [{ field: "unknown", message: "Unexpected validation error" }];
};

export const validateCreateStore = (data) => {
  try {
    return { success: true, data: createStoreSchema.parse(data) };
  } catch (error) {
    return { success: false, errors: formatZodError(error) };
  }
};

export const validateUpdateStore = (data) => {
  try {
    return { success: true, data: updateStoreSchema.parse(data) };
  } catch (error) {
    return { success: false, errors: formatZodError(error) };
  }
};

// ----------------------------
// Form-specific validation helpers
// ----------------------------
export const validateStoreForm = (formData, isUpdate = false) => {
  const schema = isUpdate ? updateStoreSchema : createStoreSchema;
  try {
    const validatedData = schema.parse(formData);
    return { isValid: true, data: validatedData, errors: {} };
  } catch (error) {
    return {
      isValid: false,
      data: null,
      errors: Object.fromEntries(
        formatZodError(error).map((err) => [err.field, err.message])
      ),
    };
  }
};

// ----------------------------
// Field-level validation
// ----------------------------
const fieldValidationSchemas = {
  name: z.string().trim().min(3).max(100),
  description: z.string().trim().min(10),
  logoUrl: z.instanceof(File, { message: "Logo must be a file" }),
  status: z.enum(["pending", "approved", "rejected", "suspended"]).optional(),
};

export const validateField = (fieldName, value) => {
  try {
    if (fieldValidationSchemas[fieldName]) {
      fieldValidationSchemas[fieldName].parse(value);
      return { isValid: true, error: null };
    }

    // complex fields (address, location, policies) are validated only in full form
    return { isValid: true, error: null };
  } catch (error) {
    const formatted = formatZodError(error);
    return { isValid: false, error: formatted[0]?.message || "Invalid value" };
  }
};