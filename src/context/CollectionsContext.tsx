import { useContext, createContext, ReactNode } from "react";
import axios from "axios";
import { APP_API_URL } from "@/lib/APP_API_URL";
import handleError from "@/lib/handleError";
import { useAuth, useUser } from "@clerk/nextjs";
import { useToast } from "@/components/ui/use-toast";
// ? zustand
import selectedCollectionStore from "@/zustand/selectedCollection.store";
import loadingStore from "@/zustand/loading.store";
import notesCollectionsStore from "@/zustand/notesCollections.store";
import collectionApiStore from "@/zustand/collectionApi.store";
import { useRouter } from "next/router";
const CollectionContext = createContext<any>("");

export default function CollectionContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useUser();
  const { setLoading } = loadingStore((state) => state);
  const { collectionId, setCollectionId } = selectedCollectionStore(
    (state) => state
  );
  let { collectionApi, editCollectionApi } = collectionApiStore(
    (state) => state
  );
  const { toast } = useToast();
  const { notesCollections, editNotesCollections } = notesCollectionsStore(
    (state) => state
  );
  // ! handlers
  const getCollections = async () => {
    try {
      setLoading(true);
      const userRes = await axios.get(
        `${APP_API_URL}/api/users?clerkId=${user?.id}`
      );
      const collectionsRes = await axios.get(
        `${APP_API_URL}/api/notesCollections?userId=${userRes.data._id}`
      );
      editNotesCollections(collectionsRes.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };
  const handleSelectCollection = async (e) => {
    setCollectionId(e?._id);
  };
  const handleAddCollection = async (id, inputState) => {
    try {
      const res = await axios
        .post(`${APP_API_URL}/api/notesCollections`, {
          name: inputState,
          user: id,
        })
        .then(() =>
          toast({
            description: "New Collection was added Successfully",
            duration: 3000,
          })
        )
        .then(getCollections);
    } catch (error) {
      handleError(error);
    }
  };
  const handleCreateAccount = async (inputState) => {
    let isCollectionExist = notesCollections.filter(
      (e) => e.name == inputState
    ).length;
    try {
      if (isCollectionExist) {
        toast({
          variant: "destructive",
          description: "Collection Already exist !",
          duration: 3000,
        });
        return;
      }
      const res = await axios.get(
        `${APP_API_URL}/api/users?clerkId=${user?.id}`
      );
      await handleAddCollection(res.data._id, inputState);
    } catch (error: any) {
      if (error.response.status === 404) {
        try {
          const res = await axios.post(`${APP_API_URL}/api/users`, {
            clerkId: user?.id,
            notesCollections: [],
          });
          await handleAddCollection(res.data._id, inputState);
        } catch (err) {
          handleError(err);
        }
      } else {
        handleError(error);
      }
    }
  };
  const handleDeleteNoteCollection = async (collection) => {
    try {
      if (collection?._id == collectionId) {
        setCollectionId("");
      }
      setLoading(true);
      const res = await axios.delete(
        `${APP_API_URL}/api/notesCollections?collectionId=${collection?._id}`
      );
      toast({
        description: "Collection was deleted Successfully",
        duration: 3000,
      });
      await getCollections();
      await handleGetCollectionApi();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };
  const handleEditNotesCollection = async (collection, editValue) => {
    try {
      setLoading(true);
      const res = await axios.put(
        `${APP_API_URL}/api/notesCollections?collectionId=${collection?._id}`,
        {
          name: editValue,
        }
      );
      toast({
        description: "Collection was updated Successfully",
        duration: 3000,
      });
      await getCollections();
      await handleGetCollectionApi();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };
  // ;
  const handleGetCollectionApi = async () => {
    try {
      let res = await axios.get(
        `${APP_API_URL}/api/notesCollections?collectionId=${collectionId}`
      );
      editCollectionApi(res.data);
    } catch (error) {
      handleError(error);
      // editCollectionApi(null);
    }
  };

  // ! handlers
  return (
    <CollectionContext.Provider
      value={{
        getCollections,
        handleCreateAccount,
        handleDeleteNoteCollection,
        handleEditNotesCollection,
        handleSelectCollection,
        handleGetCollectionApi,
      }}
    >
      {children}
    </CollectionContext.Provider>
  );
}

export const useCollectionContext = () => useContext(CollectionContext);
