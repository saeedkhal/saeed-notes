export const topicTagIds = ["frontend", "backend", "devops", "testing", "ai"] as const;

export type TopicTagId = (typeof topicTagIds)[number];

export const topicTagLabel: Record<TopicTagId, string> = {
  frontend: "Frontend",
  backend: "Backend",
  devops: "DevOps",
  testing: "Testing",
  ai: "AI",
};
