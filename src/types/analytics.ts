export interface TimeMetrics {
  date: Date;
  views: number;
  likes: number;
}

export interface PlatformMetrics {
  engagement: {
    totalViews: number;
    totalLikes: number;
    totalFollows: number;
  };
  platform: {
    totalCreators: number;
    totalProjects: number;
  };
}
