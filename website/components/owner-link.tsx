
import {isOwner} from '../lib/owner';
export default async function OwnerLink(){return await isOwner()?<a className="owner-link" href="/admin">Edit site</a>:null;}

