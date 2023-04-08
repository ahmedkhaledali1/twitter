import useCurrentUser from '@/hooks/useCurrentUser';
import useLoginModel from '@/hooks/useLoginModel';
import { formatDistanceToNowStrict } from 'date-fns';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo } from 'react';
import Avatar from '../Avatar';
import { AiOutlineHeart, AiFillHeart, AiOutlineMessage } from 'react-icons/ai';
import useLike from '@/hooks/useLike';
interface PostFeedProps {
  userId?: string;
  data: Record<string, any>;
}

const PostItem: React.FC<PostFeedProps> = ({ userId, data }) => {
  const router = useRouter();

  const loginModel = useLoginModel();

  const { data: currentUser } = useCurrentUser();

  const { hasLike, toggleLike } = useLike({ postId: data.id, userId });

  const goToUser = useCallback(
    (event: any) => {
      event.stopPropagation();

      router.push(`/users/${data.user.id}`);
    },
    [router, data.user.id]
  );

  const goToPost = useCallback(
    (event: any) => {
      event.stopPropagation();

      router.push(`/posts/${data.id}`);
    },
    [router, data.id]
  );

  const onLike = useCallback(
    (event: any) => {
      event.stopPropagation();

      if (!currentUser) {
        return loginModel.onOpen();
      }

      toggleLike();
    },
    [loginModel, currentUser, toggleLike]
  );

  const creataedAt = useMemo(() => {
    if (!data?.createdAt) {
      return null;
    }

    return formatDistanceToNowStrict(new Date(data.createdAt));
  }, [data?.createdAt]);

  const LikeIcon = hasLike ? AiFillHeart : AiOutlineHeart;

  return (
    <div
      onClick={goToPost}
      className="border-b-[1px]
    border-neutral-800
    p-5
    cursor-pointer
    hover:bg-neutral-900
    transition
    "
    >
      <div className=" flex flex-row items-start gap-4">
        <Avatar userId={data.user.id} />
        <div>
          <div className="flex flex-row items-center gap-2">
            <p
              onClick={goToUser}
              className="text-white font-semibold cursor-pointer hover:underline pb-0"
            >
              {data.user.name}
            </p>
            <span
              onClick={goToUser}
              className="text-neutral-500 cursor-pointer hover:underline pt-0 hidden md:block"
            >
              @{data.user.username}
            </span>
            <span className="text-neutral-500 text-5m hidden md:block">
              {creataedAt}
            </span>
          </div>
          <div className="text-white mt-1">{data.body}</div>
          <div className="flex flex-row items-center mt-3 gap-10">
            <div
              onClick={goToPost}
              className="flex flex-row items-center text-neutral-500 gap-2 cursor-pointer transition hover:text-sky-500"
            >
              <AiOutlineMessage size={20} />
              <p>{data.comments?.length || 0}</p>
            </div>
            <div
              onClick={onLike}
              className={`
              flex flex-row 
              items-center 
              text-neutral-500 
              gap-2 
              cursor-pointer 
              transition 
              hover:text-red-500`}
            >
              <LikeIcon size={20} color={hasLike ? 'red' : ''} />
              <p>{data.likedIds?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PostItem;
