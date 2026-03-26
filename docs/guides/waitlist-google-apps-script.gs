const SHEET_NAME = 'Waitlist';

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || '{}');
    const sheet = getOrCreateSheet_();

    sheet.appendRow([
      new Date(),
      payload.email || '',
      payload.organization || '',
      payload.source || 'murmura-landing-page',
      payload.submittedAt || '',
      payload.status || 'submitted',
      payload.message || ''
    ]);

    return jsonResponse_({
      ok: true
    });
  } catch (error) {
    return jsonResponse_(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      500
    );
  }
}

function doGet() {
  return jsonResponse_({
    ok: true,
    service: 'murmura-waitlist'
  });
}

function getOrCreateSheet_() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const existing = spreadsheet.getSheetByName(SHEET_NAME);

  if (existing) {
    return existing;
  }

  const sheet = spreadsheet.insertSheet(SHEET_NAME);
  sheet.appendRow([
    'created_at',
    'email',
    'organization',
    'source',
    'submitted_at',
    'status',
    'message'
  ]);
  return sheet;
}

function jsonResponse_(payload, statusCode) {
  const output = ContentService.createTextOutput(JSON.stringify(payload));
  output.setMimeType(ContentService.MimeType.JSON);

  if (statusCode) {
    output.setHeader('X-Status-Code', String(statusCode));
  }

  return output;
}
