import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { email, source = 'website' } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
        const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

        if (!STRAPI_TOKEN) {
            console.error('STRAPI_API_TOKEN is missing');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const response = await fetch(`${STRAPI_URL}/api/subscribers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${STRAPI_TOKEN}`,
            },
            body: JSON.stringify({
                data: {
                    email,
                    source,
                    isActive: true,
                },
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            // Handle unique constraint error
            if (data.error?.message === 'This attribute must be unique') {
                return NextResponse.json({ message: 'You are already subscribed!' }, { status: 200 }); // Treat as success
            }
            return NextResponse.json({ error: data.error?.message || 'Failed to subscribe' }, { status: response.status });
        }

        return NextResponse.json({ message: 'Successfully subscribed!' }, { status: 201 });
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
