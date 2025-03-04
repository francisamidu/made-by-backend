export interface CreateCommentBody {
  creatorId: string;
  projectId: string;
  content: string;
}

export interface UpdateCommentBody {
  content: string;
}
