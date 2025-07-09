// app/api/create-repo/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function POST(req: NextRequest) {
    const token = await getToken({ req });
    if (!token || !token.accessToken) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    try {
        const res = await fetch('https://api.github.com/user/repos', {
            method: 'POST',
            headers: {
                Authorization: `token ${token.accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: body.name,
                description: body.description,
                private: body.private,
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json({ message: data.message }, { status: res.status });
        }

        return NextResponse.json(data);
    } catch (err : unknown) {
        return NextResponse.json({ message: err }, { status: 500 });
    }
}
