import { serverQueryContent } from "#content/server";

export default defineEventHandler(async (event) => {
  const [projects, posts] = await Promise.all([serverQueryContent(event, "projects").find(), serverQueryContent(event, "blog").find()]);

  return [...projects.map((p) => ({ loc: `/projects/${p.slug}` })), ...posts.map((p) => ({ loc: `/blog/${p.slug}` }))];
});
