import { NextResponse } from 'next/server';
import pool, { initDb } from '@/lib/db';
import bcrypt from 'bcryptjs';

/**
 * POST /api/auth/signup
 * Register a new admin/staff user.
 */
export async function POST(req: Request) {
  try {
    await initDb();
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, or password' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const [existingUsers]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user
    const [result]: any = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role || 'STAFF']
    );

    return NextResponse.json(
      { message: 'User created successfully', id: result.insertId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Signup Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
