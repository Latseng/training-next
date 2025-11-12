const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const fetcher = async (url: string) =>
  fetch(`${API_URL}${url}`, {
    credentials: "include", // 讓瀏覽器自動帶入 HttpOnly Cookie
  }).then((res) => {
    // 處理錯誤
    if (!res.ok) {
      throw new Error("An error occurred while fetching the data.");
    }
    return res.json();
  });

