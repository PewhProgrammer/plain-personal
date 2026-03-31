// ── Cozy Office - Configuration & Constants ─────────────────────

const ROOM_W = 12;
const ROOM_D = 10;
const WALL_H = 4;

// ── Human positions ───────────────────────────────────────────
const DESK_POS = {
  boy:  { x: 2.6, y: 1.85, z: 0.75 },
  girl: { x: 6.2, y: 0.8, z: 0 },
};
const CHAT_POS = {
  boy:  { x: 4.2, y: 2.8 },
  girl: { x: 5.0, y: 2.8 },
};
const BED_POS = {
  boy:  { x: 9.5, y: 5.5 },
  girl: { x: 9.5, y: 6.3 },
};
const PET_BED_POS = {
  dog:  { x: 8.5, y: 6.0 },
  cat:  { x: 8.3, y: 5.3 },
  frog: { x: 8.5, y: 7.0 },
};
const GAME_POS = {
  boy:  { x: 5.0, y: 5.8 },
  girl: { x: 6.2, y: 4.8 },
};
const BOARDGAME_POS = { x: 5.3, y: 5.0 };
const WORKOUT_POS = { x: 6, y: 5.5 };
const COFFEE_POS = { x: 8.3, y: 0.8 };
const DOOR_POS = { x: 0.5, y: 6.5 };
const BED_SURFACE_Z = 1.28;

// ── Pet config ────────────────────────────────────────────────
const PET_BOUNDS = {
  dog:  { minX: 3, maxX: 9, minY: 4, maxY: 8.5 },
  cat:  { minX: 4, maxX: 10, minY: 4, maxY: 8.5 },
  frog: { minX: 2, maxX: 7, minY: 5, maxY: 8.5 },
};
const PET_SLEEP_SPOTS = {
  dog: { x: 8.5, y: 6.5, z: 0 },
  cat: { x: 7.2, y: 0.5, z: 1.56 },
  frog: { x: 0.2, y: 1.2, z: 0.82 },
};
const PET_INTERACTIONS = [
  { predator: 'cat', prey: 'frog', range: 2.5 },
  { predator: 'dog', prey: 'cat', range: 3.0 },
];
const FEEDING_HOURS = [8, 12, 18];
const FOOD_BOWL_POS = {
  dog: { x: 4.5, y: 8.2 },
  cat: { x: 5.2, y: 8.2 },
  frog: { x: 5.9, y: 8.2 },
};

// ── Dialogue ──────────────────────────────────────────────────
const BOARDGAME_LINES = {
  boy: [
    "Your turn!", "Nice move!", "I'm winning! 🏆", "Hmm... 🤔",
    "Roll the dice! 🎲", "This is fun!", "One more round?",
    "I love game night ❤️", "Nooo my piece!", "Strategic genius 😎",
    "Wait, that's illegal!", "Best 2 out of 3?",
  ],
  girl: [
    "Let me think... 🤔", "Ha, gotcha!", "Not fair! 😤",
    "Popcorn break? 🍿", "I'm catching up!", "Best game ever!",
    "You're going down! 😈", "Yay my turn! 🎉", "So close!",
    "I love this ❤️", "Read the rules again!", "Rematch!",
  ],
};

const COUPLE_CHATS = [
  ["Want some coffee?", "Yes please! ☕"],
  ["You look cute today", "Stop it 😊"],
  ["Pizza tonight?", "Yesss! 🍕"],
  ["Check this Grafana alert", "Your servers ok?"],
  ["My pipeline is green!", "My cells are growing!"],
  ["I love you ❤️", "I love you too 💕"],
  ["Look at the cat!", "So fluffy! 🐱"],
  ["Kubernetes is acting up", "Try restarting pods?"],
  ["How's the experiment?", "Promising results! 🧬"],
  ["Lunch break?", "I'm starving!"],
  ["High five! ✋", "✋ Yeah!"],
  ["AWS bill went up again", "My lab supplies too 😅"],
  ["Snack break!", "Chocolate? 🍫"],
  ["Look at the dog!", "Good boy! 🐕"],
  ["Deploy to prod tonight", "I have a paper to submit"],
  ["Your cells doing ok?", "Viability looks great! 🧫"],
  ["The frog is staring", "He's so funny 🐸"],
  ["New playlist?", "Put it on! 🎵"],
];

