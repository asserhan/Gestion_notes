import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const isLogin = formData.get('isLogin') === 'true';

    let response;
    if (isLogin) {
      const loginFormData = new FormData();
      loginFormData.append('username', email);
      loginFormData.append('password', password);

      response = await fetch('http://127.0.0.1:8000/api/auth/login', {
        method: 'POST',
        body: loginFormData,
      });
    } else {
      response = await fetch('http://127.0.0.1:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
    }

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.detail || 'Authentication failed' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 