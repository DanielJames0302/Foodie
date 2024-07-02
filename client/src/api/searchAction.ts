import { makeRequest } from "../axios"


export const fetchSearchingResults = async (name: string) => {
  const response = await makeRequest.post("/users/search_profile?name=" + name);

  if (response.status !== 200) {
    throw Error("Some thing went wrong")
  }

  if (!response.data) {
    throw Error("data is undefined")
  }
  return response.data
}