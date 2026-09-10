import {canWrite} from './request-policy';
import {getChatGPTUser} from '../app/chatgpt-auth';
import {bindings} from './storage';
export async function isOwner(){const user=await getChatGPTUser();const owner=bindings().ADMIN_USER_ID;return !!owner&&user?.userId===owner;}
export async function authorizeWrite(request:Request){
 const user=await getChatGPTUser();
 if(!user)return Response.json({error:'Sign in to edit this site.'},{status:401});
 if(!bindings().ADMIN_USER_ID||user.userId!==bindings().ADMIN_USER_ID)return Response.json({error:'Only the site owner can edit content.'},{status:403});
 const origin=bindings().SITE_ORIGIN;
 if(!canWrite(user.userId,bindings().ADMIN_USER_ID,request.headers.get('origin'),origin))return Response.json({error:'Please save from the site editor.'},{status:403});
 return null;
}

