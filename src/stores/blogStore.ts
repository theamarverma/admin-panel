import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { v4 as uuidv4 } from "uuid";

export interface Blog {
  id?: string;
  title: string;
  date: string;
  image: string;
  content: { text: string; image?: string }[];
}

interface BlogStore {
  blogs: Blog[];
  addBlog: (blog: Blog) => void;
  updateBlog: (blog: Blog) => void;
  deleteBlog: (id: string | undefined) => void;
}

const useBlogStore = create<BlogStore>()(
  persist(
    immer((set) => ({
      blogs: [],
      addBlog: (blog) => {
        set((state) => {
          state.blogs.push({ ...blog, id: uuidv4() });
        });
      },
      updateBlog: (updatedBlog) => {
        set((state) => {
          const index = state.blogs.findIndex((b) => b.id === updatedBlog.id);
          if (index !== -1) {
            state.blogs[index] = updatedBlog;
          }
        });
      },
      deleteBlog: (id) => {
        set((state) => {
          state.blogs = state.blogs.filter((blog) => blog.id !== id);
        });
      },
    })),
    {
      name: "blog-store",
    },
  ),
);

export default useBlogStore;
