import { makeRequest } from "../axios"

export const fetchSearchingResults = async (name: string) => {
  if (!name.trim()) {
    return [];
  }

  console.log("Searching for:", name);

  try {
    const response = await makeRequest.get("/users/search_profile?name=" + encodeURIComponent(name.trim()));
    
    console.log("Search response:", response);

    if (response.status !== 200) {
      throw new Error("Search request failed");
    }

    return response.data || [];
  } catch (error) {
    console.error("Search error:", error);
    throw new Error("Unable to search users");
  }
}