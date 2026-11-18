# DJ Bingo

A free DJ music bingo game for family nights. It runs entirely in the browser, with no server, no accounts and no cost.

QR codes are made with qrcode-generator by Kazuhiko Arase (MIT license). The fonts are Monoton and Bebas Neue from Google Fonts.

## How a game works
1. **Host:** open `host.html` on a laptop and cast the Chrome tab to the TV (menu, then Cast, then Cast tab) so the sound comes through the TV too. A phone with a Bluetooth speaker also works. Pick how many rounds (1 to 6), then a category and a win pattern for each, then press **Start game**.
   - Patterns: one line across, two lines across, a V, an H, four corners, an X, a cross (plus sign) or a full card. The default is Random, which gives each round a different shape.
   - The TV shows the round, the category and a picture of the shape to win.
2. **Players:** scan the QR code on the TV with a phone camera to open a card, with no typing needed. Anyone can also go to the site and type the game code, e.g. `TLNVAHDF-K7Q`.
   - Each phone gets one card number with a 3x5 B-I-N-G-O grid for each round, plus that round's winning shape.
   - The phone remembers its card if the page is refreshed.
   - The card glows when a player is one away, and the BINGO button lights up when they have the shape.
   - A one-time tip shows how to add DJ Bingo to the home screen.
3. **Paper cards:** press **Print cards** to get one landscape sheet per player with every round on it. Printed cards start at #1001 so they never match a phone card. Each sheet has a QR code that opens that same card on a phone.
4. Press **Next song** (or the Space bar). The tonearm drops, the record spins, and the seconds count down in the center while the ring empties (it turns red for the last 5) (20 seconds by default). The title stays hidden as "?" until the countdown ends or you press **Reveal**. In manual mode, stop the song when the countdown ends.
5. When a round is finished, press **Start next round**.
6. When someone calls bingo, type their card number under **Check a bingo**. The app shows their card with every song played so far highlighted. A winning card gets confetti and an airhorn.

- **Keys on the host:** Space next song, R replay, S stop, V reveal, F full screen.
- **Stopping:** each song stops by itself when the countdown ends. **Stop** ends it early.
- **Sound effects:** the record scratch and airhorn are made in the browser and can be turned off on the setup screen.
- **Screen sleep:** the host and player screens stay awake during a game where the browser supports it.
- **Saving:** a game survives a refresh. **New game** clears it.

## Playing the music
- **Manual (no setup):** press **Open in YouTube Music** for each song and play it on any device.
- **Automatic (optional):** the host screen finds each song on YouTube and plays a clip by itself.
  1. Go to console.cloud.google.com and create a project. No billing is needed.
  2. Under APIs & Services, choose Library, find **YouTube Data API v3**, and enable it.
  3. Under APIs & Services, choose Credentials, then Create credentials, then API key. Restrict the key to the YouTube Data API v3. Under website restrictions, add your site address followed by `/*`.
  4. Paste the key into "Automatic playback" on the host setup screen. The key is stored only in that browser.
  - The free allowance covers about 100 song lookups a day. Each song is looked up only once per browser and remembered after that.
  - If the clip is the wrong song, press **Wrong song** to play the next match.
  - Ads may play before clips unless that browser is signed in to YouTube Premium.

## Adding or editing categories
Edit `songs.js`. Each category needs a unique 1-letter `id` and at least 30 songs. The more songs a category has, the longer a game lasts. `start` sets the second each clip starts at; 0 suits TV themes, and about 40 skips most song intros.
