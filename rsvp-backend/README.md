# RSVP endpoint

The RSVP form used to post to Formspree. Its free tier allows **50 submissions
a month across the whole account** and keeps **30 days of history** — past the
cap, submissions stop being accepted, and older replies drop off the dashboard.
Neither works for a wedding where cards go out months before the day.

This replaces it with a Google Apps Script bound to a Google Sheet. No
submission cap, no cost, and the replies live in a spreadsheet you own.

## Setup (about five minutes, once)

1. Create a new Google Sheet — name it something like *Wedding RSVPs*.
2. In that sheet: **Extensions → Apps Script**.
3. Delete the placeholder `myFunction` and paste in all of `Code.gs`.
4. If you want an email on each reply, set `NOTIFY_EMAIL` at the top of the
   file to your address. Leave it as `''` for none.
5. **Deploy → New deployment**, gear icon → **Web app**, then set:
   - *Execute as*: **Me**
   - *Who has access*: **Anyone**  ← must be "Anyone", not "Anyone with a
     Google account", or guests would be asked to sign in.
6. Authorise when prompted. Google shows an "unverified app" warning because
   the script is your own and unpublished — **Advanced → Go to (unsafe)** is the
   expected path here.
7. Copy the **Web app URL**. It looks like
   `https://script.google.com/macros/s/AKfy…/exec`.
8. Paste it into `RSVP_ENDPOINT` at the top of `src/components/RSVP.tsx`,
   then rebuild and redeploy the site.

Until that constant is filled in, the form keeps posting to Formspree, so
nothing breaks in the meantime.

## Checking it works

Open the Web app URL in a browser — it should print `{"ok":true,...}`. Then
submit the form on the site and confirm a row lands in the sheet.

## If you ever change the script

Apps Script keeps the old code live until you redeploy: **Deploy → Manage
deployments → edit → Version: New version**. Deploying a *new deployment*
instead gives you a different URL and the site would keep hitting the old one.
