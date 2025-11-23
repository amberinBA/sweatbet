import axios from 'axios';

const NEYNAR_API_KEY = process.env.NEXT_PUBLIC_NEYNAR_API_KEY!;
const NEYNAR_BASE_URL = 'https://api.neynar.com/v2';

export interface FarcasterUser {
  fid: number;
  username: string;
  display_name: string;
  custody_address: string;
  verified_addresses: {
    eth_addresses: string[];
    sol_addresses: string[];
  };
  profile: {
    bio: {
      text: string;
    };
  };
  pfp_url: string;
}

/**
 * Resolve Farcaster usernames to Ethereum addresses
 */
export async function resolveUsernames(usernames: string[]): Promise<Map<string, string>> {
  try {
    const response = await axios.get(`${NEYNAR_BASE_URL}/farcaster/user/bulk-by-username`, {
      headers: {
        'api_key': NEYNAR_API_KEY,
      },
      params: {
        usernames: usernames.join(','),
      },
    });
    
    const users: FarcasterUser[] = response.data.users;
    const addressMap = new Map<string, string>();
    
    users.forEach((user) => {
      // Prefer verified addresses, fallback to custody address
      const address = user.verified_addresses.eth_addresses[0] || user.custody_address;
      addressMap.set(user.username, address);
    });
    
    return addressMap;
  } catch (error) {
    console.error('Error resolving usernames:', error);
    throw new Error('Failed to resolve Farcaster usernames');
  }
}

/**
 * Get user by FID
 */
export async function getUserByFid(fid: number): Promise<FarcasterUser> {
  try {
    const response = await axios.get(`${NEYNAR_BASE_URL}/farcaster/user/bulk`, {
      headers: {
        'api_key': NEYNAR_API_KEY,
      },
      params: {
        fids: fid,
      },
    });
    
    return response.data.users[0];
  } catch (error) {
    console.error('Error fetching user by FID:', error);
    throw new Error('Failed to fetch Farcaster user');
  }
}

/**
 * Get user by Ethereum address
 */
export async function getUserByAddress(address: string): Promise<FarcasterUser | null> {
  try {
    const response = await axios.get(`${NEYNAR_BASE_URL}/farcaster/user/bulk-by-address`, {
      headers: {
        'api_key': NEYNAR_API_KEY,
      },
      params: {
        addresses: address,
      },
    });
    
    const users = response.data[address];
    return users && users.length > 0 ? users[0] : null;
  } catch (error) {
    console.error('Error fetching user by address:', error);
    return null;
  }
}

/**
 * Publish cast to Farcaster
 */
export async function publishCast(
  signerUuid: string,
  text: string,
  embeds?: string[]
): Promise<any> {
  try {
    const response = await axios.post(
      `${NEYNAR_BASE_URL}/farcaster/cast`,
      {
        signer_uuid: signerUuid,
        text,
        embeds: embeds || [],
      },
      {
        headers: {
          'api_key': NEYNAR_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Error publishing cast:', error);
    throw new Error('Failed to publish cast to Farcaster');
  }
}
