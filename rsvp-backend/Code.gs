/**
 * RSVP endpoint — Google Apps Script, backed by a Google Sheet.
 *
 * Replaces Formspree, whose free tier caps at 50 submissions a month across
 * the whole account and keeps only 30 days of history. This has no submission
 * cap, costs nothing, and the responses live in a spreadsheet you own for as
 * long as you want them.
 *
 * Setup is in README.md next to this file.
 */

// The tab the responses are written to. Created automatically if missing.
const SHEET_NAME = 'RSVPs';

// Optional: get an email the moment someone replies, the way Formspree did.
// Leave as '' for no email. Apps Script allows 100 emails/day on a free
// account, which is far more headroom than the wedding needs.
const NOTIFY_EMAIL = 'nbabhisreekumar@gmail.com';

const HEADERS = [
  'Received',
  'Name',
  'Attending',
  'Guests',
  'Events attending',
  'Message',
];

function doPost(e) {
  // Two people can submit in the same second; without the lock they can be
  // handed the same row and one reply overwrites the other.
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const data = JSON.parse(e.postData.contents);
    const row = [
      new Date(),
      String(data.name || '').slice(0, 200),
      String(data.attending || ''),
      data.guests || '',
      String(data.events_attending || ''),
      String(data.message || '').slice(0, 2000),
    ];

    getSheet_().appendRow(row);
    if (NOTIFY_EMAIL) notify_(row);

    return json_({ ok: true });
  } catch (err) {
    // Logged to the Apps Script execution log, so a malformed submission can
    // be traced rather than silently vanishing.
    console.error(err);
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** A GET is handy for checking the deployment is live from a browser. */
function doGet() {
  return json_({ ok: true, service: 'rsvp' });
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function notify_(row) {
  const [, name, attending, guests, events, message] = row;
  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: `RSVP — ${name} (${attending})`,
    body: [
      `Name:     ${name}`,
      `Coming:   ${attending}`,
      `Guests:   ${guests}`,
      `Events:   ${events}`,
      '',
      message ? `Message:\n${message}` : '(no message)',
    ].join('\n'),
  });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
