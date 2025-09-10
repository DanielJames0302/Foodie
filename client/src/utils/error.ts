export const getAxiosErrorMessage = (error: unknown, fallbackMessage: string = "Something went wrong"): string => {
  if (typeof error === "string") return error;
  if (error && typeof error === "object") {
    const anyErr = error as any;
    // Axios error shape: err.response.data can be string or object
    const response = anyErr?.response;
    if (response) {
      const data = response.data;
      if (typeof data === "string" && data.trim().length > 0) return data;
      if (data && typeof data === "object") {
        if (typeof data.message === "string" && data.message.trim().length > 0) return data.message;
        if (typeof data.error === "string" && data.error.trim().length > 0) return data.error;
      }
      const statusText: string | undefined = response.statusText;
      if (statusText && statusText.trim().length > 0) return statusText;
    }
    // Fall back to generic message
    if (typeof anyErr.message === "string" && anyErr.message.trim().length > 0) return anyErr.message;
  }
  return fallbackMessage;
};


