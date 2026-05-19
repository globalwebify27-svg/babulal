import { NextResponse } from 'next/server';
import pool, { initDb } from '@/lib/db';

export async function GET() {
  try {
    await initDb();

    // Fetch counts in parallel for performance
    const [
      [totalLeadsRows],
      [totalProductsRows],
      [latestLeads]
    ]: any[] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM leads'),
      pool.query('SELECT COUNT(*) as count FROM products'),
      pool.query('SELECT * FROM leads ORDER BY createdAt DESC LIMIT 5')
    ]);

    const totalLeads = totalLeadsRows[0]?.count || 0;
    const totalProducts = totalProductsRows[0]?.count || 0;

    // Calculate monthly leads (leads from the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const [monthlyLeadsRows]: any = await pool.query(
      'SELECT COUNT(*) as count FROM leads WHERE createdAt >= ?',
      [thirtyDaysAgo]
    );
    const monthlyLeads = monthlyLeadsRows[0]?.count || 0;

    return NextResponse.json({
      stats: {
        totalLeads,
        totalProducts,
        monthlyLeads,
        totalCategories: 18, // Hardcoded for now as categories are static constants
        totalLocations: 2, // Ranchi & Chas
      },
      latestLeads
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
