import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import { fetchComments, fetchPost, fetchPosts } from "./api";
import { isAuthenticated, loadLocalPosts, saveLocalPosts, setAuthenticated } from "./storage";
import { VIETNAMESE_STORIES } from "./stories";
import { STORY_ARTWORK } from "./storyArtwork";
import { getVietnameseAuthor, getVietnameseComment } from "./vietnamesePeople";
import type { ApiPost, BlogPost, Comment, LocalPost } from "./types";

function App() {
  const stored = useMemo(loadLocalPosts, []);
  const [localPosts, setLocalPosts] = useState(stored.posts);
  const [storageError, setStorageError] = useState(stored.error);
  const [authenticated, setIsAuthenticated] = useState(isAuthenticated);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("miniblog-theme") === "dark");

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    localStorage.setItem("miniblog-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  function addPost(post: LocalPost) {
    const nextPosts = [post, ...localPosts];
    try {
      saveLocalPosts(nextPosts);
      setLocalPosts(nextPosts);
      setStorageError(null);
    } catch {
      setStorageError("Không thể lưu bài viết. Hãy kiểm tra dung lượng trình duyệt.");
      throw new Error("Không thể lưu bài viết vào localStorage.");
    }
  }

  function login() {
    setAuthenticated(true);
    setIsAuthenticated(true);
  }

  function logout() {
    setAuthenticated(false);
    setIsAuthenticated(false);
  }

  return (
    <div className="app-shell">
      <Header
        authenticated={authenticated}
        darkMode={darkMode}
        onToggleTheme={() => setDarkMode((enabled) => !enabled)}
        onLogout={logout}
      />
      <main className="page">
        {storageError && <div className="notice notice-error" role="alert">{storageError}</div>}
        <Routes>
          <Route
            path="/"
            element={<HomePage localPosts={localPosts} />}
          />
          <Route
            path="/posts/:id"
            element={<PostDetailPage localPosts={localPosts} />}
          />
          <Route
            path="/login"
            element={authenticated ? <Navigate to="/" replace /> : <LoginPage onLogin={login} />}
          />
          <Route
            path="/write"
            element={
              authenticated
                ? <WritePage onCreate={addPost} />
                : <Navigate to="/login" replace state={{ from: "/write" }} />
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <footer className="site-footer">MiniBlog <span>·</span> Một góc nhỏ để sẻ chia</footer>
    </div>
  );
}

function Header({
  authenticated,
  darkMode,
  onToggleTheme,
  onLogout,
}: {
  authenticated: boolean;
  darkMode: boolean;
  onToggleTheme: () => void;
  onLogout: () => void;
}) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" to="/" aria-label="MiniBlog - trang chủ">
          <span>mini<span className="brand-light">blog</span></span>
        </Link>
        <nav className="nav-links" aria-label="Điều hướng chính">
          <Link to="/">Bài viết</Link>
          <button
            className="theme-toggle"
            type="button"
            onClick={onToggleTheme}
            aria-pressed={darkMode}
            aria-label={darkMode ? "Bật giao diện sáng" : "Bật giao diện tối"}
            title={darkMode ? "Bật giao diện sáng" : "Bật giao diện tối"}
          >
            <span aria-hidden="true">{darkMode ? "☀" : "☾"}</span>
          </button>
          {authenticated ? (
            <>
              <Link className="nav-write" to="/write"><span aria-hidden="true">＋</span> Viết bài</Link>
              <button className="nav-button" onClick={onLogout}>Đăng xuất</button>
            </>
          ) : (
            <Link className="nav-login" to="/login">Đăng nhập <span aria-hidden="true">↗</span></Link>
          )}
        </nav>
      </div>
    </header>
  );
}

