const BASE_URL = "http://localhost:8080/AirVista/v1"; // Change to your backend base URL

// Token helpers
export function setToken(token: string) {
    localStorage.setItem("token", token);
}
export function getToken() {
    return localStorage.getItem("token");
}
export function clearToken() {
    localStorage.removeItem("token");
}

// Generic fetch wrapper
async function request<T>(
    url: string,
    options: RequestInit = {},
    auth = false
): Promise<T> {
    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };
    if (auth) {
        const token = getToken();
        if (token) headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await fetch(BASE_URL + url, { ...options, headers });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw error || { message: res.statusText };
    }
    return res.json();
}

// API methods
export function apiGet<T>(url: string, auth = false) {
    return request<T>(url, { method: "GET" }, auth);
}
export function apiPost<T>(url: string, data: any, auth = false) {
    return request<T>(url, { method: "POST", body: JSON.stringify(data) }, auth);
}
export function apiPut<T>(url: string, data: any, auth = false) {
    return request<T>(url, { method: "PUT", body: JSON.stringify(data) }, auth);
}
export function apiDelete<T>(url: string, auth = false) {
    return request<T>(url, { method: "DELETE" }, auth);
} 