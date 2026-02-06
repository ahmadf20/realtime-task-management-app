export const tokenUtils = {
  getToken: (): string | null => {
    if (typeof window !== "undefined") {
      const cookies = document.cookie.split(";");
      const tokenCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("token="),
      );
      return tokenCookie ? tokenCookie.split("=")[1] : null;
    }
    return null;
  },

  setToken: (token: string): void => {
    if (typeof window !== "undefined") {
      document.cookie = `token=${token}; path=/; max-age=86400; secure; samesite=strict`;
    }
  },

  removeToken: (): void => {
    if (typeof window !== "undefined") {
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  },

  getAuthHeader: (): { Authorization: string } | Record<string, never> => {
    const token = tokenUtils.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};