function HomePage({ localPosts }: { localPosts: LocalPost[] }) {
  const [apiPosts, setApiPosts] = useState<ApiPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  async function loadPosts() {
    setLoading(true);
    setError(null);
    try {
      const posts = await fetchPosts();
      setApiPosts(
        posts
          .filter((post) => VIETNAMESE_STORIES[post.id])
          .map((post) => ({ ...post, ...VIETNAMESE_STORIES[post.id] })),
      );
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Đã xảy ra lỗi khi tải bài viết.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadPosts();
  }, []);

  const posts: BlogPost[] = [...localPosts, ...apiPosts];
  const filteredPosts = posts.filter((post) =>
    post.title.toLocaleLowerCase("vi").includes(query.trim().toLocaleLowerCase("vi")),
  );

  return (
    <>
      <section className="hero">
        <p className="eyebrow">GÓC ĐỌC CỦA BẠN</p>
        <h1>Những câu chuyện<br />nhỏ, <em>ý nghĩa lớn.</em></h1>
        <p className="hero-copy">Khám phá những suy nghĩ và câu chuyện được chia sẻ từ khắp nơi.</p>
      </section>

      <section className="posts-section" aria-labelledby="posts-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">MỚI NHẤT</p>
            <h2 id="posts-heading">Bài viết <span className="heading-dot">.</span></h2>
          </div>
          <label className="search-box">
            <span className="search-icon" aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Tìm theo tiêu đề..."
              aria-label="Tìm bài viết theo tiêu đề"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>

        {error && (
          <div className="notice notice-error" role="alert">
            <span>{error}</span>
            <button className="text-button" onClick={() => void loadPosts()}>Thử lại</button>
          </div>
        )}
        {loading ? (
          <div className="loading-state" role="status"><span className="spinner" />Đang tải bài viết...</div>
        ) : filteredPosts.length > 0 ? (
          <div className="post-grid">
            {filteredPosts.map((post, index) => <PostCard key={post.id} post={post} index={index} />)}
          </div>
        ) : (
          <div className="empty-state">
            <span aria-hidden="true">⌕</span>
            <h3>{query ? "Không tìm thấy bài viết" : "Chưa có bài viết nào"}</h3>
            <p>{query ? "Thử một từ khóa khác nhé." : "Hãy quay lại sau để khám phá thêm."}</p>
          </div>
        )}
      </section>
    </>
  );
}

function PostCard({ post, index }: { post: BlogPost; index: number }) {
  const number = String(index + 1).padStart(2, "0");
  const artwork = isLocalPost(post) ? undefined : STORY_ARTWORK[post.id];
  return (
    <article className="post-card">
      <div className={`card-art art-${index % 4}`} aria-hidden="true">
        {artwork ? (
          <img src={artwork.src} alt="" loading="lazy" />
        ) : (
          <span>{post.title.slice(0, 1).toLocaleUpperCase("vi")}</span>
        )}
        <small>{number}</small>
      </div>
      <div className="card-content">
        <div className="card-meta">
          <span>{isLocalPost(post) ? "BÀI VIẾT CỦA BẠN" : `BÀI VIẾT #${number}`}</span>
          <span className="meta-dot">·</span>
          <span>{isLocalPost(post) ? formatDate(post.createdAt) : getVietnameseAuthor(post.id)}</span>
        </div>
        <h3><Link to={`/posts/${post.id}`}>{post.title}</Link></h3>
        <p>{post.body}</p>
        <Link className="read-link" to={`/posts/${post.id}`}>Đọc bài viết <span aria-hidden="true">→</span></Link>
      </div>
    </article>
  );
}

