import { apiClient } from '@/api/v1/apiClients';

export const getAllGames = async () => {
  const response = await apiClient.get("/director/req");
  return response.data;
}