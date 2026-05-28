import { BlogComment } from "@/lib/actions";
import { useState } from "react";



interface BlogCommentsProps {
  comments: BlogComment[];
  onAddComment?: (comment: Omit<BlogComment, "id" | "date">) => void;
}

export function BlogComments({ comments, onAddComment }: BlogCommentsProps) {
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;
    onAddComment?.({ author, content });
    setAuthor("");
    setContent("");
  }

  return (
    <section className="mt-10">
      <h3 className="font-bold text-lg mb-4 text-[#670626]">نظرات</h3>
      <form onSubmit={handleSubmit} className="mb-6 flex flex-col gap-2">
        <input
          className="border rounded px-3 py-2 text-sm"
          placeholder="نام شما"
          value={author}
          onChange={e => setAuthor(e.target.value)}
        />
        <textarea
          className="border rounded px-3 py-2 text-sm"
          placeholder="نظر شما..."
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={3}
        />
        <button
          type="submit"
          className="bg-[#670626] text-white rounded px-4 py-2 mt-2 self-end hover:bg-[#8B1A3C]"
        >
          ارسال نظر
        </button>
      </form>
      <div className="space-y-4">
        {comments.length === 0 && (
          <div className="text-gray-400 text-center">نظری ثبت نشده است.</div>
        )}
        {comments.map((comment) => (
          <div key={comment.id} className="border rounded p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-[#670626] text-sm">{comment.author}</span>
              <span className="text-xs text-gray-400">{comment.date}</span>
            </div>
            <p className="text-gray-700 text-sm leading-6">{comment.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
