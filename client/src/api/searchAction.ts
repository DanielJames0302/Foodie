import { makeRequest } from "../axios"


export const fetchSearchingResults = async (username: string) => {
  const response = await makeRequest.post("/users/search_profile?username=" + username);

  if (response.status !== 200) {
    throw Error("Some thing went wrong")
  }

  if (!response.data) {
    throw Error("data is undefined")
  }
  console.log(response.data)
  return response.data
}