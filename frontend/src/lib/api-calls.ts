import { StudioVideoResponseSchema } from "@/modules/studio/ui/sections/form-section";
import axios from "axios";

export async function getStudioVideos(
  sessionId: string,
  pageParam: number,
  limit: number
): Promise<{
  data: {
    items: {
      id: string;
      muxPlaybackId?: string | null;
      duration: number;
      title: string;
      description: string | null;
      muxStatus: string;
      createdAt: Date;
      visibility: string;
    }[];
    nextCursor: number | null;
  };
}> {
  return await axios.get(
    `http://${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/studio/videos`,
    {
      params: {
        sessionId,
        pageParam,
        limit,
      },
    }
  );
}

export async function getMuxUploadUrl(sessionId: string): Promise<{
  data: {
    msg: string;
    upload_url: string;
    upload_id: string;
  };
}> {
  return await axios.get(
    `http://${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/video/mux-uploadurl`,
    {
      params: {
        sessionId,
      },
    }
  );
}

export async function createVideo(
  sessionId: string,
  body: { title: string; description: string; uploadId: string }
) {
  return await axios.post(
    `http://${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/video`,
    body,
    {
      params: {
        sessionId,
      },
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export async function getStudioVideo(
  sessionId: string,
  videoId: string
): Promise<{
  data: {
    video: StudioVideoResponseSchema[];
    msg: string;
  };
}> {
  return await axios.get(
    `http://${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/studio/video/${videoId}`,
    {
      params: {
        sessionId,
      },
    }
  );
}

export async function getCategoriesList(sessionId: string): Promise<{
  data: {
    msg: string;
    categoryList: { id: string; name: string }[];
  };
}> {
  return await axios.get(
    `http://${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/category`,
    {
      params: {
        sessionId,
      },
    }
  );
}

export async function updateUserStudioVideo(
  sessionId: string,
  videoId: string,
  body: { title: string; categoryId?: string | null; visibility: string }
) {
  return await axios.patch(
    `http://${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/studio/video/${videoId}`,
    body,
    {
      params: {
        sessionId,
      },
    }
  );
}

export async function deleteUserStudioVideo(
  sessionId: string,
  videoId: string
) {
  return await axios.delete(
    `http://${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/studio/video/${videoId}`,
    {
      params: {
        sessionId,
      },
    }
  );
}

export interface GetVideoOwnerInfo {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  clerkId: string;
  subscriberCount: number;
  isSubscribed: boolean;
}

export interface GetVideoInfo {
  id: string;
  title: string;
  descriptions: string;
  viewCount: number;
  likeCount: number;
  disLikeCount: number;
  videoReaction?: string;
  muxStatus: string;
  muxPlaybackId?: string | undefined;
  owner: GetVideoOwnerInfo;
  createdAt: string;
}

export interface GetVideoResponse {
  data: {
    msg: string;
    videoInfo?: GetVideoInfo[] | undefined;
  };
}

export async function getVideo(videoId: string): Promise<GetVideoResponse> {
  return await axios.get(
    `http://${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/video/${videoId}`
  );
}

export async function createVideoView(sessionId: string, videoId: string) {
  return await axios.get(
    `http://${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/view/${videoId}`,
    {
      params: sessionId,
    }
  );
}

export async function toggleLikeVideoReaction(
  sessionId: string,
  videoId: string
) {
  return await axios.post(
    `http://${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reaction/like/${videoId}`,
    "",
    {
      params: sessionId,
    }
  );
}

export async function toggleDislikeVideoReaction(
  sessionId: string,
  videoId: string
) {
  return await axios.post(
    `http://${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reaction/dislike/${videoId}`,
    "",
    {
      params: sessionId,
    }
  );
}

export async function addToSubscribeList(sessionId: string, userId: string) {
  return await axios.post(
    `http://${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/subscription/${userId}`,
    "",
    {
      params: sessionId,
    }
  );
}

export async function removeFromSubscribeList(
  sessionId: string,
  userId: string
) {
  return await axios.delete(
    `http://${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/subscription/${userId}`,
    {
      params: sessionId,
    }
  );
}
