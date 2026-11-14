// Tells Bing, Yandex, Seznam and Naver (via IndexNow) that pages changed, so they recrawl quickly.
// Run after each deploy:  npm run indexnow
// The key file public/8549940a956a6582d4a6749139477962.txt must stay published at the site root.
const HOST = 'euphoria.events';
const KEY = '8549940a956a6582d4a6749139477962';
const PAGES = ['', '360-photo-booth-lagos', 'magic-mirror-photo-booth-lagos', 'audio-guestbook-lagos', 'event-videography-lagos', 'photo-booth-rental-lagos'];

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList: PAGES.map(p => `https://${HOST}/${p}`),
  }),
});
console.log('IndexNow:', res.status, res.status === 200 || res.status === 202 ? 'accepted' : await res.text());
