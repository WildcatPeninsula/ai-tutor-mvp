// ── LESSON CONTENT: 15 micro-lessons across Math, Reading, Science ──
// Each lesson = 3 steps. Every step = { question, answer(s), feedback, type }

const LESSONS = {
  math: [
    // ── LESSON 0: Addition (Beginner) ──
    {
      steps: [
        { q: "What is 3 + 5?", a: 8, feedback: "Yep! 3 and 5 make 8! 🎉", hint: "Count up from 3: 4, 5, 6, 7, 8" },
        { q: "What is 7 + 2?", a: 9, feedback: "Right! 7 plus 2 is 9! ⭐", hint: "Start at 7, count 2 more" },
        { q: "What is 4 + 6?", a: 10, feedback: "Perfect! 4 + 6 = 10! 🌟", hint: "Think: what makes 10 with 4?" }
      ]
    },
    // ── LESSON 1: Subtraction (Beginner) ──
    {
      steps: [
        { q: "What is 9 − 3?", a: 6, feedback: "Great! 9 take away 3 is 6! 🎉", hint: "Count back from 9: 8, 7, 6" },
        { q: "What is 8 − 5?", a: 3, feedback: "Awesome! 8 − 5 = 3! ⭐", hint: "Start at 8, go back 5" },
        { q: "What is 7 − 2?", a: 5, feedback: "You're on fire! 7 − 2 = 5! 🌟", hint: "What number plus 2 makes 7?" }
      ]
    },
    // ── LESSON 2: Multiplication (Beginner) ──
    {
      steps: [
        { q: "What is 2 × 3?", a: 6, feedback: "Yes! 2 groups of 3 is 6! 🎉", hint: "3 + 3 = ?" },
        { q: "What is 3 × 2?", a: 6, feedback: "Correct! 3 × 2 is also 6! ⭐", hint: "2 + 2 + 2 = ?" },
        { q: "What is 4 × 1?", a: 4, feedback: "Right! Any number × 1 stays the same! 🌟", hint: "Think: 4 groups of 1" }
      ]
    },
    // ── LESSON 3: Division (Intermediate) ──
    {
      steps: [
        { q: "What is 8 ÷ 2?", a: 4, feedback: "Exactly! 8 split into 2 groups = 4! 🎉", hint: "How many groups of 2 make 8?" },
        { q: "What is 12 ÷ 3?", a: 4, feedback: "You got it! 12 ÷ 3 = 4! ⭐", hint: "3 × ? = 12" },
        { q: "What is 10 ÷ 5?", a: 2, feedback: "Perfect! 10 ÷ 5 = 2! 🌟", hint: "5 + 5 = 10, so 10 ÷ 5 = 2" }
      ]
    },
    // ── LESSON 4: Mixed Operations (Intermediate) ──
    {
      steps: [
        { q: "What is 3 + 4 × 2? (Do × first!)", a: 11, feedback: "Right! 4×2=8, then 3+8=11! 🎉", hint: "Multiply first: 4×2=8, then add 3" },
        { q: "What is 10 − 3 × 2?", a: 4, feedback: "Correct! 3×2=6, then 10−6=4! ⭐", hint: "Multiply first: 3×2=6, then subtract from 10" },
        { q: "What is 5 × 2 − 6?", a: 4, feedback: "Awesome! 5×2=10, then 10−6=4! 🌟", hint: "Multiply first: 5×2=10, then subtract 6" }
      ]
    },
    // ── LESSON 5: Word Problems (Advanced) ──
    {
      steps: [
        { q: "Sara has 15 apples. She gives 7 to her friend. How many does she have left?", a: 8, feedback: "Right! 15 − 7 = 8! 🎉", hint: "Subtract 7 from 15" },
        { q: "A box holds 6 toys. How many toys in 4 boxes?", a: 24, feedback: "Perfect! 6 × 4 = 24! ⭐", hint: "Multiply: 6 × 4" },
        { q: "Tom has 20 stickers. He shares them equally among 4 friends. How many each?", a: 5, feedback: "Great! 20 ÷ 4 = 5! 🌟", hint: "Divide 20 by 4" }
      ]
    }
  ],

  reading: [
    // ── LESSON 0: Spelling (Beginner) ──
    {
      steps: [
        { q: "What word means \"very happy\"? (4 letters, starts with 'j')", a: "joy", type: "word", feedback: "Yes! Joy means very happy! 🎉", hint: "J-O-Y" },
        { q: "Spell: a small bird that sings beautifully (5 letters, starts with 'l')", a: "lark", type: "word", feedback: "Correct! A lark is a singing bird! ⭐", hint: "L-A-R-K" },
        { q: "Spell: something you wear on your feet (4 letters, starts with 's')", a: "sock", type: "word", feedback: "Right! S-O-C-K! 🌟", hint: "S-O-C-K" }
      ]
    },
    // ── LESSON 1: Synonyms (Beginner) ──
    {
      steps: [
        { q: "Which word means the same as 'big'?", type: "choice", choices: ["tiny", "enormous", "quick", "slow"], a: "enormous", feedback: "Exactly! Enormous means very big! 🎉" },
        { q: "Which word means the same as 'fast'?", type: "choice", choices: ["sluggish", "rapid", "lazy", "gentle"], a: "rapid", feedback: "Correct! Rapid means fast! ⭐" },
        { q: "Which word means the same as 'tiny'?", type: "choice", choices: ["huge", "gigantic", "microscopic", "massive"], a: "microscopic", feedback: "Right! Microscopic means very tiny! 🌟" }
      ]
    },
    // ── LESSON 2: Sentence Building (Intermediate) ──
    {
      steps: [
        { q: "Put these words in order: 'cat / the / mat / on / sat'", type: "word_order", words: ["the", "cat", "sat", "on", "mat", "the"], hint_words: ["the", "cat", "sat", "on", "mat"], correct_order: ["The", "cat", "sat", "on", "mat."], feedback: "Perfect! 'The cat sat on the mat!' 🎉" },
        { q: "Add the missing word: 'The dog ___ very fast.' (runs/runned/runned)", type: "choice", choices: ["runs", "runned", "runing"], a: "runs", feedback: "Right! The dog runs very fast! ⭐" },
        { q: "What's the capital of a sentence?", type: "choice", choices: ["A period", "A capital letter", "A comma"], a: "A capital letter", feedback: "Correct! Every sentence starts with a capital letter! 🌟" }
      ]
    },
    // ── LESSON 3: Reading Comprehension (Intermediate) ──
    {
      steps: [
        { q: "Read: 'Sam went to the park. He played on the swing and ate a sandwich.'\n\nWhere did Sam go?", type: "choice", choices: ["The store", "The park", "School"], a: "The park", feedback: "Right! The text says Sam went to the park! 🎉" },
        { q: "What did Sam eat?", type: "choice", choices: ["Pizza", "A sandwich", "Fruit"], a: "A sandwich", feedback: "Correct! Sam ate a sandwich! ⭐" },
        { q: "What did Sam play on?", type: "choice", choices: ["The slide", "The swing", "The merry-go-round"], a: "The swing", feedback: "Perfect! Sam played on the swing! 🌟" }
      ]
    },
    // ── LESSON 4: Sight Words (Advanced) ──
    {
      steps: [
        { q: "What does 'enormous' mean?", type: "choice", choices: ["Very small", "Very large", "Very fast"], a: "Very large", feedback: "Right! Enormous means very large! 🎉" },
        { q: "What is a synonym for 'beautiful'?", type: "choice", choices: ["Pretty", "Ugly", "Boring"], a: "Pretty", feedback: "Correct! Pretty means beautiful! ⭐" },
        { q: "Which word is spelled correctly?", type: "choice", choices: ["freind", "friend", "frend"], a: "friend", feedback: "Right! F-R-I-E-N-D! 🌟" }
      ]
    },
    // ── LESSON 5: Story Creation (Advanced) ──
    {
      steps: [
        { q: "Which word fits best: 'The ___ moon rose above the trees.'?", type: "choice", choices: ["bright", "loud", "fast"], a: "bright", feedback: "Perfect! 'The bright moon' sounds just right! 🎉" },
        { q: "What's the best ending: 'The little bird looked at the nest. It was empty. She...'?", type: "choice", choices: ["flew away sadly", "built a new one", "went to sleep"], a: "built a new one", feedback: "Great choice! The bird would build a new nest! ⭐" },
        { q: "Which sentence uses a simile?", type: "choice", choices: ["The cat ran.", "She was brave.", "She was as brave as a lion."], a: "She was as brave as a lion.", feedback: "Correct! A simile compares using 'like' or 'as'! 🌟" }
      ]
    }
  ],

  science: [
    // ── LESSON 0: States of Matter (Beginner) ──
    {
      steps: [
        { q: "Water can be ice (solid), liquid water, or steam (gas). What do we call these forms?", type: "choice", choices: ["States of matter", "Types of food", "Kinds of weather"], a: "States of matter", feedback: "Right! Ice, water, and steam are three states of matter! 🎉" },
        { q: "What state is a rock in?", type: "choice", choices: ["Solid", "Liquid", "Gas"], a: "Solid", feedback: "Correct! Rocks are solids! ⭐" },
        { q: "What happens to water when you heat it to 100°C?", type: "choice", choices: ["It freezes", "It boils", "Nothing"], a: "It boils", feedback: "Right! Water boils and becomes steam at 100°C! 🌟" }
      ]
    },
    // ── LESSON 1: Plants (Beginner) ──
    {
      steps: [
        { q: "What do plants need to make food?", type: "choice", choices: ["Sunlight, water, air", "Only water", "Only sunlight"], a: "Sunlight, water, air", feedback: "Yes! Plants use photosynthesis with all three! 🎉" },
        { q: "What gas do plants release?", type: "choice", choices: ["Carbon dioxide", "Oxygen", "Nitrogen"], a: "Oxygen", feedback: "Correct! Plants release oxygen for us to breathe! ⭐" },
        { q: "What part of the plant absorbs water from soil?", type: "choice", choices: ["Leaves", "Flowers", "Roots"], a: "Roots", feedback: "Right! Roots soak up water! 🌟" }
      ]
    },
    // ── LESSON 2: Solar System (Intermediate) ──
    {
      steps: [
        { q: "How many planets are in our solar system?", type: "choice", choices: ["7", "8", "9"], a: "8", feedback: "Yes! Pluto was reclassified, so 8 planets! 🎉" },
        { q: "Which planet is closest to the Sun?", type: "choice", choices: ["Venus", "Mercury", "Earth"], a: "Mercury", feedback: "Correct! Mercury orbits closest! ⭐" },
        { q: "Which planet is known as the 'Red Planet'?", type: "choice", choices: ["Jupiter", "Mars", "Saturn"], a: "Mars", feedback: "Right! Mars is the Red Planet! 🌟" }
      ]
    },
    // ── LESSON 3: Animals & Habitats (Intermediate) ──
    {
      steps: [
        { q: "Where does a camel live?", type: "choice", choices: ["Arctic", "Desert", "Rainforest"], a: "Desert", feedback: "Yes! Camels live in hot deserts! 🎉" },
        { q: "What kind of animal is a dolphin?", type: "choice", choices: ["Fish", "Mammal", "Reptile"], a: "Mammal", feedback: "Correct! Dolphins are mammals — they breathe air! ⭐" },
        { q: "Which animal lays eggs?", type: "choice", choices: ["Dog", "Cat", "Chicken"], a: "Chicken", feedback: "Right! Chickens lay eggs! 🌟" }
      ]
    },
    // ── LESSON 4: Forces & Motion (Advanced) ──
    {
      steps: [
        { q: "What force pulls things toward Earth?", type: "choice", choices: ["Magnetism", "Gravity", "Friction"], a: "Gravity", feedback: "Yes! Gravity pulls everything toward Earth! 🎉" },
        { q: "What makes a ball stop rolling on grass?", type: "choice", choices: ["Gravity", "Friction", "Wind"], a: "Friction", feedback: "Correct! Friction between ball and grass slows it! ⭐" },
        { q: "If you push a swing harder, what happens?", type: "choice", choices: ["It swings higher", "Nothing changes", "It stops"], a: "It swings higher", feedback: "Right! More force = higher swing! 🌟" }
      ]
    },
    // ── LESSON 5: Weather & Water Cycle (Advanced) ──
    {
      steps: [
        { q: "What is it called when water turns to vapor from heat?", type: "choice", choices: ["Condensation", "Evaporation", "Precipitation"], a: "Evaporation", feedback: "Yes! Heat makes water evaporate into vapor! 🎉" },
        { q: "What do we call water falling from clouds?", type: "choice", choices: ["Evaporation", "Rainfall", "Condensation"], a: "Rainfall", feedback: "Correct! Rain, snow, sleet — all forms of rainfall! ⭐" },
        { q: "What forms when water vapor cools in the air?", type: "choice", choices: ["Clouds", "Rocks", "Soil"], a: "Clouds", feedback: "Right! Clouds are millions of tiny water droplets! 🌟" }
      ]
    }
  ]
};

