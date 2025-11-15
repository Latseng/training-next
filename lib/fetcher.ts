export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const fetcher = async (url: string) =>
  fetch(`${API_URL}${url}`, {
    credentials: "include",
  }).then((response) => {
    // 錯誤處理
    if (!response.ok) {
      throw new Error("An error occurred while fetching the data.");
    }
    return response.json();
  });

export async function mutateFetcher(
  endpoint: string,
  method = "POST",
  id = "",
  payload = {}
) {
  const response = await fetch(`${API_URL}${endpoint}/${id}`, {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: payload ? JSON.stringify(payload) : undefined,
  });

  // 錯誤處理
  if (!response.ok) {
    throw new Error("An error occurred while fetching the data.");
  } else {
    return true
  }
}
