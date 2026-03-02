import { NextRequest, NextResponse } from 'next/server';
import { listTamu } from '@/lib/actions';
import { generateCSV, generateExcel } from '@/lib/export';

export async function GET(request: NextRequest) {
  // Check authentication via admin-session cookie
  const sessionCookie = request.cookies.get('admin-session');
  if (!sessionCookie || !sessionCookie.value || sessionCookie.value.trim() === '') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get query parameters
  const searchParams = request.nextUrl.searchParams;
  const jenisTamu = searchParams.get('jenis') as 'tamu' | 'pengunjung';
  const format = searchParams.get('format') as 'csv' | 'xlsx';
  const search = searchParams.get('search');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  // Validate required parameters
  if (!jenisTamu || !['tamu', 'pengunjung'].includes(jenisTamu)) {
    return NextResponse.json({ error: 'Invalid jenis parameter' }, { status: 400 });
  }

  if (!format || !['csv', 'xlsx'].includes(format)) {
    return NextResponse.json({ error: 'Invalid format parameter' }, { status: 400 });
  }

  // Fetch all matching records (large perPage)
  const result = await listTamu({
    jenis_tamu: jenisTamu,
    page: 1,
    perPage: 99999,
    search: search || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  // Generate filename
  const today = new Date().toISOString().split('T')[0];
  const filename = `daftar-tamu-${today}.${format}`;

  // Generate export
  if (format === 'csv') {
    const csv = generateCSV(result.data, jenisTamu);
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } else {
    const excelBuffer = generateExcel(result.data, jenisTamu);
    return new NextResponse(excelBuffer as any, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  }
}
