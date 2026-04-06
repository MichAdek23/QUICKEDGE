import { sendReply } from '../../actions';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const result = await sendReply(formData);
    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API reply error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
