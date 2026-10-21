import type { LocalPost } from "./types";

const POSTS_KEY = "miniblog-posts";
const AUTH_KEY = "miniblog-authenticated";

export interface StoredPosts {
  posts: LocalPost[];
  error: string | null;
}

function isLocalPost(value: unknown): value is LocalPost {
  if (typeof value !== "object" || value === null) return false;
  const post = value as Record<string, unknown>;
  return (
    typeof post.id === "string" &&
    typeof post.title === "string" &&
    typeof post.body === "string" &&
    typeof post.createdAt === "string" &&
    post.isLocal === true
  );
}

export function loadLocalPosts(): StoredPosts {
  try {
    const raw = localStorage.getItem(POSTS_KEY);
    if (!raw) return { posts: [], error: null };
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every(isLocalPost)) {
      return { posts: [], error: "Dữ liệu bài viết đã lưu không hợp lệ." };
    }
    return { posts: parsed, error: null };
  } catch {
    return {
      posts: [],
      error: "Không thể đọc bài viết đã lưu trên thiết bị này.",
    };
  }
}

export function saveLocalPosts(posts: LocalPost[]): void {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
}

export function isAuthenticated(): boolean {
  return sessionStorage.getItem(AUTH_KEY) === "true";
}

export function setAuthenticated(authenticated: boolean): void {
  if (authenticated) {
    sessionStorage.setItem(AUTH_KEY, "true");
  } else {
    sessionStorage.removeItem(AUTH_KEY);
  }
}
