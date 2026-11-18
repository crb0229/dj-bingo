// Movie quote lists. Each movie: [title, year, quotes]. Each quote: [text, who, YouTube search, check-wording flag].
// Clip picks (video, start, end) are saved by clips.html and copied into CLIPS below.
const QUOTE_SETS = [{
  id: 'christmas', name: 'Christmas Movies', movies: [
    ["National Lampoon's Christmas Vacation", 1989, [
      ["Save the neck for me, Clark.", "Cousin Eddie", "Christmas Vacation Eddie save the neck for me Clark", 0],
      ["It's the gift that keeps on giving the whole year.", "Clark Griswold", "Christmas Vacation Clark jelly of the month club gift that keeps on giving", 1],
      ["Little full, lotta sap.", "Clark Griswold", "Christmas Vacation Clark tree little full lotta sap", 1],
      ["Can I refill your eggnog for you? Get you something to eat? Drive you out to the middle of nowhere and leave you for dead?", "Clark Griswold", "Christmas Vacation Clark refill your eggnog leave you for dead", 1]]],
    ["Elf", 2003, [
      ["You sit on a throne of lies!", "Buddy", "Elf Buddy you sit on a throne of lies scene", 0],
      ["Son of a nutcracker!", "Buddy", "Elf Buddy son of a nutcracker scene", 0],
      ["I just like smiling. Smiling's my favorite.", "Buddy", "Elf Buddy smiling's my favorite scene", 0],
      ["Santa! Oh my God! Santa's coming! I know him!", "Buddy", "Elf Buddy Santa I know him scene", 1]]],
    ["Home Alone", 1990, [
      ["Keep the change, ya filthy animal.", "Kevin", "Home Alone keep the change ya filthy animal scene", 0],
      ["I made my family disappear.", "Kevin", "Home Alone I made my family disappear scene", 0],
      ["Buzz, your girlfriend... woof.", "Kevin", "Home Alone Buzz your girlfriend woof scene", 0],
      ["I'm eating junk and watching rubbish, and there's nobody here to stop me!", "Kevin", "Home Alone Kevin eating junk watching rubbish scene", 1]]],
    ["Home Alone 2: Lost in New York", 1992, [
      ["We're what the French call 'les incompetents.'", "Harry", "Home Alone 2 Harry les incompetents scene", 1],
      ["Do not be afraid. People are afraid of what they do not understand.", "Pigeon Lady", "Home Alone 2 Pigeon Lady Kevin Central Park scene", 1]]],
    ["A Christmas Story", 1983, [
      ["You'll shoot your eye out.", "Santa / Mother / Teacher", "A Christmas Story you'll shoot your eye out scene", 0],
      ["Fra-gee-lay. It must be Italian!", "The Old Man", "A Christmas Story leg lamp fragile Italian scene", 0],
      ["Oh, fudge. Only I didn't say 'fudge.'", "Ralphie (narration)", "A Christmas Story Ralphie fudge scene", 0],
      ["I triple dog dare ya!", "Schwartz", "A Christmas Story triple dog dare flagpole scene", 0]]],
    ["Die Hard", 1988, [
      ["Welcome to the party, pal.", "John McClane", "Die Hard welcome to the party pal scene", 0],
      ["Now I have a machine gun. Ho ho ho.", "John McClane", "Die Hard now I have a machine gun ho ho ho", 0],
      ["Come out to the coast, we'll get together, have a few laughs.", "John McClane", "Die Hard air vent lighter come out to the coast have a few laughs", 0],
      ["Hans, bubby, I'm your white knight.", "Harry Ellis", "Die Hard Ellis Hans bubby white knight scene", 0]]],
    ["It's a Wonderful Life", 1946, [
      ["Every time a bell rings, an angel gets his wings.", "Zuzu", "It's a Wonderful Life Zuzu every time a bell rings", 0],
      ["You want the moon? Just say the word and I'll throw a lasso around it and pull it down.", "George Bailey", "It's a Wonderful Life George lasso the moon scene", 0],
      ["Merry Christmas, Bedford Falls!", "George Bailey", "It's a Wonderful Life George runs through Bedford Falls Merry Christmas", 0]]],
    ["Miracle on 34th Street", 1947, [
      ["I believe... I believe... it's silly, but I believe.", "Susan Walker", "Miracle on 34th Street 1947 Susan I believe scene", 0],
      ["Faith is believing in things when common sense tells you not to.", "Doris Walker", "Miracle on 34th Street 1947 faith is believing in things when common sense tells you not to", 0]]],
    ["How the Grinch Stole Christmas!", 1966, [
      ["Maybe Christmas, he thought, doesn't come from a store.", "Narrator", "Grinch 1966 maybe Christmas doesn't come from a store", 1],
      ["Every Who down in Whoville liked Christmas a lot.", "Narrator", "Grinch 1966 opening narration every Who down in Whoville", 0]]],
    ["How the Grinch Stole Christmas", 2000, [
      ["Oh, the Who-manity!", "The Grinch", "Grinch 2000 Jim Carrey oh the Who-manity", 0],
      ["4:00, wallow in self-pity. 4:30, stare into the abyss.", "The Grinch", "Grinch 2000 Jim Carrey schedule wallow in self-pity stare into the abyss", 1]]],
    ["Scrooged", 1988, [
      ["It's Christmastime. There's no need to be afraid.", "Frank Cross", "Scrooged Bill Murray ending speech Christmastime no need to be afraid", 1],
      ["It can happen every day, not just at Christmas.", "Frank Cross", "Scrooged Bill Murray ending speech it can happen every day", 1]]],
    ["The Santa Clause", 1994, [
      ["Seeing isn't believing. Believing is seeing.", "Bernard", "The Santa Clause seeing isn't believing believing is seeing scene", 1],
      ["I'm Santa Claus now.", "Scott Calvin", "The Santa Clause Tim Allen first Christmas Eve sleigh scene", 1]]],
    ["Love Actually", 2003, [
      ["To me, you are perfect.", "Mark", "Love Actually cue cards Mark Juliet scene", 0],
      ["Don't buy drugs, become a pop star and they give you them for free.", "Billy Mack", "Love Actually Billy Mack don't buy drugs become a pop star", 0],
      ["Enough. Enough now.", "Mark", "Love Actually Mark cue cards enough now", 1]]],
    ["The Polar Express", 2004, [
      ["Tickets, please!", "The Conductor", "Polar Express conductor tickets please scene", 0],
      ["One thing about trains: it doesn't matter where they're going. What matters is deciding to get on.", "Hobo", "Polar Express hobo one thing about trains scene", 1],
      ["The true spirit of Christmas lies in your heart.", "Santa", "Polar Express Santa true spirit of Christmas lies in your heart", 1]]],
    ["Jingle All the Way", 1996, [
      ["Put that cookie down! Now!", "Howard Langston", "Jingle All the Way put that cookie down now scene", 0],
      ["It's Turbo Man!", "Jamie / Howard", "Jingle All the Way Turbo Man parade scene", 1]]],
    ["Trading Places", 1983, [
      ["Looking good, Billy Ray!", "Louis Winthorpe III", "Trading Places looking good Billy Ray scene", 0],
      ["Feeling good, Louis!", "Billy Ray Valentine", "Trading Places feeling good Louis scene", 0],
      ["Merry New Year!", "Billy Ray Valentine", "Trading Places Merry New Year scene", 1]]],
    ["Gremlins", 1984, [
      ["Never feed them after midnight.", "Mr. Wing", "Gremlins Mr. Wing rules bright light water midnight", 1],
      ["I'll get you, my pretty, and your little dog, too!", "Mrs. Deagle", "Gremlins Mrs. Deagle stair lift scene", 1]]],
    ["A Charlie Brown Christmas", 1965, [
      ["Good grief.", "Charlie Brown", "A Charlie Brown Christmas good grief scene", 0],
      ["I never thought it was such a bad tree. Maybe it just needs a little love.", "Charlie Brown", "A Charlie Brown Christmas maybe it just needs a little love", 1],
      ["Lights, please.", "Linus", "A Charlie Brown Christmas Linus lights please scripture speech", 0]]],
    ["Rudolph the Red-Nosed Reindeer", 1964, [
      ["I don't wanna make toys. I wanna be a dentist.", "Hermey", "Rudolph 1964 Hermey I want to be a dentist", 1],
      ["Bumbles bounce!", "Yukon Cornelius", "Rudolph 1964 Yukon Cornelius Bumbles bounce", 0]]],
    ["The Muppet Christmas Carol", 1992, [
      ["Light the lamp, not the rat.", "Gonzo / Rizzo", "Muppet Christmas Carol light the lamp not the rat", 1],
      ["Bah, humbug.", "Scrooge", "Muppet Christmas Carol Michael Caine Scrooge humbug", 1]]],
    ["The Holiday", 2006, [
      ["You're supposed to be the leading lady of your own life.", "Arthur", "The Holiday Arthur leading lady of your own life scene", 1],
      ["I'm Mr. Napkin Head.", "Graham", "The Holiday Graham Mr Napkin Head scene", 1]]],
    ["Christmas with the Kranks", 2004, [
      ["You're skipping Christmas! Isn't that against the law?", "Spike Frohmeyer", "Christmas with the Kranks Spike skipping Christmas against the law", 0],
      ["The higher the hair, the closer to the North Pole!", "Hair stylist", "Christmas with the Kranks higher the hair closer to the North Pole", 0]]],
    ["Frosty the Snowman", 1969, [
      ["Happy birthday!", "Frosty", "Frosty the Snowman 1969 Frosty comes to life happy birthday", 1],
      ["Hocus pocus.", "Professor Hinkle", "Frosty the Snowman 1969 Professor Hinkle magician hat", 1]]],
    ["Scrooge", 1951, [
      ["I'm as light as a feather, I'm as happy as an angel... I'm as giddy as a drunken man.", "Scrooge", "Scrooge 1951 Alastair Sim Christmas morning I'm as light as a feather", 1],
      ["Bah, humbug!", "Scrooge", "Scrooge 1951 Alastair Sim bah humbug scene", 1]]]
  ]
}];

// Saved clip picks, keyed "movie|original quote": { v: video id, s: start sec, e: end sec, t: corrected text } or { none: 1 }.
const CLIPS = {};
