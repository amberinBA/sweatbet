import axios from 'axios';

const VLAYER_API_KEY = process.env.NEXT_PUBLIC_VLAYER_API_KEY!;
const STRAVA_CLIENT_ID = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID!;
const STRAVA_CLIENT_SECRET = process.env.NEXT_PUBLIC_STRAVA_CLIENT_SECRET!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export interface StravaActivity {
  id: number;
  name: string;
  distance: number; // meters
  moving_time: number; // seconds
  elapsed_time: number;
  type: string; // "Run", "Ride", etc.
  start_date: string;
  start_date_local: string;
}

export interface ZKProof {
  proof: string;
  claim: {
    distance: number;
    activityType: string;
    date: string;
  };
}

/**
 * Step 1: Generate Strava OAuth URL
 */
export function getStravaAuthUrl(state?: string): string {
  const redirectUri = `${APP_URL}/api/strava/callback`;
  const scope = 'activity:read_all';
  
  const params = new URLSearchParams({
    client_id: STRAVA_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope,
    state: state || '',
  });
  
  return `https://www.strava.com/oauth/authorize?${params.toString()}`;
}

/**
 * Step 2: Exchange code for access token
 */
export async function exchangeStravaCode(code: string): Promise<string> {
  try {
    if (!STRAVA_CLIENT_SECRET) {
      throw new Error('STRAVA_CLIENT_SECRET is not configured');
    }

    console.log('Exchanging Strava code for token...', {
      client_id: STRAVA_CLIENT_ID,
      code: code.substring(0, 10) + '...',
    });

    const response = await axios.post(
      'https://www.strava.com/oauth/token',
      {
        client_id: STRAVA_CLIENT_ID,
        client_secret: STRAVA_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Strava token exchange successful');
    return response.data.access_token;
  } catch (error: any) {
    console.error('Error exchanging Strava code:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    if (error.response?.data?.message) {
      throw new Error(`Strava error: ${error.response.data.message}`);
    }

    throw new Error('Failed to authenticate with Strava. Please check your client secret.');
  }
}

/**
 * Step 3: Fetch recent activities from Strava
 */
export async function getRecentActivities(
  accessToken: string,
  after?: Date
): Promise<StravaActivity[]> {
  try {
    const params: any = {
      per_page: 30,
    };
    
    if (after) {
      params.after = Math.floor(after.getTime() / 1000);
    }
    
    const response = await axios.get('https://www.strava.com/api/v3/athlete/activities', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params,
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching Strava activities:', error);
    throw new Error('Failed to fetch activities from Strava');
  }
}

/**
 * Step 4: Generate ZK proof using VLayer TLSNotary
 */
export async function generateZKProof(
  accessToken: string,
  activityId: number
): Promise<ZKProof> {
  try {
    // Fetch specific activity details
    const activityResponse = await axios.get(
      `https://www.strava.com/api/v3/activities/${activityId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    
    const activity: StravaActivity = activityResponse.data;
    
    // Generate proof using VLayer
    const proofResponse = await axios.post(
      'https://prover.vlayer.xyz/prove',
      {
        url: `https://www.strava.com/api/v3/activities/${activityId}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        notarize: true,
        redact: {
          // Hide GPS data and personal info
          response: {
            exclude: [
              'map',
              'segment_efforts',
              'splits_metric',
              'splits_standard',
              'laps',
              'best_efforts',
              'photos',
              'athlete.id',
              'athlete.resource_state',
            ],
            include: [
              'distance',
              'moving_time',
              'type',
              'start_date',
              'start_date_local',
            ],
          },
        },
      },
      {
        headers: {
          'X-API-Key': VLAYER_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );
    
    const webProof = proofResponse.data.proof;
    
    // Compress the proof
    const compressResponse = await axios.post(
      'https://prover.vlayer.xyz/compress-web-proof',
      {
        webProof,
      },
      {
        headers: {
          'X-API-Key': VLAYER_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );
    
    const compressedProof = compressResponse.data.compressedProof;
    
    return {
      proof: compressedProof,
      claim: {
        distance: activity.distance,
        activityType: activity.type,
        date: activity.start_date,
      },
    };
  } catch (error) {
    console.error('Error generating ZK proof:', error);
    throw new Error('Failed to generate proof with VLayer');
  }
}

/**
 * Complete flow: OAuth -> Fetch Activities -> Generate Proof
 */
export async function completeProofFlow(
  code: string,
  activityId: number
): Promise<ZKProof> {
  // Step 1: Exchange code for token
  const accessToken = await exchangeStravaCode(code);
  
  // Step 2: Generate ZK proof
  const zkProof = await generateZKProof(accessToken, activityId);
  
  return zkProof;
}

/**
 * Find qualifying activity based on bet criteria
 */
export async function findQualifyingActivity(
  accessToken: string,
  targetDistance: number,
  deadline: Date,
  activityType?: string
): Promise<StravaActivity | null> {
  const activities = await getRecentActivities(accessToken, new Date(deadline.getTime() - 7 * 24 * 60 * 60 * 1000));
  
  // Find activities that meet criteria
  const qualifying = activities.filter((activity) => {
    const activityDate = new Date(activity.start_date);
    const meetsDistance = activity.distance >= targetDistance;
    const beforeDeadline = activityDate <= deadline;
    const correctType = !activityType || activity.type === activityType;
    
    return meetsDistance && beforeDeadline && correctType;
  });
  
  // Return most recent qualifying activity
  return qualifying.length > 0 ? qualifying[0] : null;
}
