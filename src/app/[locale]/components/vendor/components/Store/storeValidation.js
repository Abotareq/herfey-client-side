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
      required_error: "Store name is required",
      invalid_type_error: "Store name must be text",
    })
    .trim()
    .min(3, { message: "Store name must be at least 3 characters" })
    .max(100, { message: "Store name cannot exceed 100 characters" }),

  description: z
    .string({
      required_error: "Store description is required",
      invalid_type_error: "Store description must be text",
    })
    .trim()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(1000, { message: "Description cannot exceed 1000 characters" }),

  logoUrl: z
    .instanceof(File, { message: "Logo must be a valid file" })
    .optional(),

  status: z
    .enum(["pending", "approved", "rejected", "suspended"], {
      invalid_type_error: "Invalid status value",
    })
    .optional(),

  location: z
    .object({
      type: z.enum(["Point"]).default("Point"),
      coordinates: z
        .array(z.number(), { message: "Coordinates must be numbers" })
        .length(2, { message: "Location must have longitude and latitude" })
        .refine(
          ([longitude, latitude]) => {
            const isValidLng = longitude >= -180 && longitude <= 180;
            const isValidLat = latitude >= -90 && latitude <= 90;
            return isValidLng && isValidLat;
          },
          {
            message: "Invalid coordinates. Longitude: -180 to 180, Latitude: -90 to 90",
          }
        ),
    })
    .optional(),

  address: z.object({
    city: z
      .string({
        required_error: "City is required",
        invalid_type_error: "City must be text",
      })
      .trim()
      .min(2, { message: "City name must be at least 2 characters" })
      .max(100, { message: "City name cannot exceed 100 characters" }),

    postalCode: z
      .union([z.string(), z.number()])
      .transform((val) => String(val).trim())
      .refine((val) => val.length > 0, { message: "Postal code is required" })
      .refine((val) => /^[A-Za-z0-9\s-]{3,10}$/.test(val), { 
        message: "Postal code must be 3-10 characters (letters, numbers, spaces, hyphens only)" 
      }),

    street: z
      .string({
        required_error: "Street address is required",
        invalid_type_error: "Street address must be text",
      })
      .trim()
      .min(5, { message: "Street address must be at least 5 characters" })
      .max(200, { message: "Street address cannot exceed 200 characters" }),
  }),

  policies: z
    .object({
      shipping: z
        .string()
        .trim()
        .max(500, { message: "Shipping policy cannot exceed 500 characters" })
        .optional(),
      returns: z
        .string()
        .trim()
        .max(500, { message: "Returns policy cannot exceed 500 characters" })
        .optional(),
    })
    .optional(),
});

// Update Store Validation Schema - all fields optional except critical ones
export const updateStoreSchema = createStoreSchema.partial({
  address: true,
  location: true,
  policies: true,
}).extend({
  // Keep address validation when provided
  address: z.object({
    city: z
      .string()
      .trim()
      .min(2, { message: "City name must be at least 2 characters" })
      .max(100, { message: "City name cannot exceed 100 characters" })
      .optional(),
    postalCode: z
      .union([z.string(), z.number()])
      .transform((val) => String(val).trim())
      .refine((val) => val.length === 0 || /^[A-Za-z0-9\s-]{3,10}$/.test(val), { 
        message: "Postal code must be 3-10 characters if provided" 
      })
      .optional(),
    street: z
      .string()
      .trim()
      .min(0)
      .max(200, { message: "Street address cannot exceed 200 characters" })
      .optional(),
  }).optional(),
});

// ----------------------------
// Utility functions
// ----------------------------
const formatZodError = (error) => {
  if (error instanceof ZodError && error.errors && Array.isArray(error.errors)) {
    return error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));
  }
  return [{ field: "unknown", message: error?.message || "Unexpected validation error" }];
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
    const formattedErrors = formatZodError(error);
    const errorMap = {};
    
    formattedErrors.forEach((err) => {
      errorMap[err.field] = err.message;
    });

    return {
      isValid: false,
      data: null,
      errors: errorMap,
    };
  }
};

// ----------------------------
// Field-level validation
// ----------------------------
const fieldValidationSchemas = {
  name: z
    .string()
    .trim()
    .min(3, { message: "Store name must be at least 3 characters" })
    .max(100, { message: "Store name cannot exceed 100 characters" }),
    
  description: z
    .string()
    .trim()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(1000, { message: "Description cannot exceed 1000 characters" }),
    
    logoUrl: z
    .instanceof(File, { message: "Logo must be a valid file" })
    .optional(),
    
  status: z
    .enum(["pending", "approved", "rejected", "suspended"], {
      message: "Invalid status value"
    })
    .optional(),
    
  "address.city": z
    .string()
    .trim()
    .min(2, { message: "City name must be at least 2 characters" })
    .max(100, { message: "City name cannot exceed 100 characters" }),
    
  "address.postalCode": z
    .union([z.string(), z.number()])
    .transform((val) => String(val).trim())
    .refine((val) => val.length > 0, { message: "Postal code is required" })
    .refine((val) => /^[A-Za-z0-9\s-]{3,10}$/.test(val), { 
      message: "Invalid postal code format" 
    }),
    
  "address.street": z
    .string()
    .trim()
    .min(5, { message: "Street address must be at least 5 characters" })
    .max(200, { message: "Street address cannot exceed 200 characters" }),
    
  "location.coordinates": z
    .array(z.number())
    .length(2, { message: "Location must have longitude and latitude" })
    .refine(
      ([longitude, latitude]) => {
        if (longitude === 0 && latitude === 0) return true; // Allow default values
        const isValidLng = longitude >= -180 && longitude <= 180;
        const isValidLat = latitude >= -90 && latitude <= 90;
        return isValidLng && isValidLat;
      },
      { message: "Invalid coordinates" }
    )
    .optional(),
    
  "policies.shipping": z
    .string()
    .trim()
    .max(500, { message: "Shipping policy cannot exceed 500 characters" })
    .optional(),
    
  "policies.returns": z
    .string()
    .trim()
    .max(500, { message: "Returns policy cannot exceed 500 characters" })
    .optional(),
};

export const validateField = (fieldName, value, isUpdate = false) => {
  try {
    // Handle empty values for update mode
    if (isUpdate && (value === "" || value === null || value === undefined)) {
      return { isValid: true, error: null };
    }

    // Get the appropriate schema for this field
    const schema = fieldValidationSchemas[fieldName];
    
    if (!schema) {
      return { isValid: true, error: null };
    }

    // Special handling for file inputs
    if (fieldName === "logoUrl" && value instanceof FileList) {
      value = value[0] || null;
    }

    // Parse the value with the schema
    schema.parse(value);
    return { isValid: true, error: null };
    
  } catch (error) {
    // Handle both ZodError and regular errors
    if (error instanceof ZodError) {
      const formatted = formatZodError(error);
      return { 
        isValid: false, 
        error: formatted[0]?.message || "Invalid value" 
      };
    } else {
      // Handle other types of errors (like transform errors)
      return {
        isValid: false,
        error: error?.message || "Invalid value"
      };
    }
  }
};

// ----------------------------
// Helper functions for the React component
// ----------------------------
export const getFieldRequiredStatus = (fieldName, isUpdate = false) => {
  if (isUpdate) return false; // All fields optional in update mode
  
  const requiredFields = [
    'name',
    'description',
    'address.city',
    'address.postalCode', 
    'address.street'
  ];
  
  return requiredFields.includes(fieldName);
};

export const getValidationMessage = (fieldName, value, isUpdate = false) => {
  const validation = validateField(fieldName, value, isUpdate);
  return validation.error;
};