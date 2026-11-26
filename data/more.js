/* Extra content that extends the base decks. Same rules: plain string = everyone, {t, m} = m 1 (18+) or 2 (25+). */
(function () {
  var D = AATAA.data;
  function add(arr, items) { Array.prototype.push.apply(arr, items); }

  /* ---------- Who's Most Likely To ---------- */
  add(D.likely, [
    "laugh so hard they cry at the wrong moment", "crash a stranger's wedding for the free food", "say “I'm on my way” while still in bed",
    "get emotional during a cricket match", "forget a friend's name right after being introduced", "start a diet on Monday and quit by Monday evening",
    "order food at 2 AM and regret nothing", "become the group's unofficial tour guide", "wear the same hoodie five days in a row",
    "set ten alarms and still be late", "start a new hobby and quit within a week", "win a quiz show", "talk to strangers in a queue",
    "snore loudly on a train", "read the last page of a book first", "reply to a message in their head and never actually send it",
    "dance in the middle of a shop when a good song plays", "turn a 5-minute plan into a 5-hour hangout", "take 200 photos and post none",
    "forget to charge their phone before a long trip", "argue with an auto driver just for fun", "bring the wrong gift to a party",
    "cry during an advertisement", "sing in the shower loud enough for the whole building", "hide in the bathroom to avoid a conversation",
    "win a game and gloat for a week", "pretend to be on a call to avoid someone", "fall in love with a fictional character",
    "give life advice nobody asked for", "get lost inside a mall", "ghost the group chat for weeks then return with a meme",
    "plan the whole trip and cancel at the last minute", "know every Bollywood dialogue by heart", "start the group chat drama",
    "forget the punchline of their own joke", "pay for everyone and then remind them", "eat off someone else's plate",
    "bring up an old embarrassing story at the worst time", "sleep through a fire drill", "buy something just because it was on sale",
    "make a playlist for every mood", "become a food blogger", "lose an argument and still not admit it", "get hooked on a mobile game overnight",
    "tell the same story three times in one evening", "cry while watching a wedding video", "turn up with snacks nobody else thought of",
    "be the first to say “let's order in”", "go to buy milk and come back with a whole new wardrobe", "pass the group's lie-detector test",
    { t: "stay single by choice and be thrilled about it", m: 1 }, { t: "text their ex at 2 AM", m: 1 }, { t: "write a long paragraph to a crush and delete it", m: 1 },
    { t: "give a toast that goes on far too long", m: 2 }, { t: "forget their own anniversary", m: 2 }, { t: "buy a gadget and never open the box", m: 2 }
  ]);

  /* ---------- Would You Rather ---------- */
  add(D.wyr, [
    ["Have a rewind button for embarrassing moments", "Have a fast-forward button for boring ones"],
    ["Read minds for a day", "Be invisible for a day"],
    ["Give up chai forever", "Give up your phone for a month"],
    ["Only whisper for the rest of your life", "Only shout for the rest of your life"],
    ["Have unlimited free movie tickets", "Have unlimited free food delivery"],
    ["Always lose at cards", "Always lose your keys"],
    ["Never be able to cook", "Never be able to drive"],
    ["Have a pet dragon the size of a cat", "Have a pet cat the size of a dragon"],
    ["Be the best player on a losing team", "Be the worst player on a winning team"],
    ["Wear socks with sandals forever", "Wear a raincoat on sunny days forever"],
    ["Live without music", "Live without movies"],
    ["Be able to run at 100 km/h", "Be able to jump over buildings"],
    ["Win an all-expenses holiday", "Win a brand-new phone every year"],
    ["Always have to tell the truth", "Always have to tell a lie"],
    ["Eat your least favourite food once a day", "Never eat your favourite food again"],
    ["Have a robot do your chores", "Have a robot do your homework or work"],
    ["Have an extra hour every day", "Have an extra day every week"],
    ["Be stuck on a deserted island with your best friend", "Be stuck there alone with unlimited Wi-Fi"],
    ["Know how every movie ends", "Never see another spoiler but never see an ending"],
    ["Only travel by train for the rest of your life", "Only travel by plane for the rest of your life"],
    ["Be famous for something embarrassing", "Be unknown for something amazing"],
    ["Have everyone laugh at your jokes", "Have everyone listen to your advice"],
    ["Never have to sleep", "Never have to eat"],
    ["Sneeze every time you tell a lie", "Hiccup every time you get embarrassed"],
    ["Only watch one series forever", "Only listen to one song forever"],
    ["Live in a treehouse", "Live on a houseboat"],
    ["Have a loud ringtone that plays at the worst time", "Have your alarm go off in every meeting"],
    ["Be able to pause time for 10 seconds, once a day", "Be able to teleport 10 metres, once a day"],
    ["Fight a swarm of mosquitoes", "Fight a very angry goose"],
    ["Eat a whole raw onion", "Drink a glass of pickle juice"],
    ["Always have wet socks", "Always have a stone in your shoe"],
    ["Be bad at every game but have fun", "Be amazing at one game but hate it"],
    ["Have a theme song play whenever you enter a room", "Have a laugh track play after everything you say"],
    ["Only ever eat with chopsticks", "Only ever eat with your hands"],
    ["Never be bored again", "Never be tired again"],
    ["Have the world's fastest Wi-Fi but no AC", "Have perfect AC but terrible Wi-Fi"],
    ["Get a standing ovation for a bad performance", "Get a quiet smile for an amazing one"],
    ["Shrink to the size of a mouse for a day", "Grow to the size of a giraffe for a day"],
    ["Win the lottery but lose all your friends", "Keep all your friends but never be rich"],
    ["Be the host of every party", "Be the guest of honour at every party"],
    ["Wake up with a new hairstyle every day", "Wake up in a new city every week"],
    ["Be able to speak to plants", "Be able to speak to machines"],
    ["Have a pause button for arguments", "Have a skip button for traffic"],
    ["Never feel cold again", "Never feel hot again"],
    ["Have a clone to do your boring tasks", "Have a time machine for one day"],
    ["Be locked in a library overnight", "Be locked in a cinema overnight"],
    ["Be amazing at singing", "Be amazing at dancing"],
    ["Break your phone screen every month", "Lose one sock from every pair every month"],
    ["Date someone who loves your cooking", "Date someone who loves your jokes", 1],
    ["Have your search history read out loud", "Have your last 10 messages read out loud", 1],
    ["Spend a year without holidays but with great pay", "Spend a year with unlimited holidays but low pay", 2],
    ["Work with your best friend", "Work for your dream company", 2]
  ]);

  /* ---------- Riddles ---------- */
  add(D.riddles, [
    { q: "What has to be broken before you can use it?", a: "An egg" },
    { q: "What can you hold in your right hand but never in your left?", a: "Your left hand" },
    { q: "I'm light as a feather, yet the strongest person can't hold me for more than a few minutes. What am I?", a: "Breath" },
    { q: "What has teeth but can't bite?", a: "A comb" },
    { q: "What building has the most stories?", a: "A library" },
    { q: "What goes through towns and fields but never moves?", a: "A road" },
    { q: "What has a neck but no head?", a: "A bottle" },
    { q: "What runs but never walks, and has a mouth but never talks?", a: "A river" },
    { q: "What has words but never speaks?", a: "A book" },
    { q: "What can you break without ever touching it?", a: "A promise" },
    { q: "What gets bigger the more you take away from it?", a: "A hole" },
    { q: "What has one head, one foot and four legs?", a: "A bed" },
    { q: "What flies without wings?", a: "Time" },
    { q: "What is so fragile that saying its name breaks it?", a: "Silence" },
    { q: "I shave every day, but my beard stays the same. Who am I?", a: "A barber" },
    { q: "What question can you never answer “yes” to?", a: "“Are you asleep?”" },
    { q: "What kind of room has no doors or windows?", a: "A mushroom" },
    { q: "Where does “today” come before “yesterday”?", a: "In the dictionary" },
    { q: "What word becomes shorter when you add two letters to it?", a: "Short" },
    { q: "What is always coming but never arrives?", a: "Tomorrow" },
    { q: "What belongs to you, but other people use it more than you do?", a: "Your name" },
    { q: "How can you drop a raw egg onto a concrete floor without cracking it?", a: "Concrete floors are very hard to crack!" },
    { q: "If two's company and three's a crowd, what are four and five?", a: "Nine" },
    { q: "What has a bottom at the top?", a: "Your legs" },
    { q: "Which letter of the alphabet has the most water?", a: "The letter C (the sea)" },
    { q: "What can be cracked, made, told and played?", a: "A joke" },
    { q: "What goes up when the rain comes down?", a: "An umbrella" },
    { q: "I have branches but no fruit, trunk or leaves. What am I?", a: "A bank" },
    { q: "What is black when clean and white when dirty?", a: "A blackboard" },
    { q: "What do you throw away when you need it, and take back when you're done?", a: "An anchor" },
    { q: "What loses its head in the morning but gets it back at night?", a: "A pillow" },
    { q: "Which word is spelled wrong in every dictionary?", a: "“Wrong”" },
    { q: "What has a thumb and four fingers but isn't alive?", a: "A glove" },
    { q: "What can you keep after giving it to someone?", a: "Your word" },
    { q: "In a race, you overtake the person in second place. What position are you in now?", a: "Second place" },
    { q: "What has a face and two hands but no arms or legs?", a: "A clock" },
    { q: "What gets sharper the more you use it?", a: "Your brain" },
    { q: "What has an eye and a tongue but cannot see or taste?", a: "A shoe" },
    { q: "What has hundreds of ears but cannot hear a thing?", a: "A field of corn" }
  ]);

  /* ---------- Imposter word pairs ---------- */
  add(D.words.food.pairs, [['Paneer','Tofu'],['Rasgulla','Gulab Jamun'],['Chai','Green Tea'],['Pav Bhaji','Misal Pav'],['Chole Bhature','Rajma Chawal'],['Momos','Dumplings'],['Dhokla','Idli'],['Sandwich','Burger']]);
  add(D.words.places.pairs, [['Village','Town'],['Metro','Bus'],['Bakery','Cafe'],['Bank','ATM'],['Salon','Spa'],['River','Lake'],['Rooftop','Balcony'],['Mountains','Hills']]);
  add(D.words.movies.pairs, [['Marvel','DC'],['Golmaal','Hera Pheri'],['Frozen','Tangled'],['Mr. Bean','Charlie Chaplin'],['KGF','Pushpa'],['Chhota Bheem','Doraemon'],['Friends','The Office'],['Pathaan','Jawan']]);
  add(D.words.animals.pairs, [['Elephant','Rhino'],['Peacock','Parrot'],['Rabbit','Hamster'],['Cheetah','Leopard'],['Owl','Bat'],['Goat','Sheep'],['Duck','Swan'],['Ant','Bee']]);
  add(D.words.objects.pairs, [['Fridge','Freezer'],['Bulb','Tubelight'],['Pillow','Cushion'],['Towel','Napkin'],['Broom','Mop'],['Clock','Watch'],['Scissors','Knife'],['Bag','Suitcase']]);
  add(D.words.sports.pairs, [['Ludo','Snakes and Ladders'],['Cricket','Hockey'],['Swimming','Diving'],['Boxing','Wrestling'],['Test match','T20'],['Bowler','Batsman'],['Gold medal','Trophy'],['Football','Futsal']]);
  add(D.words.life.pairs, [['Breakfast','Brunch'],['Birthday','Anniversary'],['Party','Get-together'],['Alarm','Snooze'],['Hostel','PG'],['Gym','Yoga'],['Rain','Drizzle'],['Group chat','Group call']]);
  D.words.tech = { label: 'Tech', emoji: '💻', pairs: [
    ['Android','iPhone'],['Instagram','Snapchat'],['Google','Bing'],['Laptop','Desktop'],['Zoom','Google Meet'],
    ['Reels','YouTube Shorts'],['Charger','Power bank'],['Earphones','Headphones'],['Keyboard','Mouse'],['Wi-Fi','Hotspot'] ] };
  D.words.jobs = { label: 'Jobs', emoji: '🧑‍🍳', pairs: [
    ['Doctor','Nurse'],['Teacher','Professor'],['Chef','Waiter'],['Pilot','Driver'],['Engineer','Architect'],
    ['Actor','Singer'],['Lawyer','Judge'],['Farmer','Gardener'],['Police','Security guard'],['Painter','Photographer'] ] };
  D.words.travel = { label: 'Travel', emoji: '🧳', pairs: [
    ['Train','Bus'],['Goa','Kerala'],['Flight','Helicopter'],['Hotel','Homestay'],['Passport','Visa'],
    ['Camping','Trekking'],['Road trip','Picnic'],['Boat','Ferry'],['Ticket','Boarding pass'],['Suitcase','Backpack'] ] };

  /* ---------- Pass the Bomb ---------- */
  add(D.bomb.cats, [
    "Indian rivers", "Things in a garden", "Words with double letters", "Famous scientists", "Board games", "Fast-food brands",
    "Kinds of footwear", "Things that come in pairs", "Hobbies", "Ice-cream flavours", "Things you find in a park", "Famous YouTubers",
    "Things that are yellow", "Tourist places in India", "School subjects", "Types of bread", "Dance songs", "Kitchen appliances",
    "Things in a gym", "Types of weather", "Names starting with R", "Things with wheels", "Famous duos", "Cartoon villains",
    "Ways to cook an egg", "Things you do on a train journey", "Indian sweets", "Things you pack for a trip", "Words starting with S",
    "Mobile games", "Things in a supermarket", "Musical instruments", "Birds", "Vegetables", "Hill stations in India",
    "Famous movie villains", "Things that are sharp", "Sports played with a ball", "Things you can wear on your head", "Famous cricket grounds"
  ]);
  add(D.bomb.forfeits, [
    "Do your best impression of a famous Bollywood villain.", "Speak in slow motion until the next round ends.", "Stand on one leg until the next explosion.",
    "Say something nice about the person on your left, then your right.", "Do a runway walk while the group hums a tune.", "Act out a cooking show for 15 seconds.",
    "Do the chicken dance.", "Take a new nickname from the group for the next 10 minutes.", "Sing “Happy Birthday” in opera style.",
    "Recite a tongue twister chosen by the group.", "Do 5 push-ups (wall push-ups count).", "Narrate your next 20 seconds like a nature documentary.",
    "Hold a funny face for 10 seconds while the group rates it out of 10.", "Pretend to be a tour guide describing this room.", "Say your own name backwards.",
    "Give a one-line pitch to sell this phone to everyone.", "Speak only in rhymes until your next turn.", "Do your best laugh, then your best evil laugh.",
    "Mimic the person on your right until the next round.", "Show your best dance move.", "Describe your day in exactly seven words."
  ]);

  /* ---------- Charades ---------- */
  add(D.charades.bollywood.words, ["Chak De India","Rockstar","Kahaani","Tamasha","Raazi","Badhaai Ho","Piku","Hum Aapke Hain Koun","Dil Se","Border",
    "Dabangg","Singham","Bhool Bhulaiyaa","Housefull","Judwaa","Ra.One","Zero","Sanju","Chhichhore","Dear Zindagi","English Vinglish","Stree",
    "Dream Girl","Fukrey","Veer-Zaara","Main Hoon Na","Koi Mil Gaya","Ghajini","Kaho Naa Pyaar Hai","Dostana"]);
  add(D.charades.animals.words, ["Hippo","Rhino","Zebra","Deer","Squirrel","Pig","Goat","Fish","Eagle","Bee","Turtle","Lizard","Parrot","Whale","Crab",
    "Duck","Rooster","Sheep","Bull","Cheetah","Seal","Flamingo","Gorilla","Mosquito","Dinosaur"]);
  add(D.charades.actions.words, ["Applying makeup","Taking a selfie with ten people","Teaching a class","Using a washing machine","Playing the drums","Texting under the table",
    "Running late for a train","Sneezing in a meeting","Taking a cold shower","Falling off a chair","Cleaning the house","Eating a very spicy chilli","Parallel parking",
    "Doing a magic trick","Walking a dog","Riding a horse","Chasing a bus","Opening a stuck jar","Painting a wall","Mopping the floor","Carrying heavy shopping bags",
    "Watching a horror movie","Playing carrom","Flying a kite","Waiting in a long queue","Playing video games","Singing karaoke"]);
  add(D.charades.food.words, ["Rasmalai","Chole Bhature","Upma","Paratha","Butter chicken","Rajma Chawal","Lassi","Sambar","Bhel Puri","Kheer","Poha","Hot dog",
    "Taco","Sushi","Cupcake","Waffle","Bubble tea","Garlic bread","Egg roll","Kulcha","Mysore Pak","Filter coffee","Dhokla","Pizza slice"]);
  add(D.charades.sports.words, ["Jasprit Bumrah","Rohit Sharma","Hardik Pandya","Neeraj Chopra","PV Sindhu","Sunil Chhetri","Dribbling","Penalty kick","Hat-trick","Catching a ball",
    "LBW","Googly","Slam dunk","Marathon","High jump","Archery","Skating","Surfing","Carrom","Throwing a javelin"]);
  add(D.charades.pop.words, ["Elsa","Shrek","Spongebob","Tarzan","Sherlock Holmes","Naruto","Ben 10","Motu Patlu","Peppa Pig","Captain America","Black Panther","Hermione",
    "Darth Vader","Jack Sparrow","Aladdin","Mowgli","Nobita","Rancho","Dora","Wonder Woman","Santa Claus","Superman","Cinderella"]);

  /* ---------- Mystery stories ---------- */
  add(D.mystery, [
    { title: "The Two Barbers",
      story: "A man arrives in a small town with two barbers. One has a neat, sharp haircut. The other has a messy one. He chooses the messy barber. Why?",
      solution: "In a town with only two barbers, they cut each other's hair. The neat one's haircut was done by the messy barber, so the messy barber is the better one.",
      hints: ["Who cuts a barber's hair?", "There are only two barbers in town.", "Each haircut is the other's work."] },
    { title: "The Surgeon",
      story: "A father and his son are in a car accident. The father is taken to one hospital and the son to another. The surgeon looks at the boy and says, “I can't operate on him. He's my son.” How is that possible?",
      solution: "The surgeon is the boy's mother.",
      hints: ["Both statements are completely true.", "Which parent haven't we mentioned?", "Think about who the surgeon could be."] },
    { title: "Cowboy Friday",
      story: "A cowboy rode into town on Friday, stayed three days, and rode out on Friday. How is that possible?",
      solution: "His horse was named Friday.",
      hints: ["Read the word “Friday” again.", "It's not about days.", "Something other than a day can be called Friday."] },
    { title: "The Two Guards",
      story: "You face two doors, each with a guard. One door leads to freedom, the other to a trap. One guard always lies and the other always tells the truth, but you don't know which is which. You may ask one question to one guard. What do you ask?",
      solution: "Ask either guard: “What would the other guard say is the safe door?” Then pick the opposite door. The liar lies about the truth-teller, and the truth-teller truthfully reports the liar's lie.",
      hints: ["Ask about the other guard, not about the door.", "Both guards end up pointing at the wrong door.", "Choose the door they do NOT point to."] },
    { title: "Three Switches",
      story: "Three light switches are outside a closed room. Only one controls the bulb inside, and you can enter the room just once. How do you find the right switch?",
      solution: "Turn switch 1 on for a few minutes, then turn it off. Turn switch 2 on and go in. If the bulb is on, it's switch 2. If it's off but warm, it's switch 1. If it's off and cold, it's switch 3.",
      hints: ["Light isn't the only thing a bulb gives off.", "Use time before you go in.", "A bulb stays warm after it's switched off."] },
    { title: "Wolf, Goat and Cabbage",
      story: "A farmer must carry a wolf, a goat and a cabbage across a river in a boat that holds only him and one item. Left alone, the wolf eats the goat and the goat eats the cabbage. How does he get everything across safely?",
      solution: "Take the goat across. Return alone. Take the wolf across and bring the goat back. Take the cabbage across. Return alone. Finally take the goat across again.",
      hints: ["The goat has to go first.", "You can bring something back with you.", "The goat travels three times."] },
    { title: "The Two Ropes",
      story: "You have two ropes. Each takes exactly one hour to burn, but they burn unevenly, so half a rope does not take half an hour. With only a lighter, how do you measure exactly 45 minutes?",
      solution: "Light rope A at both ends and rope B at one end at the same moment. Rope A burns out after 30 minutes. At that instant, light the other end of rope B. It has 30 minutes' worth left but now burns from both sides, so it finishes in 15 minutes. Total: 45 minutes.",
      hints: ["Burning a rope from both ends makes it burn twice as fast.", "Start both ropes at the same time, but not both the same way.", "Something happens at the 30-minute mark."] }
  ]);

  /* ---------- Truth or Dare ---------- */
  add(D.tod.truths, [
    "What's the most embarrassing thing you've done to impress someone?", "What's a food combination you secretly love that others find weird?",
    "Which fictional character do you relate to most?", "What's the longest you've stayed in the same clothes?", "What was your most awkward family-function moment?",
    "What's the most random thing you've ever Googled at 3 AM?", "Which friend in this room would you trust with your phone password, and why?",
    "What's something you're really bad at but pretend to be good at?", "What's the worst advice you've ever followed?",
    "What's a childhood habit you still haven't outgrown?", "If your life had a theme song right now, what would it be?",
    "What's the most embarrassing thing you've said to the wrong person?", "What's your biggest 'it seemed like a good idea at the time' moment?",
    "Which celebrity do people say you look like?", "What's a skill you wish you had instantly?", "What's the silliest thing you're scared of?",
    "What's the weirdest thing you've eaten?", "What's your most embarrassing autocorrect fail?", "Who in this room has the best fashion sense?",
    "What's the last thing that made you laugh until it hurt?", "What's a secret hobby you have?", "What's the most useless talent you have?",
    "What's the worst haircut you've ever had, and who talked you into it?", "What's your biggest pet peeve about group plans?",
    "If you had to swap lives with someone here for a week, who would it be?", "What's the most embarrassing nickname you gave someone?",
    "What did you want to be when you were 10?", "What's the most ridiculous excuse you've ever given a teacher or boss?",
    "Which friend would you call first in an emergency, and which would you call last?", "What's a lie you told that got out of hand?",
    "What was your most embarrassing school moment?", "What's the strangest compliment you've ever received?",
    { t: "Who was your biggest crush in school?", m: 1 }, { t: "What's the most awkward first date moment you've had?", m: 1 },
    { t: "What's the cringiest thing you've done to get someone's attention?", m: 1 }, { t: "What's your most awkward 'hi' to an ex?", m: 1 },
    { t: "What's the worst job interview answer you've ever given?", m: 2 }, { t: "What's the biggest purchase you regret?", m: 2 },
    { t: "What's the most embarrassing thing that's happened on a video call?", m: 2 }, { t: "What's the best piece of life advice you ignored?", m: 2 }
  ]);
  add(D.tod.dares, [
    "Talk like a pirate for the next 3 minutes.", "Do your best catwalk with the group scoring you out of 10.", "Sing a nursery rhyme in an opera voice.",
    "Say a tongue twister three times fast. Fail and everyone picks your next dare.", "Pretend to be a waiter and take everyone's imaginary order.",
    "Do ten squats while saying the alphabet.", "Draw a picture of someone here with your eyes closed, then show everyone.",
    "Act out a movie scene without speaking. The group guesses the movie.", "Speak only in third person for the next 3 turns.",
    "Show your best dance move and teach it to the person beside you.", "Do a stand-up comedy minute about the last thing you ate.",
    "Imitate a famous Bollywood dialogue with a twist: say it very slowly.", "Hold a plank for 20 seconds while the group tells jokes.",
    "Balance something on your head for the rest of the round.", "Let the group choose a silly voice you must use for 2 minutes.",
    "Pretend you're a robot who just learned to laugh.", "Make up a 15-second advert for any object in this room.",
    "Try to make the person across from you laugh in 20 seconds without touching them.", "Give a dramatic weather forecast for tomorrow.",
    "Do a slow-motion replay of the last thing you did.", "Say everything with a big smile for the next 2 rounds.",
    "Walk around the room like a penguin.", "Hum a song while the others guess it. Two guesses allowed.", "Do your best impression of the person to your left.",
    "Speak in rhymes for the next 3 turns.", "Do a 10-second interpretive dance about your day.", "Explain how to make a cup of chai like it's a secret mission briefing.",
    "Give the group a 20-second speech on why you should be crowned queen/king of the room.", "Do your best yoga pose with a serious face.",
    "Do a news bulletin about something silly that happened to you this week.", "Whisper everything you say until your next turn.",
    "Close your eyes and let the group give you a random object. Guess what it is by feel.", "Do your best stand-up impression of a strict teacher.",
    "Do an unboxing of an imaginary gift with maximum excitement.", "Moonwalk across the room, or try your best."
  ]);
  add(D.tod.chaos, [
    "🎯 Target practice! The group picks a Truth for {p}, and {p} picks the Dare for someone else.",
    "🎤 {p} must do a 15-second performance of the group's favourite song, picked by vote.",
    "🔁 Swap! {p} picks someone to take this turn instead, but both do a mini dare.",
    "🧠 Memory test! {p} repeats the last three things said in the game, in order.",
    "🤫 Silence! {p} can only answer with gestures for the next two turns.",
    "🎁 Gift time! Everyone says one nice thing about {p}.",
    "🎬 Director's cut: {p} re-enacts the last turn with extra drama.",
    "🌀 Spin the spinner: {p} gets to spin again, but must do both results.",
    "👑 {p} is the king/queen for 2 turns and can pick any Truth or Dare for anyone.",
    "🧩 Group effort: everyone helps {p} tell one story, one sentence each."
  ]);
})();
