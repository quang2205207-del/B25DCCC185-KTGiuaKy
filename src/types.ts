export interface ApiPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface LocalPost {
  id: string;
  userId: number;
  title: string;
  body: string;
  createdAt: string;
  isLocal: true;
}

export interface Comment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

export type BlogPost = ApiPost | LocalPost;
