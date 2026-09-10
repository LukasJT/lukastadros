import Link from 'next/link';
import {isOwner} from '../lib/owner';
export default async function OwnerLink(){return await isOwner()?<Link className="owner-link" href="/admin">Edit site</Link>:null;}
