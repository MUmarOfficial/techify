export * from "./routes";
export * from "./categories";
export * from "./roles";

export const MEDIA_LIMITS = {
  THUMBNAIL_MAX_SIZE: 50 * 1024 * 1024, // 50MB
  VIDEO_MAX_SIZE: 500 * 1024 * 1024, // 500MB
  AVATAR_MAX_SIZE: 1 * 1024 * 1024, // 1MB
};
