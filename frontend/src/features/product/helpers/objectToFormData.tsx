export const objectToFormData = <T extends Record<string, unknown>>(
  data: T,
) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value == null) return;

    if (key === "images") {
      (value as File[]).forEach((file) => formData.append("images", file));
      return;
    }

    if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
      return;
    }

    formData.append(key, String(value));
  });

  return formData;
};