function PostDetailPage({ localPosts }: { localPosts: LocalPost[] }) {
  const { id = "" } = useParams();
  const localPost = localPosts.find((post) => post.id === id);
  const artwork = localPost ? undefined : STORY_ARTWORK[Number(id)];
  const [post, setPost] = useState<BlogPost | null>(localPost ?? null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(!localPost);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (localPost) {
      setPost(localPost);
      setComments([]);
      setLoading(false);
      setError(null);
      return;
    }
    const numericId = Number(id);
    const story = VIETNAMESE_STORIES[numericId];
    if (!Number.isInteger(numericId) || !story) {
      setLoading(false);
      setError("Không tìm thấy bài viết này.");
      return;
    }
    let active = true;
    setLoading(true);
    setError(null);
    Promise.all([fetchPost(numericId), fetchComments(numericId)])
      .then(([fetchedPost, fetchedComments]) => {
        if (!active) return;
        setPost({ ...fetchedPost, ...story });
        setComments(fetchedComments);
      })
      .catch((caught: unknown) => {
        if (active) setError(caught instanceof Error ? caught.message : "Đã xảy ra lỗi khi tải bài viết.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [id, localPost]);

  if (loading) return <div className="loading-state detail-loading" role="status"><span className="spinner" />Đang tải bài viết...</div>;
  if (error || !post) {
    return (
      <div className="message-page">
        <span className="message-icon" aria-hidden="true">!</span>
        <p className="eyebrow">KHÔNG THỂ MỞ BÀI VIẾT</p>
        <h1>{error ?? "Bài viết không tồn tại."}</h1>
        <Link className="button button-dark" to="/">Quay về trang chủ</Link>
      </div>
    );
  }

  return (
    <article className="detail-page">
      <Link className="back-link" to="/">← Tất cả bài viết</Link>
      <div className="detail-hero">
        <p className="eyebrow">{isLocalPost(post) ? "BÀI VIẾT CỦA BẠN" : `TÁC GIẢ ${getVietnameseAuthor(post.id)}`}</p>
        <h1>{post.title}</h1>
        <p className="detail-byline">{isLocalPost(post) ? formatDate(post.createdAt) : `Bài viết #${post.id}`} <span>·</span> MiniBlog</p>
      </div>
      {artwork && (
        <figure className="detail-artwork">
          <img src={artwork.src} alt={artwork.alt} />
          <figcaption>
            {artwork.credit && artwork.license && artwork.licenseUrl ? (
              <>
                Ảnh: {artwork.credit} ·{" "}
                <a href={artwork.licenseUrl} target="_blank" rel="noreferrer">{artwork.license}</a>
                {" · "}
              </>
            ) : null}
            {artwork.alt} · Nguồn{" "}
            <a href={artwork.source} target="_blank" rel="noreferrer">
              {artwork.sourceLabel ?? "Wikimedia Commons"}
            </a>
          </figcaption>
        </figure>
      )}
      <div className="detail-body">{post.body.split("\n").filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
      <section className="comments-section" aria-labelledby="comments-heading">
        <div className="comments-title">
          <div><p className="eyebrow">TRÒ CHUYỆN</p><h2 id="comments-heading">Bình luận <span className="comment-count">{comments.length}</span></h2></div>
        </div>
        {isLocalPost(post) ? (
          <p className="comments-empty">Bài viết mới chưa có bình luận.</p>
        ) : comments.length > 0 ? (
          <div className="comment-list">
            {comments.map((comment) => {
              const localizedComment = getVietnameseComment(comment);
              return (
                <article className="comment" key={comment.id}>
                  <div className="comment-avatar" aria-hidden="true">{localizedComment.name.slice(0, 1).toLocaleUpperCase("vi")}</div>
                  <div><h3>{localizedComment.name}</h3><p>{localizedComment.body}</p></div>
                </article>
              );
            })}
          </div>
        ) : <p className="comments-empty">Chưa có bình luận nào.</p>}
      </section>
    </article>
  );
}

function LoginPage({ onLogin }: { onLogin: () => void }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (username.trim() !== "admin" || password !== "123456") {
      setError("Tên đăng nhập hoặc mật khẩu chưa chính xác.");
      return;
    }
    onLogin();
    navigate("/write", { replace: true });
  }

  return (
    <div className="auth-layout">
      <section className="auth-intro">
        <p className="eyebrow">CHÀO MỪNG TRỞ LẠI</p>
        <h1>Ý tưởng của bạn<br />xứng đáng được <em>kể.</em></h1>
        <p>Đăng nhập để chia sẻ câu chuyện tiếp theo của bạn cùng MiniBlog.</p>
        <span className="auth-spark" aria-hidden="true">✳</span>
      </section>
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="eyebrow">TÀI KHOẢN CỦA BẠN</p>
        <h2>Đăng nhập</h2>
        <p className="form-hint">Nhập thông tin để tiếp tục.</p>
        {error && <div className="form-error" role="alert">{error}</div>}
        <label className="field-label" htmlFor="username">Tên đăng nhập</label>
        <input id="username" className="text-input" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required />
        <label className="field-label" htmlFor="password">Mật khẩu</label>
        <input id="password" className="text-input" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        <button className="button button-dark button-full" type="submit">Đăng nhập <span aria-hidden="true">→</span></button>
        <p className="demo-hint">Tài khoản demo: <strong>admin</strong> / <strong>123456</strong></p>
      </form>
    </div>
  );
}

function WritePage({ onCreate }: { onCreate: (post: LocalPost) => void }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = title.trim();
    const cleanBody = body.trim();
    if (cleanTitle.length < 3 || cleanTitle.length > 120) {
      setError("Tiêu đề cần có từ 3 đến 120 ký tự.");
      return;
    }
    if (cleanBody.length < 20) {
      setError("Nội dung cần có ít nhất 20 ký tự.");
      return;
    }
    const post: LocalPost = {
      id: `local-${Date.now()}`,
      userId: 1,
      title: cleanTitle,
      body: cleanBody,
      createdAt: new Date().toISOString(),
      isLocal: true,
    };
    try {
      onCreate(post);
      navigate(`/posts/${post.id}`);
    } catch {
      setError("Chưa lưu được bài viết. Vui lòng thử lại.");
    }
  }

  return (
    <div className="write-layout">
      <div className="write-heading">
        <Link className="back-link" to="/">← Tất cả bài viết</Link>
        <p className="eyebrow">KHÔNG GIAN CỦA BẠN</p>
        <h1>Viết một điều <em>đáng nhớ.</em></h1>
        <p>Một câu chuyện nhỏ có thể làm nên khác biệt lớn.</p>
      </div>
      <form className="write-form" onSubmit={handleSubmit} noValidate>
        {error && <div className="form-error" role="alert">{error}</div>}
        <label className="field-label" htmlFor="post-title">Tiêu đề <span>BẮT BUỘC</span></label>
        <input id="post-title" className="text-input title-input" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={120} placeholder="Bài viết của bạn nói về điều gì?" />
        <div className="field-counter">{title.trim().length}/120 ký tự (tối thiểu 3)</div>
        <label className="field-label body-label" htmlFor="post-body">Nội dung <span>BẮT BUỘC</span></label>
        <textarea id="post-body" className="text-input text-area" value={body} onChange={(event) => setBody(event.target.value)} placeholder="Bắt đầu viết câu chuyện của bạn..." rows={10} />
        <div className="field-counter">{body.trim().length} ký tự (tối thiểu 20)</div>
        <div className="form-actions">
          <Link className="button button-light" to="/">Hủy</Link>
          <button className="button button-dark" type="submit">Đăng bài <span aria-hidden="true">→</span></button>
        </div>
      </form>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="message-page not-found">
      <span className="not-found-number">404</span>
      <p className="eyebrow">LẠC MẤT RỒI</p>
      <h1>Trang này không tồn tại.</h1>
      <p>Đường dẫn bạn tìm có thể đã thay đổi hoặc không còn ở đây.</p>
      <Link className="button button-dark" to="/">Về trang chủ <span aria-hidden="true">→</span></Link>
    </div>
  );
}

function isLocalPost(post: BlogPost): post is LocalPost {
  return "isLocal" in post && post.isLocal;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(value));
}

export default App;
