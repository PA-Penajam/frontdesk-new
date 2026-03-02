import { NextRequest, NextResponse } from 'next/server';
import { getMonthlyStats } from '@/lib/actions';
import { generateMonthlyPDF, generateMonthlyExcel } from '@/lib/reports';

// Indonesian month names
const monthNames = [
  '', // index 0 unused
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember'
];

export async function GET(request: NextRequest) {
  try {
    // Check admin session
    const adminSession = request.cookies.get('admin-session');
    if (!adminSession || !adminSession.value || adminSession.value.trim() === '') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const month = parseInt(searchParams.get('month') || '');
    const year = parseInt(searchParams.get('year') || '');
    const format = searchParams.get('format') || 'pdf';

    // Validate parameters
    if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
      return NextResponse.json({ error: 'Invalid month or year' }, { status: 400 });
    }

    // Get monthly stats
    const stats = await getMonthlyStats(year, month);

    // Generate report
    if (format === 'pdf') {
      const pdf = await generateMonthlyPDF(stats, month, year);
      const monthName = monthNames[month];
      const filename = `laporan-buku-tamu-${monthName.toLowerCase()}-${year}.pdf`;
      
      return new NextResponse(Buffer.from(pdf), {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${filename}"`
        }
      });
    } else if (format === 'xlsx') {
      const excel = await generateMonthlyExcel(stats, month, year);
      const monthName = monthNames[month];
      const filename = `laporan-buku-tamu-${monthName.toLowerCase()}-${year}.xlsx`;
      
      return new NextResponse(Buffer.from(excel), {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="${filename}"`
        }
      });
    } else {
      return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}