export type Question = {
  id: string;
  title: string;
  body: string;
  created_at: string;
  like_count: number;
  is_liked: boolean;
  images?: string[];
  answers_count: number;
};

export type Answer = {
  id: string;
  body: string;
  created_at: string;
  user_id?: string;
  user_name?: string;
  admin_id?: string;
  upvotes_count: number;
  is_accepted: boolean;
  user_vote: -1 | 0 | 1; // -1 = downvoted, 0 = no vote, 1 = upvoted
};