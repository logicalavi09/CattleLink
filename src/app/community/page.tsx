"use client";

import { useState, useEffect } from "react";
import { Sprout, Heart, MessageCircle, Share2, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useLanguage } from "@/lib/language-context";

interface Post {
  id: string;
  author: string;
  avatar: string;
  content: string;
  likes: number;
  comments: number;
  liked: boolean;
  timestamp: string;
}

const MOCK_POSTS: Post[] = [
  {
    id: "p1",
    author: "Ramesh Singh",
    avatar: "RS",
    content: "Mere Gir cow rozana 15 litre dudh de rahi hai. Kisi ko chahiye to batao! Haryana mein hoon.",
    likes: 24,
    comments: 8,
    liked: false,
    timestamp: "2 ghante pehle",
  },
  {
    id: "p2",
    author: "Sunita Devi",
    avatar: "SD",
    content: "Bhaiyon, meri buffalo ko teek lag gaya hai. Kya karna chahiye? Koi experienced kisaan guide karein.",
    likes: 15,
    comments: 12,
    liked: false,
    timestamp: "5 ghante pehle",
  },
  {
    id: "p3",
    author: "Gurpreet Kaur",
    avatar: "GK",
    content: "Sahiwal cow ka doodh kitna accha hota hai! 5% fat. Pure breed ka fayda. Apne经验 share karein.",
    likes: 32,
    comments: 6,
    liked: false,
    timestamp: "1 din pehle",
  },
  {
    id: "p4",
    author: "Mohammed Rafiq",
    avatar: "MR",
    content: "Is baar barish acchi hui hai, chara bhi accha hoga. Aap logon ko kaisa lag raha hai?",
    likes: 19,
    comments: 4,
    liked: false,
    timestamp: "2 din pehle",
  },
  {
    id: "p5",
    author: "Vikram Yadav",
    avatar: "VY",
    content: "Goat farming mein interesting hoon. Koi beetal goat ke baare mein jaankari de sakta hai?",
    likes: 11,
    comments: 9,
    liked: false,
    timestamp: "3 din pehle",
  },
];

export default function CommunityPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPosts(MOCK_POSTS);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSharePost = () => {
    if (!newPost.trim()) return;
    setPosting(true);
    setTimeout(() => {
      const post: Post = {
        id: `p${Date.now()}`,
        author: "Aap",
        avatar: "AP",
        content: newPost.trim(),
        likes: 0,
        comments: 0,
        liked: false,
        timestamp: "Abhi",
      };
      setPosts((prev) => [post, ...prev]);
      setNewPost("");
      setPosting(false);
      toast.success(t("community.post_shared"));
    }, 500);
  };

  const toggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          liked: !p.liked,
          likes: p.liked ? p.likes - 1 : p.likes + 1,
        };
      }),
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-earth-50">
      <header className="sticky top-0 z-40 border-b border-brand-100/80 bg-white/90 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex items-center gap-2 font-semibold text-ink-900"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-sm shadow-brand-600/25">
              <Sprout className="h-5 w-5" />
            </span>
            <span className="text-lg tracking-tight sm:text-xl">
              {t("community.title")}
            </span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("detail.back")}
        </Link>

        <div className="mb-6 rounded-2xl border border-brand-100 bg-white p-4 shadow-sm">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder={t("community.share_placeholder")}
            rows={2}
            className="w-full resize-none rounded-xl border border-brand-100 bg-white px-4 py-3 text-sm text-ink-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand-400 focus:ring-4 focus:ring-brand-100"
          />
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={handleSharePost}
              disabled={posting || !newPost.trim()}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {posting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Share2 className="h-4 w-4" />
              )}
              {t("community.share_btn")}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500">
            <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
            <p className="mt-3 text-sm">{t("community.loading")}</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-brand-100 bg-white px-6 py-16 text-center shadow-sm">
            <MessageCircle className="h-10 w-10 text-slate-400" />
            <p className="mt-4 text-sm text-slate-600">{t("community.empty")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <article
                key={post.id}
                className="rounded-2xl border border-brand-100 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                    {post.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-ink-900">{post.author}</p>
                      <span className="text-xs text-slate-400">{post.timestamp}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-700 whitespace-pre-wrap">
                      {post.content}
                    </p>
                    <div className="mt-4 flex items-center gap-6">
                      <button
                        type="button"
                        onClick={() => toggleLike(post.id)}
                        className={`inline-flex items-center gap-1.5 text-sm font-medium transition ${
                          post.liked
                            ? "text-red-600"
                            : "text-slate-500 hover:text-red-600"
                        }`}
                      >
                        <Heart
                          className={`h-4 w-4 ${post.liked ? "fill-current" : ""}`}
                        />
                        {post.likes} {t("community.like")}
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-brand-600"
                      >
                        <MessageCircle className="h-4 w-4" />
                        {post.comments} {t("community.comment")}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          toast.success(t("community.post_shared"));
                        }}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-brand-600"
                      >
                        <Share2 className="h-4 w-4" />
                        {t("community.share")}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
