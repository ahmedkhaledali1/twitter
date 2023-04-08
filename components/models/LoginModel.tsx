import useLoginModel from '@/hooks/useLoginModel';
import useRegisterModel from '@/hooks/useRegisterModel';

import { useState, useCallback } from 'react';
import Input from '../Input';
import Model from '../Model';
import { signIn } from 'next-auth/react';

const LoginModel = () => {
  const registerModel = useRegisterModel();
  const loginModel = useLoginModel();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onToggle = useCallback(() => {
    if (isLoading) {
      return;
    }
    registerModel.onOpen();
    loginModel.onClose();
  }, [isLoading, registerModel, loginModel]);

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true);

      await signIn('credentials', {
        email,
        password,
      });

      loginModel.onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [loginModel, email, password]);

  const bodyContent = (
    <div className=" flex flex-col gap-4">
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
        First time use Twitter?
        <span
          onClick={onToggle}
          className=" text-white cursor-pointer hover:underline"
        >
          Sign up
        </span>
      </p>
    </div>
  );

  return (
    <Model
      disabled={isLoading}
      isOpen={loginModel.isOpen}
      onClose={loginModel.onClose}
      onSubmit={onSubmit}
      title="Login"
      actionLabel="sign in"
      body={bodyContent}
      footer={footerContent}
    />
  );
};
export default LoginModel;
