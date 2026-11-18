# DJ Bingo

A free DJ music bingo game for family nights. It runs entirely in the browser, with no server, no accounts and no cost.

## How a game works
1. **Host:** open `host.html` on a laptop. Cast the Chrome tab to the TV (menu, then Cast, then Cast tab) so the sound comes through the TV too. Pick up to 4 rounds, one category per round, and a win pattern, then press **Start game**.
2. **Players:** open the site on a phone and type the code shown on the TV, for example `TNAD-K7Q`. Each phone gets one card number with a 3x5 B-I-N-G-O grid for each round, and the phone remembers its card if the page is refreshed.
3. **Paper cards:** press **Print cards** to get one landscape sheet per player with every round on it, laid out like a restaurant bingo sheet. Printed cards are numbered from #1001 so they never match a phone card.
4. Press **Next song**. The title stays hidden as "?" until you press **Reveal**, or until the clip ends in automatic mode.
5. When a round is finished, press **Start next round**.
6. When someone calls bingo, type their card number under **Check a bingo**. The app shows their card with every song played so far highlighted and tells you whether it wins.

A game survives a refresh. **New game** clears it.

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
