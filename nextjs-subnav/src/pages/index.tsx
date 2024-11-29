import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import qs from 'qs'
import { verifyHash } from '@/utils/verifyHash';
import { AdminUserApi} from '@kibocommerce/rest-sdk/clients/AdminUser'
import {Configuration} from '@kibocommerce/rest-sdk'
// Define the props for the Home component
interface HomeProps {
  userName?: string;
  roles?:string;
}

interface SubnavQuery {
  dt?:string,
  messageHash?:string
}

interface SubnavRequestData {
  'x-vol-return-url': string,
  'x-vol-tenant': string,
  userId: string,
  'x-vol-master-catalog': string,
  'x-vol-site'?:string
}

export default function Home({ userName, roles }: HomeProps) {
  return (
    <div>
      <div>Hello {userName}!</div>
      <div>You have the following roles: {roles} </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async (context: GetServerSidePropsContext) => {
  const { req, res, query} = context;

  // Only process if it's a POST request
  if (req.method === 'POST') {
    // Parse the request body
    const body = await new Promise<string>((resolve, reject) => {
      let data = '';
      req.on('data', chunk => {
        data += chunk;
      });
      req.on('end', () => {
        try {
          resolve(decodeURIComponent(data));
        } catch (error) {
          reject(error);
        }
      });
    });

    const subnavPOSTData:SubnavRequestData = qs.parse(body) as unknown as SubnavRequestData

    const {dt = '', messageHash = ''}:SubnavQuery = query

    const isValidHash = verifyHash(messageHash, dt, body)

    if(isValidHash){
      const {userId} = subnavPOSTData

      const adminUserResource = new AdminUserApi(Configuration.fromEnv())

      try{
        const adminUser = await adminUserResource.getUserById({userId})
        const adminUserRoles = await adminUserResource.getUserRoles({userId})

        return {
          props:{
            userName: `${adminUser.firstName} ${adminUser.lastName}`,
            roles: adminUserRoles?.items?.map(i => i.roleName).join(',') || ''
          }
        }
      }catch(e){
        console.error(`Failed to fetch user and roles. ${e}`)
        res.writeHead(500).end('Server Error')
      }

    } else {
      if (res) {
        res.writeHead(400, {
          'Content-Type': 'text/plain'
        });
        res.end('DENIED');
      }
    }

  } else {
    res.writeHead(405, {
      'Allow': 'POST',
      'Content-Type': 'text/plain'
    });
    res.end(`Method ${req.method} Not Allowed`);
  }


  return {
    props: {}
  };
}