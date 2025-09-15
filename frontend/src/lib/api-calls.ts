import axios from "axios";

export async function getStudioVideos(
  sessionId: string,
  pageParam: number,
  limit: number
): Promise<{
  data: { items: { id: string; name: string }[]; nextCursor: number | null };
}> {
  return await axios.get(
    `http://${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/studio/videos?sessionId=${sessionId}&pageParam=${pageParam}&limit=${limit}`
  );
}

export async function getMuxUploadUrl(sessionId: string): Promise<{
  data: {
    msg: string;
    upload_url: string;
    upload_id: string;
  };
}> {
  console.log("Calling mux api");
  return await axios.get(
    `http://${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/video/mux-uploadurl?sessionId=${sessionId}`
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
