import useCurrentUser from '@/hooks/useCurrentUser';
import useNotifications from '@/hooks/useNotifications';
import { useEffect } from 'react';
import { BsTwitter } from 'react-icons/bs';

const NotificationsFeed = () => {
  const { data: currentUser, mutate: mutateCurrnetUser } = useCurrentUser();
  const { data: fetchedNotifications = [] } = useNotifications(currentUser?.id);

  useEffect(() => {
    mutateCurrnetUser();
  }, [mutateCurrnetUser]);

  if (fetchedNotifications.length === 0) {
    return (
      <div className="text-neutral-600 text-center p-6 text-xl">
        No notifications
      </div>
    );
  }
  return (
    <div className="flex flex-col ">
      {fetchedNotifications.map((notification: Record<string, any>) => (
        <div
          key={notification.id}
          className="
          flex
          flex-row
          items-center
          p-6
          border-b-[1px]
          border-neutral-800
          "
        >
          <BsTwitter size={32} color="white" />
          <p className="text-white">{notification.body}</p>
        </div>
      ))}
    </div>
  );
};
export default NotificationsFeed;
