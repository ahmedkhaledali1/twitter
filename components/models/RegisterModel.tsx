import useLoginModel from '@/hooks/useLoginModel';
import useRegisterModel from '@/hooks/useRegisterModel';
import axios from 'axios';
import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { signIn } from 'next-auth/react';
import Input from '../Input';
import Model from '../Model';

const RegisterModel = () => {
  const LoginModel = useLoginModel();
  const registerModel = useRegisterModel();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onToggle = useCallback(() => {
    if (isLoading) {
      return;
    }
    registerModel.onClose();
    LoginModel.onOpen();
  }, [isLoading, registerModel, LoginModel]);

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true);

      await axios.post('/api/register', {
        email,
        username,
        name,
        password,
      });

      toast.success('Account created.');
      signIn('credentials', {
        email,
        password,
      });

      registerModel.onClose();
    } catch (error) {
      console.log(error);
      toast.error('something is wrong');
    } finally {
      setIsLoading(false);
    }
  }, [registerModel, email, password, name, username]);

  const bodyContent = (
    <div className=" flex flex-col gap-4">
      <Input
        placeholder="name"
        value={name}
        type="text"
        onChange={(e) => setName(e.target.value)}
        disabled={isLoading}
      />
      <Input
        placeholder="usename"
        value={username}
        type="text"
        onChange={(e) => setUsername(e.target.value)}
        disabled={isLoading}
      />
      <Input
        placeholder="Email"
        value={email}
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
      />
      <Input
        placeholder="Password"
        value={password}
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        disabled={isLoading}
      />
    </div>
  );

  const footerContent = (
    <div className="text-neutral-400 text-center mt-4">
      <p>
        Already have an account?
        <span
          onClick={onToggle}
          className=" text-white cursor-pointer hover:underline"
        >
          Sign in
        </span>
      </p>
    </div>
  );

  return (
    <Model
      disabled={isLoading}
      isOpen={registerModel.isOpen}
      onClose={registerModel.onClose}
      onSubmit={onSubmit}
      title=" create an acount"
      actionLabel="sign up"
      body={bodyContent}
      footer={footerContent}
    />
  );
};
export default RegisterModel;