// ── BADGES (12 total, earned at milestones) ──
const BADGES = [
  { id: "first_lesson", name: "First Steps", icon: "🎯", desc: "Complete your first lesson", condition: (s) => s.lessonsCompleted >= 1 },
  { id: "math_explorer", name: "Math Explorer", icon: "🧮", desc: "Finish 1 Math lesson", condition: (s) => s.subjectLessons.math >= 1 },
  { id: "reading_star", name: "Reading Star", icon: "⭐", desc: "Finish 1 Reading lesson", condition: (s) => s.subjectLessons.reading >= 1 },
  { id: "science_detective", name: "Science Detective", icon: "🔬", desc: "Finish 1 Science lesson", condition: (s) => s.subjectLessons.science >= 1 },
  { id: "five_stars", name: "Five Star", icon: "🌟", desc: "Earn 5 stars", condition: (s) => s.totalStars >= 5 },
  { id: "hard_worker", name: "Hard Worker", icon: "💪", desc: "Complete 3 lessons", condition: (s) => s.lessonsCompleted >= 3 },
  { id: "math_master", name: "Math Master", icon: "👑", desc: "Finish 3 Math lessons", condition: (s) => s.subjectLessons.math >= 3 },
  { id: "word_wizard", name: "Word Wizard", icon: "🧙", desc: "Finish 3 Reading lessons", condition: (s) => s.subjectLessons.reading >= 3 },
  { id: "science_guru", name: "Science Guru", icon: "🌍", desc: "Finish 3 Science lessons", condition: (s) => s.subjectLessons.science >= 3 },
  { id: "perfect_score", name: "Perfect Score!", icon: "💯", desc: "Get 3/3 correct in one lesson", condition: (s) => s.perfectLessons >= 1 },
  { id: "ten_stars", name: "Ten Star Club", icon: "🎖️", desc: "Earn 10 stars", condition: (s) => s.totalStars >= 10 },
  { id: "all_subjects", name: "All-Rounder", icon: "🏆", desc: "Try all 3 subjects", condition: (s) => s.subjectLessons.math >= 1 && s.subjectLessons.reading >= 1 && s.subjectLessons.science >= 1 }
];

