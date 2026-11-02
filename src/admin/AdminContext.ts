import { createContext,useContext } from 'react';
import type { GithubAdmin } from './githubClient';
export const AdminClientContext=createContext<GithubAdmin|null>(null);
export function useAdminClient(){
 const client=useContext(AdminClientContext);
 if(!client)throw Error('يرجى الدخول بحساب الإدارة أولاً');
 return client;
}
