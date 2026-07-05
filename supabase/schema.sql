-- 博客评论表 + RLS 策略
-- 在 Supabase Dashboard → SQL Editor 中执行一次即可

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_slug text not null,
  user_id uuid not null references auth.users (id) on delete cascade,
  author_email text not null,
  content text not null check (char_length(content) between 1 and 2000),
  created_at timestamptz not null default now()
);

create index if not exists comments_post_slug_idx
  on public.comments (post_slug, created_at);

alter table public.comments enable row level security;

-- 任何人可读评论
create policy "comments are readable by everyone"
  on public.comments for select
  using (true);

-- 登录用户只能以自己的身份发评论
create policy "authenticated users can insert own comments"
  on public.comments for insert
  to authenticated
  with check (auth.uid() = user_id);

-- 只能删除自己的评论
create policy "users can delete own comments"
  on public.comments for delete
  to authenticated
  using (auth.uid() = user_id);
