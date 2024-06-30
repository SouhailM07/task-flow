import axios from "axios";
import { APP_API_URL } from "./APP_API_URL";
import handleError from "@/lib/handleError";
export async function getCollections({ setLoading, user }) {
  try {
    setLoading(true);
    const userRes = await axios.get(
      `${APP_API_URL}/api/users?clerkId=${user?.id}`
    );
    const collectionsRes = await axios.get(
      `${APP_API_URL}/api/notesCollections?userId=${userRes.data._id}`
    );
    return collectionsRes.data;
  } catch (error) {
    handleError(error);
  } finally {
    setLoading(false);
  }
}
