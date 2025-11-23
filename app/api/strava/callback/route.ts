import { NextRequest, NextResponse } from 'next/server';
import { exchangeStravaCode, findQualifyingActivity, generateZKProof } from '@/lib/vlayer-prover';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state'); // betId
  
  if (!code || !state) {
    return NextResponse.redirect(new URL('/?error=missing_params', request.url));
  }
  
  try {
    // Exchange code for access token
    const accessToken = await exchangeStravaCode(code);
    
    // Store access token temporarily (in production, use secure session)
    const response = NextResponse.redirect(
      new URL(`/prove?betId=${state}&token=${accessToken}`, request.url)
    );
    
    return response;
  } catch (error) {
    console.error('Strava OAuth error:', error);
    return NextResponse.redirect(new URL('/?error=strava_auth_failed', request.url));
  }
}
