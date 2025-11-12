import { apiClient } from "@/api/apiClients";
import { LaneDetailType } from "@/types/lanes";

export const getLanes = async (lane_num: number) => {
  try {
    const response = await apiClient.get(`/judge/all_req?lane_num=${lane_num}`);
    return response.data;
  }
  catch (error) {
    console.error("Error fetching lanes:", error);
    throw error;
  }
}

export const submitResult = async (playdata_id: string, record: number, dq: string) => {
  try {
    const response = await apiClient.post('/judge/register', {
      id: playdata_id,
      record: record,
      dq: dq
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting result:", error);
    throw error;
  }
}

export const getNowPlay = async (lane: number) => {
  try {
    const response = await apiClient.post("/judge/now_play", {
      lane: lane
    });
    return response.data as {code: number; id: number; play_num: number};
  } catch (error) {
    console.error("Error fetching now play:", error);
  }
}

export const getLaneDetail = async (playdata_id: string) => {
  try {
    const response = await apiClient.get(`/judge/req?playdata_id=${playdata_id}`);
    return response.data as LaneDetailType;
  }
  catch (error) {
    console.error("Error fetching lane detail:", error);
    throw error;
  }
}