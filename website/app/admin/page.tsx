import {requireChatGPTUser} from '../chatgpt-auth';
import {isOwner} from '../../lib/owner';
import {readContent} from '../../lib/content';
import Editor from './editor';
export const dynamic='force-dynamic';
export const metadata={title:'Edit your site — Lukas Tadros',robots:{index:false,follow:false}};
export default async function Admin(){await requireChatGPTUser('/admin');if(!await isOwner())return <main className="page-title"><h1>Owner access only</h1><p>Sign in with the account that owns this site to edit it.</p><a href="/signout-with-chatgpt?return_to=/admin" target="_top" className="text-link">Use a different account</a></main>;const data=await readContent();return <main><Editor initialContent={data.content} initialRevision={data.revision}/></main>}
