import { useCallback, useMemo } from 'react';
import useCurrentUser from './useCurrentUser';
import useLoginModel from './useLoginModel';
import usePost from './usePost';
import usePosts from './usePosts';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const useLike = ({ postId, userId }: { postId: string; userId?: string }) => {
  const { data: currentUser } = useCurrentUser();
  const { data: fetchedPost, mutate: mutateFetchedPost } = usePost(postId);
  const { mutate: mutateFetchedPosts } = usePosts();
  const loginModel = useLoginModel();

  const hasLike = useMemo(() => {
    const list = fetchedPost?.likedIds || [];
    return list.includes(currentUser?.id);
  }, [currentUser?.id, fetchedPost?.likedIds]);

  const toggleLike = useCallback(async () => {
    if (!currentUser) {
      return loginModel.onOpen();
    }
    try {
      let request;

      if (hasLike) {
        request = () => axios.delete(`/api/like`, { data: { postId } });
      } else {
        request = () => axios.post(`/api/like`, { postId });
      }

      await request();
      mutateFetchedPost();
      mutateFetchedPosts();

      toast.success('Liked');
    } catch (error) {
      toast.error('Something went wrong');
    }
  }, [
    hasLike,
    currentUser,
    mutateFetchedPosts,
    mutateFetchedPost,
    loginModel,
    postId,
  ]);

  return {
    hasLike,
    toggleLike,
  };
};
export default useLike;