const PET_PLAY_LINES = {
  boy: {
    dog:  ["Good boy!", "Fetch the log file!", "Who's a good SRE dog?", "Wanna play?"],
    cat:  ["Pspsps!", "Come here kitty!", "Soft deploy~", "Nice purring!"],
    frog: ["Hey little container!", "Hop hop!", "Cool frog!", "Ribbit ribbit!"],
  },
  girl: {
    dog:  ["Aww puppy! 🐕", "So cute!", "Lab buddy!", "Belly rubs!"],
    cat:  ["Kitty! 🐱", "My lab assistant!", "Purr purr~", "Sweet baby!"],
    frog: ["Little Xenopus! 🐸", "So green!", "Hop for science!", "Model organism!"],
  },
};

// ── Thought bubbles ───────────────────────────────────────────
const BOY_THOUGHTS = [
  "kubectl get pods...",
  "Pipeline is green! 🟢",
  "Who broke the build? 😤",
  "Terraform apply... 🙏",
  "Container OOMKilled again",
  "She's so pretty ❤️",
  "YAML indentation... why",
  "Prometheus alert firing 🔥",
  "Need more coffee...",
  "Helm chart upgrade time",
  "Grafana looks good 📊",
  "Is it Friday yet?",
  "docker compose up -d",
  "The CI/CD is beautiful ✨",
  "AWS bill is HOW much?!",
  "Time for a snack!",
  "chmod 777 everything 😈",
  "It works on my machine!",
  "Rolling back deployment...",
  "Kubernetes is love 🎡",
  "git push --force 💀",
  "Ansible playbook running",
  "Jenkins build #4096...",
  "The pod is CrashLooping",
];

const GIRL_THOUGHTS = [
  "Nextflow pipeline running",
  "DESeq2 results look good!",
  "UMAP looks beautiful! 🧬",
  "Debugging this R script...",
  "p-value < 0.05! ✨",
  "He's so funny 😊",
  "FASTQ quality is clean!",
  "Aligning reads with STAR",
  "Scanpy clustering done!",
  "Coffee break? ☕",
  "Volcano plot looks nice!",
  "PCA clusters nicely!",
  "Snakemake job queued",
  "Need more RAM... 😅",
  "Downloading from NCBI...",
  "Friday plans? 🥳",
  "Heatmap colors on point!",
  "Nature or Science? 🤔",
  "Slurm queue is so long...",
  "Grant proposal due...",
  "Variant calling finished!",
  "This Python script works!",
  "Gene ontology enrichment",
  "Cluster job finished! 🎉",
];

// ── Walk dialogue ────────────────────────────────────────────
const WALK_LEAVE_LINES = [
  "Let's go for a walk! \uD83D\uDC15",
  "Fresh air time! \u2600\uFE0F",
  "Come on buddy! \uD83C\uDF3F",
  "Walk break! \uD83D\uDEB6",
];
const WALK_RETURN_LINES = [
  "Nice walk! \uD83C\uDF3F",
  "That was refreshing! \u2728",
  "Back to work! \uD83D\uDCBB",
  "Good walk! \uD83D\uDC15",
];

// ── Misc constants ────────────────────────────────────────────
const NOTIF_COLORS = ['#F44336', '#2196F3', '#4CAF50', '#FF9800'];
const STICKY_COLORS = ['#FFEB3B', '#FF80AB', '#80D8FF', '#B9F6CA', '#FFD180',
  '#EA80FC', '#FF8A80', '#84FFFF', '#CCFF90', '#FFE57F', '#B388FF', '#FF9E80'];
const CURRENT_MONTH = new Date().getMonth();

function getMoodEmoji() {
  const h = new Date().getHours();
  if (h >= 6 && h < 9) return '\uD83D\uDD25';
  if (h >= 9 && h < 12) return '\uD83D\uDCBB';
  if (h >= 12 && h < 13) return '\uD83C\uDF55';
  if (h >= 13 && h < 16) return '\uD83D\uDE34';
  if (h >= 16 && h < 17) return '\u23F0';
  return '';
}
