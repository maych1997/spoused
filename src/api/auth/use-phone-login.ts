import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';

type Variables = { phone: string; };
type Response = { statusCode: number; message: string; };

export const usePhoneLogin = createMutation<Response, Variables, AxiosError>({
  mutationFn: async (variables) =>
    client({
      url: 'auth/phone-login',
      method: 'POST',
      data: variables,
    }).then((response) => response.data),
});
