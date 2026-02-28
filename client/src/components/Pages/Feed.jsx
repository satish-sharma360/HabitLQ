import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../../api/axios";

/* ── helpers ──────────────────────────────────────────────────────── */
const Spinner = () => (
  <div className="flex justify-center py-10">
    <div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const timeAgo = (iso) => {
  const diff = (Date.now() - new Date(iso)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const Avatar = ({ name, size = 9 }) => (
  <div
    className={`w-${size} h-${size} rounded-full bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-sm font-bold shrink-0 select-none`}
  >
    {name?.[0]?.toUpperCase() ?? "?"}
  </div>
);

/* ── Comment row ──────────────────────────────────────────────────── */
const CommentRow = ({ comment }) => (
  <div className="flex gap-2 items-start">
    <Avatar name={comment.userId?.name ?? "U"} size={7} />
    <div className="bg-zinc-800 rounded-xl px-3 py-2 text-sm flex-1">
      <span className="font-medium text-zinc-200 mr-2">
        {comment.userId?.name ?? "User"}
      </span>
      <span className="text-zinc-300">{comment.text}</span>
    </div>
  </div>
);

/* ── Post Card ────────────────────────────────────────────────────── */
const PostCard = ({ post, currentUserId, onLike, onComment, onDelete }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const liked = post.likes?.includes(currentUserId);
  const isOwner = post.userId?._id === currentUserId || post.userId === currentUserId;

  const handleComment = async () => {
    const trimmed = commentText.trim();
    if (!trimmed || submitting) return;
    setSubmitting(true);
    await onComment(post._id, trimmed);
    setCommentText("");
    setSubmitting(false);
    setShowComments(true);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
      {/* header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar name={post.userId?.name ?? "U"} />
          <div>
            <p className="font-semibold text-sm">{post.userId?.name ?? "User"}</p>
            <p className="text-xs text-zinc-500">{timeAgo(post.createdAt)}</p>
          </div>
        </div>
        {isOwner && (
          <button
            onClick={() => onDelete(post._id)}
            className="text-zinc-600 hover:text-red-400 transition-colors text-xs px-2 py-1 rounded-lg hover:bg-zinc-800"
          >
            Delete
          </button>
        )}
      </div>

      {/* content */}
      <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap">{post.content}</p>

      {/* action bar */}
      <div className="flex items-center gap-4 pt-1 border-t border-zinc-800">
        <button
          onClick={() => onLike(post._id)}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            liked ? "text-indigo-400" : "text-zinc-400 hover:text-indigo-400"
          }`}
        >
          <span>{liked ? "👍" : "🤍"}</span>
          <span>{post.likes?.length ?? 0}</span>
        </button>

        <button
          onClick={() => setShowComments((s) => !s)}
          className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-indigo-400 transition-colors"
        >
          <span>💬</span>
          <span>{post.comments?.length ?? 0}</span>
        </button>
      </div>

      {/* comments section */}
      {showComments && (
        <div className="space-y-3 pt-1">
          {post.comments?.length > 0 ? (
            post.comments.map((c, i) => <CommentRow key={i} comment={c} />)
          ) : (
            <p className="text-xs text-zinc-500 text-center py-2">No comments yet.</p>
          )}

          {/* add comment */}
          <div className="flex gap-2 items-center pt-1">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleComment()}
              placeholder="Write a comment…"
              className="flex-1 bg-zinc-800 border border-zinc-700 focus:border-indigo-500 text-sm px-3 py-2 rounded-xl outline-none transition-colors placeholder-zinc-500"
            />
            <button
              onClick={handleComment}
              disabled={!commentText.trim() || submitting}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 px-3 py-2 rounded-xl text-sm transition-colors"
            >
              {submitting ? "…" : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════ */
const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postText, setPostText] = useState("");
  const [posting, setPosting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  /* fetch feed */
  const fetchFeed = async () => {
    try {
      const { data } = await axiosInstance.get("/post");
      setPosts(data.data);
    } catch (err) {
      console.error("Error fetching feed", err);
    } finally {
      setLoading(false);
    }
  };

  /* get current user id from token/profile */
  useEffect(() => {
    fetchFeed();
    axiosInstance
      .get("/gamification/profile")
      .then(({ data }) => setCurrentUserId(data.data._id))
      .catch(() => {});
  }, []);

  /* create post */
  const createPost = async () => {
    const trimmed = postText.trim();
    if (!trimmed || posting) return;
    setPosting(true);
    try {
      const { data } = await axiosInstance.post("/post", { content: trimmed });
      setPosts((prev) => [data.data, ...prev]);
      setPostText("");
    } catch (err) {
      alert(err.response?.data?.message || "Error creating post");
      console.error(err);
    } finally {
      setPosting(false);
    }
  };

  /* toggle like — optimistic update */
  const toggleLike = async (postId) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p._id !== postId) return p;
        const liked = p.likes?.includes(currentUserId);
        return {
          ...p,
          likes: liked
            ? p.likes.filter((id) => id !== currentUserId)
            : [...(p.likes ?? []), currentUserId],
        };
      })
    );
    try {
      await axiosInstance.post(`/post/${postId}/like`);
    } catch (err) {
      console.error("Like failed", err);
      fetchFeed(); // revert on error
    }
  };

  /* add comment */
  const addComment = async (postId, text) => {
    try {
      const { data } = await axiosInstance.post(`/post/${postId}/comment`, { text });
      // refresh that single post's comments
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? data.data : p))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Error posting comment");
      console.error(err);
    }
  };

  /* delete post */
  const deletePost = async (postId) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await axiosInstance.delete(`/post/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting post");
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Community Feed</h1>
        <p className="text-sm text-zinc-400 mt-0.5">Share your progress with the community</p>
      </div>

      {/* create post */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
        <textarea
          rows={3}
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          placeholder="Share your progress, a win, or some motivation… 🔥"
          className="w-full bg-zinc-800 border border-zinc-700 focus:border-indigo-500 text-sm text-zinc-100 placeholder-zinc-500 p-3 rounded-xl outline-none resize-none transition-colors"
        />
        <div className="flex justify-between items-center">
          <span className="text-xs text-zinc-500">{postText.length}/500</span>
          <button
            onClick={createPost}
            disabled={!postText.trim() || posting || postText.length > 500}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed px-5 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            {posting ? "Posting…" : "Post"}
          </button>
        </div>
      </div>

      {/* feed */}
      {loading ? (
        <Spinner />
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-zinc-500 space-y-2">
          <p className="text-3xl">📭</p>
          <p className="text-sm">No posts yet. Be the first to share!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              currentUserId={currentUserId}
              onLike={toggleLike}
              onComment={addComment}
              onDelete={deletePost}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Feed;