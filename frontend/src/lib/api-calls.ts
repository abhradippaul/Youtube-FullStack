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
  body: { title: string; categoryId?: string | null; visibility: boolean }
) {
  return await axios.post(
    `http://${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/studio/video/${videoId}`,
    body,
    {
      params: {
        sessionId,
      },
    }
  );
}
