import type { ApiPost, Comment } from "./types";

const API_BASE = "https://jsonplaceholder.typicode.com";

function isApiPost(value: unknown): value is ApiPost {
  if (typeof value !== "object" || value === null) return false;
  const post = value as Record<string, unknown>;
  return (
    typeof post.id === "number" &&
    typeof post.userId === "number" &&
    typeof post.title === "string" &&
    typeof post.body === "string"
  );
}

function isComment(value: unknown): value is Comment {
  if (typeof value !== "object" || value === null) return false;
  const comment = value as Record<string, unknown>;
  return (
    typeof comment.postId === "number" &&
    typeof comment.id === "number" &&
    typeof comment.name === "string" &&
    typeof comment.email === "string" &&
    typeof comment.body === "string"
  );
}

async function request<T>(
  path: string,
  validate: (value: unknown) => value is T,
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`);
  if (!response.ok) {
    throw new Error(`Không thể tải dữ liệu (HTTP ${response.status}). Vui lòng thử lại.`);
  }
  const data: unknown = await response.json();
  if (!validate(data)) {
    throw new Error("Dữ liệu nhận được không hợp lệ. Vui lòng thử lại.");
  }
  return data;
}

export function fetchPosts(): Promise<ApiPost[]> {
  return request<ApiPost[]>("/posts", (value): value is ApiPost[] =>
    Array.isArray(value) && value.every(isApiPost),
  );
}

export function fetchPost(id: number): Promise<ApiPost> {
  return request<ApiPost>(`/posts/${id}`, isApiPost);
}

export function fetchComments(postId: number): Promise<Comment[]> {
  return request<Comment[]>(`/posts/${postId}/comments`, (value): value is Comment[] =>
    Array.isArray(value) && value.every(isComment),
  );
}
