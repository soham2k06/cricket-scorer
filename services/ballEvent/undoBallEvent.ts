import { axiosInstance } from "../axiosInstance";

export const undoBallEvent = async (matchId: string) => {
  try {
    const res = await axiosInstance.delete(`/ball-events/${matchId}/undo`);

    if (res.status !== 202) {
      throw new Error("Network response was not ok");
    }

    return res.data;
  } catch (error) {
    console.error("Error while undoing a event:", error);
    throw new Error((error as Error).message);
  }
};