import useCurrentUser from '@/hooks/useCurrentUser';
import useEditModel from '@/hooks/useEditModel';
import useUser from '@/hooks/useUser';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import Model from '../Model';
import Input from '../Input';
import ImageUpload from '../ImageUpload';

const EditModel = () => {
  const { data: currentUser } = useCurrentUser();
  const { mutate: mutateFetchedUser } = useUser(currentUser?.id);

  const EditModel = useEditModel();

  const [profileImage, setProfileImage] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    setProfileImage(currentUser?.profileImage);
    setCoverImage(currentUser?.coverImage);
    setName(currentUser?.name);
    setUsername(currentUser?.username);
    setBio(currentUser?.bio);
  }, [currentUser]);

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true);

      await axios.patch('/api/edit', {
        name,
        username,
        bio,
        coverImage,
        profileImage,
      });
      mutateFetchedUser();
      toast.success('updated');

      EditModel.onClose();
    } catch (error) {
      console.log(error);
      toast.error('something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, [
    name,
    username,
    bio,
    coverImage,
    profileImage,
    EditModel,
    mutateFetchedUser,
  ]);

  const bodyContent = (
    <div className=" felx flex-col gap-4">
      <ImageUpload
        disabled={isLoading}
        value={profileImage}
        onChange={(image) => setProfileImage(image)}
        label="Upload Profile Image"
      />
      <ImageUpload
        disabled={isLoading}
        value={coverImage}
        onChange={(coverImage) => setCoverImage(coverImage)}
        label="Upload Cover Image"
      />
      <Input
        disabled={isLoading}
        onChange={(e) => setName(e.target.value)}
        value={name}
        placeholder="Name"
        type="text"
      />
      <Input
        disabled={isLoading}
        onChange={(e) => setUsername(e.target.value)}
        value={username}
        placeholder="Username"
        type="text"
      />
      <Input
        disabled={isLoading}
        onChange={(e) => setBio(e.target.value)}
        value={bio}
        placeholder="Bio"
        type="text"
      />
    </div>
  );

  return (
    <Model
      disabled={isLoading}
      isOpen={EditModel.isOpen}
      onClose={EditModel.onClose}
      title="Edit"
      actionLabel="save"
      onSubmit={onSubmit}
      body={bodyContent}
    />
  );
};

export default EditModel;
