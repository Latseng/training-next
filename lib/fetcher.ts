import camelcaseKeys from "camelcase-keys";

// export const API_URL =
//   process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
export const API_PROXY = "/api/proxy";

export const fetcher = async (url: string) => {
  const response = await fetch(`${API_PROXY}${url}`, {
    credentials: "include"})
    if (!response.ok) {
      throw new Error("An error occurred while fetching the data.");
    }
    const data = await response.json();
    const camelCasedData = camelcaseKeys(data, { deep: true });

    return camelCasedData;
}

export async function mutateFetcher(
  endpoint: string,
  method = "POST",
  id = "",
  payload = {}
) {
  const response = await fetch(`${API_PROXY}${endpoint}/${id}`, {
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
    return true;
  }
}
