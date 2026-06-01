 
// Load libraries
const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// ============================
// DOM Elements
// ============================
const drawer = document.getElementById('drawer');
const drawerToggle = document.getElementById('drawer-toggle');
const drawerClose = document.getElementById('drawer-close');
const drawerOverlay = document.getElementById('drawer-overlay');
const drawerLinks = document.querySelectorAll('.drawer-link');
const pageDots = document.querySelectorAll('.page-dot');

// Practice page elements
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const searchResults = document.getElementById('search-results');
const searchResultsList = document.getElementById('search-results-list');
const searchPronunciation = document.getElementById('search-pronunciation');
const searchWord = document.getElementById('search-word');
const searchPos = document.getElementById('search-pos');
const searchMeaning = document.getElementById('search-meaning');
const searchPhonetic = document.getElementById('search-phonetic');
const searchSyllables = document.getElementById('search-syllables');
const searchTense = document.getElementById('search-tense');
const searchHearBtn = document.getElementById('search-hear-btn');
const searchFormsContainer = document.getElementById('search-forms-container');
const searchForms = document.getElementById('search-forms');
const practiceWordBtn = document.getElementById('practice-word-btn');
const cameraBtn = document.getElementById('camera-btn');
const video = document.getElementById('video');
const videoPlaceholder = document.getElementById('video-placeholder');
const mouthCanvas = document.getElementById('mouth-canvas');
const lipsStatus = document.getElementById('lips-status');
const targetWord = document.getElementById('target-word');
const speechBtn = document.getElementById('speech-btn');
const transcriptBox = document.getElementById('transcript-box');
const transcript = document.getElementById('transcript');
const feedbackMsg = document.getElementById('feedback-msg');
const speechResultBar = document.getElementById('speech-result-bar');
const faceError = document.getElementById('face-error');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');


// Test page elements
const quizText = document.getElementById('quiz-text');
const quizOptions = document.getElementById('quiz-options');
const quizFeedback = document.getElementById('quiz-feedback');
const backPracticeBtn = document.getElementById('back-practice-btn');
const nextQuestionBtn = document.getElementById('next-question-btn');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const quizScoreSection = document.getElementById('quiz-score-section');
const finalScore = document.getElementById('final-score');
const restartQuizBtn = document.getElementById('restart-quiz-btn');

// Spelling page elements
const spellingWordTitle = document.getElementById('spelling-word-title');
const spellingPhoneticDisplay = document.getElementById('spelling-phonetic-display');
const spellingBreakdown = document.getElementById('spelling-breakdown');
const spellingInput = document.getElementById('spelling-input');
const spellingCheckBtn = document.getElementById('spelling-check-btn');
const spellingFeedback = document.getElementById('spelling-feedback');
const spellingPrevBtn = document.getElementById('spelling-prev-btn');
const spellingNextBtn = document.getElementById('spelling-next-btn');

// How to Say page elements
const howtoSearchInput = document.getElementById('howto-search-input');
const howtoSearchBtn = document.getElementById('howto-search-btn');
const howtoResults = document.getElementById('howto-results');
const howtoWord = document.getElementById('howto-word');
const howtoPhonetic = document.getElementById('howto-phonetic');
const howtoGuidelines = document.getElementById('howto-guidelines');
const howtoExamples = document.getElementById('howto-examples');
const howtoTips = document.getElementById('howto-tips');
const howtoError = document.getElementById('howto-error');

// Suggestion elements
const searchSuggestions = document.getElementById('search-suggestions');
const howtoSuggestions = document.getElementById('howto-suggestions');

// ============================
// State
// ============================
let currentPage = 'practice';
let currentWordIndex = 0;
let isRecording = false;
let recognition;
let videoStream;
let isCameraOn = false;
let quizIndex = 0;
let quizScore = 0;
let quizTotal = 10;
let quizAnswered = false;
let detectionInterval = null;
let isFaceApiReady = false;
let currentTargetWord = null;
let currentHowtoWord = null;
let spellingWordIndex = 0;

// ============================
// Words data with extended info
// ============================
const words = [
  { word: 'hello', phonetic: '/həˈləʊ/', tip: 'Stress on the second syllable: he-LLO' },
  { word: 'world', phonetic: '/wɜːld/', tip: 'Round your lips for the "w", then open for "ɜː"' },
  { word: 'practice', phonetic: '/ˈpræktɪs/', tip: 'Stress on first syllable: PRAK-tis' },
  { word: 'language', phonetic: '/ˈlæŋɡwɪdʒ/', tip: 'The "ng" sound is nasal, followed by a "gw"' },
  { word: 'communication', phonetic: '/kəˌmjuːnɪˈkeɪʃən/', tip: 'Four syllables with stress on "KAY"' },
  { word: 'pronunciation', phonetic: '/prəˌnʌnsiˈeɪʃən/', tip: 'Note: pro-NUN-see-AY-shun, not "pro-NOUN-ciation"' },
  { word: 'vocabulary', phonetic: '/vəʊˈkæbjʊləri/', tip: 'Stress on second syllable: vo-KAB-yoo-luh-ree' },
  { word: 'technology', phonetic: '/tɛkˈnɒlədʒi/', tip: 'Stress on second syllable: tek-NOL-uh-jee' },
  { word: 'development', phonetic: '/dɪˈvɛləpmənt/', tip: 'Stress on second syllable: di-VEL-up-ment' },
  { word: 'education', phonetic: '/ˌɛdʒʊˈkeɪʃən/', tip: 'Stress on third syllable: ed-yoo-KAY-shun' },
  { word: 'computer', phonetic: '/kəmˈpjuːtə/', tip: 'Stress on second syllable: kum-PYOO-tuh' },
  { word: 'conversation', phonetic: '/ˌkɒnvəˈseɪʃən/', tip: 'Stress on third syllable: kon-vuh-SAY-shun' },
  { word: 'experience', phonetic: '/ɪkˈspɪərɪəns/', tip: 'Stress on second syllable: ik-SPEER-ee-uns' },
  { word: 'knowledge', phonetic: '/ˈnɒlɪdʒ/', tip: 'The "k" is silent: NOL-ij' },
  { word: 'information', phonetic: '/ˌɪnfəˈmeɪʃən/', tip: 'Stress on third syllable: in-fuh-MAY-shun' },
  { word: 'sentence', phonetic: '/ˈsɛntəns/', tip: 'Stress on first syllable: SEN-tuns' },
  { word: 'example', phonetic: '/ɪɡˈzɑːmpəl/', tip: 'Stress on second syllable: ig-ZAHM-pul' },
  { word: 'interest', phonetic: '/ˈɪntrəst/', tip: 'Often reduced to 2 syllables: IN-trest' },
  { word: 'important', phonetic: '/ɪmˈpɔːtənt/', tip: 'Stress on second syllable: im-POR-tunt' },
  { word: 'beautiful', phonetic: '/ˈbjuːtɪfəl/', tip: 'Stress on first syllable: BYOO-tih-ful' },
  { word: 'difficult', phonetic: '/ˈdɪfɪkəlt/', tip: 'Stress on first syllable: DIF-ih-kult' },
  { word: 'different', phonetic: '/ˈdɪfrənt/', tip: 'Often reduced to 2 syllables: DIF-rent' },
  { word: 'between', phonetic: '/bɪˈtwiːn/', tip: 'Stress on second syllable: bi-TWEEN' },
  { word: 'children', phonetic: '/ˈtʃɪldrən/', tip: 'The "ch" sounds like in "church": CHIL-dren' },
  { word: 'history', phonetic: '/ˈhɪstəri/', tip: 'Stress on first syllable: HIS-tuh-ree' },
  { word: 'government', phonetic: '/ˈɡʌvənmənt/', tip: 'Often reduced: GUV-un-ment (middle syllable is soft)' },
  { word: 'system', phonetic: '/ˈsɪstəm/', tip: 'Stress on first syllable: SIS-tum' },
  { word: 'problem', phonetic: '/ˈprɒbləm/', tip: 'Stress on first syllable: PROB-lum' },
  { word: 'culture', phonetic: '/ˈkʌltʃə/', tip: 'The "tu" becomes "chuh": KUL-chuh' },
  { word: 'research', phonetic: '/rɪˈsɜːtʃ/', tip: 'Stress on second syllable in British English: ri-SURCH' },
  { word: 'discussion', phonetic: '/dɪˈskʌʃən/', tip: 'Stress on second syllable: di-SKUSH-un' },
  { word: 'British', phonetic: '/ˈbrɪtɪʃ/', tip: 'Stress on first syllable: BRIT-ish' },
  { word: 'running', phonetic: '/ˈrʌnɪŋ/', tip: 'Present participle of "run": RUN-ning' },
  { word: 'walked', phonetic: '/wɔːkt/', tip: 'Past tense of "walk", the -ed sounds like "t"' },
  { word: 'played', phonetic: '/pleɪd/', tip: 'Past tense of "play", the -ed sounds like "d"' },
  { word: 'wanted', phonetic: '/ˈwɒntɪd/', tip: 'Past tense of "want", the -ed sounds like "id"' },
  { word: 'teaching', phonetic: '/ˈtiːtʃɪŋ/', tip: 'Present participle of "teach": TEE-ching' },
  { word: 'happily', phonetic: '/ˈhæpɪli/', tip: 'Adverb from "happy": HAP-ih-lee' },
  { word: 'carefully', phonetic: '/ˈkɛəfəli/', tip: 'Adverb from "careful": KAIR-fuh-lee' },
  { word: 'quickly', phonetic: '/ˈkwɪkli/', tip: 'Adverb from "quick": KWIK-lee' }
];

const testWords = [
  { word: 'querulous', phonetic: '/ˈkwɛrʊləs/' },
  { word: 'attenuate', phonetic: '/əˈtɛnjuːeɪt/' },
  { word: 'ascetic', phonetic: '/əˈsɛtɪk/' },
  { word: 'obdurate', phonetic: '/ˈɒbdjʊrət/' },
  { word: 'extenuate', phonetic: '/ɪksˈtɛnjuːeɪt/' },
  { word: 'peripatetic', phonetic: '/ˌpɛrɪpəˈtɛtɪk/' },
  { word: 'accurate', phonetic: '/ˈækjʊrət/' },
  { word: 'infatuate', phonetic: '/ɪnˈfætʃuːeɪt/' },
  { word: 'dialectics', phonetic: '/ˌdaɪəˈlɛktɪks/' },
  { word: 'disparate', phonetic: '/ˈdɪspərət/' },
  { word: 'perpetuate', phonetic: '/pəˈpɛtʃuːeɪt/' },
  { word: 'mnemonics', phonetic: '/nɪˈmɒnɪks/' },
  { word: 'desperate', phonetic: '/ˈdɛspərət/' },
  { word: 'effectuate', phonetic: '/ɪˈfɛktʃuːeɪt/' },
  { word: 'informatics', phonetic: '/ˌɪnfəˈmætɪks/' },
  { word: 'corporate', phonetic: '/ˈkɔːpərət/' },
  { word: 'punctuate', phonetic: '/ˈpʌŋktʃuːeɪt/' },
  { word: 'telematics', phonetic: '/ˌtɛlɪˈmætɪks/' },
  { word: 'moderate', phonetic: '/ˈmɒdərət/' },
  { word: 'dynamics', phonetic: '/daɪˈnæmɪks/' }
];

// Sound guide for letters
const letterSounds = {
  'a': '/eɪ/ or /æ/',
  'b': '/biː/',
  'c': '/siː/ or /k/',
  'd': '/diː/',
  'e': '/iː/ or /ɛ/',
  'f': '/ɛf/',
  'g': '/dʒiː/ or /ɡ/',
  'h': '/eɪtʃ/',
  'i': '/aɪ/ or /ɪ/',
  'j': '/dʒeɪ/',
  'k': '/keɪ/',
  'l': '/ɛl/',
  'm': '/ɛm/',
  'n': '/ɛn/',
  'o': '/əʊ/ or /ɒ/',
  'p': '/piː/',
  'q': '/kjuː/',
  'r': '/ɑː/',
  's': '/ɛs/',
  't': '/tiː/',
  'u': '/juː/ or /ʌ/',
  'v': '/viː/',
  'w': '/ˈdʌbljuː/',
  'x': '/ɛks/',
  'y': '/waɪ/',
  'z': '/zɛd/'
};

// ============================
// Initialize
// ============================
async function init() {
  await loadScript('https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js');
  console.log('Face-api loaded');
  setupEventListeners();
  switchPage('practice');
  setupSpeechRecognition();
  updatePracticeWord();
  console.log('App initialized');
}

// ============================
// Event Listeners
// ============================
function setupEventListeners() {
  // Drawer
  if (drawerToggle) {
    drawerToggle.addEventListener('click', () => {
      drawer.classList.remove('hidden');
      drawerOverlay.classList.remove('hidden');
    });
  }

  if (drawerClose) {
    drawerClose.addEventListener('click', closeDrawer);
  }

  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', closeDrawer);
  }

  if (drawerLinks) {
    drawerLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const page = e.currentTarget.dataset.page;
        if (page) {
          switchPage(page);
        }
        closeDrawer();
      });
    });
  }

  // Page dots
  pageDots.forEach(dot => {
    dot.addEventListener('click', () => switchPage(dot.dataset.page));
  });

  // Practice page - Search
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSearch();
        hideSuggestions(searchSuggestions);
      }
    });
    searchInput.addEventListener('input', () => {
      showSuggestions(searchInput, searchSuggestions, (word) => {
        searchInput.value = word;
        hideSuggestions(searchSuggestions);
        handleSearch();
      });
    });
    // Hide suggestions on blur (with delay for click)
    searchInput.addEventListener('blur', () => setTimeout(() => hideSuggestions(searchSuggestions), 200));
  }
  if (searchBtn) {
    searchBtn.addEventListener('click', handleSearch);
  }
  if (practiceWordBtn) {
    practiceWordBtn.addEventListener('click', () => {
      if (currentTargetWord) {
        updateTargetWord();
        const wordEl = document.getElementById('word');
        const phoneticsEl = document.getElementById('phonetics');
        const tipEl = document.getElementById('tip');
        if (wordEl) wordEl.textContent = currentTargetWord.word;
        if (phoneticsEl) phoneticsEl.textContent = currentTargetWord.phonetic;
        if (tipEl) tipEl.textContent = 'Practicing searched word';
        if (feedbackMsg) feedbackMsg.textContent = '';
        if (transcriptBox) transcriptBox.classList.add('hidden');
        
        if (!isCameraOn) toggleCamera();
      }
    });
  }

  // Practice - Camera & Speech
  if (cameraBtn) cameraBtn.addEventListener('click', toggleCamera);
  if (speechBtn) speechBtn.addEventListener('click', toggleRecording);
  if (prevBtn) prevBtn.addEventListener('click', () => {
    currentWordIndex = (currentWordIndex - 1 + words.length) % words.length;
    updatePracticeWord();
  });
  if (nextBtn) nextBtn.addEventListener('click', () => {
    currentWordIndex = (currentWordIndex + 1) % words.length;
    updatePracticeWord();
  });

  // Test page
  if (backPracticeBtn) backPracticeBtn.addEventListener('click', () => switchPage('practice'));
  if (nextQuestionBtn) {
    nextQuestionBtn.addEventListener('click', () => {
      quizIndex++;
      if (quizIndex >= quizTotal) {
        showQuizScore();
      } else {
        loadQuizQuestion();
      }
    });
  }
  if (restartQuizBtn) {
    restartQuizBtn.addEventListener('click', () => {
      quizScoreSection.classList.add('hidden');
      startQuiz();
    });
  }

  // Spelling page
  if (spellingCheckBtn) spellingCheckBtn.addEventListener('click', checkSpelling);
  if (spellingInput) {
    spellingInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') checkSpelling();
    });
  }
  if (spellingPrevBtn) spellingPrevBtn.addEventListener('click', () => {
    spellingWordIndex = (spellingWordIndex - 1 + words.length) % words.length;
    updateSpellingWord();
  });
  if (spellingNextBtn) spellingNextBtn.addEventListener('click', () => {
    spellingWordIndex = (spellingWordIndex + 1) % words.length;
    updateSpellingWord();
  });

  // How to Say page
  if (howtoSearchInput) {
    howtoSearchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleHowtoSearch();
        hideSuggestions(howtoSuggestions);
      }
    });
    howtoSearchInput.addEventListener('input', () => {
      showSuggestions(howtoSearchInput, howtoSuggestions, (word) => {
        howtoSearchInput.value = word;
        hideSuggestions(howtoSuggestions);
        handleHowtoSearch();
      });
    });
    howtoSearchInput.addEventListener('blur', () => setTimeout(() => hideSuggestions(howtoSuggestions), 200));
  }
  if (howtoSearchBtn) howtoSearchBtn.addEventListener('click', handleHowtoSearch);
}

function closeDrawer() {
  drawer.classList.add('hidden');
  drawerOverlay.classList.add('hidden');
}

// ============================
// Page Switching
// ============================
function switchPage(page) {
  currentPage = page;
  document.querySelectorAll('.page-content').forEach(p => p.classList.add('hidden'));
  const targetPage = document.getElementById(`${page}-page`);
  if (targetPage) {
    targetPage.classList.remove('hidden');
  }
  pageDots.forEach(dot => {
    dot.classList.toggle('active', dot.dataset.page === page);
  });
  drawerLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.page === page);
  });
  if (page === 'test') startQuiz();
  if (page === 'spelling') updateSpellingWord();
}

// ============================
// Practice Page Functions
// ============================
function updatePracticeWord() {
  const wordData = words[currentWordIndex];
  const wordEl = document.getElementById('word');
  const phoneticsEl = document.getElementById('phonetics');
  const tipEl = document.getElementById('tip');
  if (wordEl) wordEl.textContent = wordData.word;
  if (phoneticsEl) phoneticsEl.textContent = wordData.phonetic;
  if (tipEl) tipEl.textContent = wordData.tip || '';
  if (targetWord) {
    targetWord.innerHTML = `${wordData.word} <span class="target-phonetic" style="font-size:0.8em;opacity:0.8;margin-left:0.5rem;">${wordData.phonetic}</span>`;
  }
  if (feedbackMsg) feedbackMsg.textContent = '';
  if (transcriptBox) transcriptBox.classList.add('hidden');
}

async function handleSearch() {
  const query = searchInput.value.trim().toLowerCase();
  if (query.length < 2) return;

  // Show loading
  if (searchResults) {
    searchResults.classList.remove('hidden');
    searchResultsList.innerHTML = '<div class="search-result" style="color:var(--azure-400);">🔍 Searching...</div>';
  }

  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`);
    const data = await response.json();

    if (data && data[0]) {
      const wordData = data[0];
      const phonetic = wordData.phonetics?.find(p => p.text)?.text || wordData.phonetic || 'N/A';

      // Collect all meanings
      const allMeanings = [];
      const wordFormsList = [];

      if (wordData.meanings) {
        wordData.meanings.forEach(m => {
          const pos = m.partOfSpeech;
          if (m.definitions && m.definitions[0]) {
            allMeanings.push({ pos, definition: m.definitions[0].definition });
          }

          // Detect word form/tense
          const form = detectWordForm(query, pos);
          if (form) {
            wordFormsList.push({ type: pos, form: form });
          }

          // Add synonyms as word forms if they exist
          if (m.definitions && m.definitions[0] && m.definitions[0].synonyms) {
            m.definitions[0].synonyms.slice(0, 3).forEach(syn => {
              wordFormsList.push({ type: 'synonym', form: syn });
            });
          }
        });
      }

      const mainMeaning = allMeanings[0] || { pos: 'unknown', definition: 'No meaning available.' };
      const tense = detectTense(query, mainMeaning.pos);
      const syllables = syllabicateWord(query);

      showSearchResult(query, phonetic, mainMeaning.definition, mainMeaning.pos, syllables, tense, wordFormsList, allMeanings);
    } else {
      showSearchError('No results found. Try another word.');
    }
  } catch (err) {
    console.error('Search error:', err);
    showSearchError('Error searching word. Please try again.');
  }
}

function detectWordForm(word, partOfSpeech) {
  const w = word.toLowerCase();
  if (partOfSpeech === 'verb') {
    if (w.endsWith('ed')) return 'Past tense';
    if (w.endsWith('ing')) return 'Present participle / Gerund';
    if (w.endsWith('s') || w.endsWith('es')) return 'Third person singular';
    return 'Base form / Infinitive';
  }
  if (partOfSpeech === 'adjective') {
    if (w.endsWith('er')) return 'Comparative adjective';
    if (w.endsWith('est')) return 'Superlative adjective';
    if (w.endsWith('ful')) return 'Adjective (suffix: -ful)';
    if (w.endsWith('less')) return 'Adjective (suffix: -less)';
    if (w.endsWith('ous')) return 'Adjective (suffix: -ous)';
    if (w.endsWith('ive')) return 'Adjective (suffix: -ive)';
    if (w.endsWith('able') || w.endsWith('ible')) return 'Adjective (suffix: -able/-ible)';
    return 'Adjective';
  }
  if (partOfSpeech === 'adverb') {
    if (w.endsWith('ly')) return 'Adverb (suffix: -ly)';
    return 'Adverb';
  }
  if (partOfSpeech === 'noun') {
    if (w.endsWith('tion') || w.endsWith('sion')) return 'Noun (suffix: -tion/-sion)';
    if (w.endsWith('ment')) return 'Noun (suffix: -ment)';
    if (w.endsWith('ness')) return 'Noun (suffix: -ness)';
    if (w.endsWith('er') || w.endsWith('or')) return 'Agent noun (doer)';
    if (w.endsWith('ist')) return 'Noun (practitioner)';
    if (w.endsWith('s') || w.endsWith('es')) return 'Plural noun';
    return 'Noun';
  }
  return partOfSpeech;
}

function detectTense(word, partOfSpeech) {
  const w = word.toLowerCase();
  if (partOfSpeech === 'verb') {
    if (w.endsWith('ed')) return 'Past tense / Past participle';
    if (w.endsWith('ing')) return 'Present participle / Gerund';
    if (w.endsWith('s') || w.endsWith('es')) return 'Third person singular present';
    return 'Present / Base form';
  }
  if (partOfSpeech === 'adjective') return 'Adjective form';
  if (partOfSpeech === 'adverb') return 'Adverb form';
  if (partOfSpeech === 'noun') return 'Noun form';
  return partOfSpeech || 'N/A';
}

function syllabicateWord(word) {
  const vowels = 'aeiouy';
  let syllables = [];
  let current = '';
  for (let i = 0; i < word.length; i++) {
    current += word[i];
    if (vowels.includes(word[i].toLowerCase()) && (i === word.length - 1 || !vowels.includes(word[i + 1]?.toLowerCase()))) {
      syllables.push(current);
      current = '';
    }
  }
  if (current) {
    if (syllables.length > 0) {
      syllables[syllables.length - 1] += current;
    } else {
      syllables.push(current);
    }
  }
  return syllables.join(' · ');
}

function showSearchResult(word, phonetic, meaning, pos, syllables, tense, wordForms, allMeanings) {
  if (searchResults) {
    searchResults.classList.remove('hidden');
    searchResultsList.innerHTML = `<div class="search-result" style="color:var(--success);">✅ Word found: "${word}"</div>`;
  }
  if (searchWord) searchWord.textContent = word;
  if (searchPos) searchPos.textContent = pos;
  if (searchMeaning) searchMeaning.textContent = meaning;
  if (searchPhonetic) searchPhonetic.textContent = phonetic;
  if (searchSyllables) searchSyllables.textContent = syllables;
  if (searchTense) searchTense.textContent = tense;

  // Show word forms
  if (wordForms && wordForms.length > 0 && searchFormsContainer && searchForms) {
    searchFormsContainer.classList.remove('hidden');
    searchForms.innerHTML = wordForms.map(f =>
      `<span class="word-form-tag"><span class="form-type">${f.type}</span> ${f.form}</span>`
    ).join('');
  } else if (searchFormsContainer) {
    searchFormsContainer.classList.add('hidden');
  }

  // Show all meanings if multiple
  if (allMeanings && allMeanings.length > 1 && searchMeaning) {
    searchMeaning.innerHTML = allMeanings.map((m, i) =>
      `<div style="margin-bottom:0.3rem;"><strong style="color:var(--azure-400);">${m.pos}:</strong> ${m.definition}</div>`
    ).join('');
  }

  if (searchPronunciation) searchPronunciation.classList.remove('hidden');
  currentTargetWord = { word, phonetic, meaning, pos, syllables, tense };
}

function showSearchError(message) {
  if (searchResults) {
    searchResults.classList.remove('hidden');
    searchResultsList.innerHTML = `<div class="search-result" style="color:var(--warning);">⚠️ ${message}</div>`;
  }
  if (searchPronunciation) searchPronunciation.classList.add('hidden');
  currentTargetWord = null;
}

// ============================
// Camera & Face Detection
// ============================
async function toggleCamera() {
  if (isCameraOn) {
    stopCamera();
  } else {
    await startCamera();
  }
}

async function startCamera() {
  try {
    await loadFaceApiModels();
    videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = videoStream;
    video.classList.add('active');
    video.classList.remove('hidden');
    videoPlaceholder.classList.add('hidden');
    if (faceError) faceError.textContent = '';
    if (lipsStatus) lipsStatus.classList.remove('hidden');
    isCameraOn = true;
    cameraBtn.textContent = 'Stop lip tracking';
    detectFaces();
  } catch (err) {
    console.error('Camera error:', err);
    let message = 'Camera error occurred.';
    if (err.name === 'NotAllowedError') {
      message = 'Camera access denied. Please allow camera access in your browser settings.';
    } else if (err.name === 'NotFoundError') {
      message = 'No camera found. Please connect a camera device.';
    } else if (err.name === 'NotReadableError') {
      message = 'Camera is already in use by another application.';
    } else if (err.name === 'OverconstrainedError') {
      message = 'Camera constraints not supported.';
    } else {
      message = `Camera error: ${err.message}`;
    }
    if (faceError) faceError.textContent = message;
    if (lipsStatus) lipsStatus.classList.add('hidden');
  }
}

function stopCamera() {
  if (videoStream) {
    videoStream.getTracks().forEach(track => track.stop());
  }
  stopDetectionInterval();
  video.classList.remove('active');
  video.classList.add('hidden');
  videoPlaceholder.classList.remove('hidden');
  isCameraOn = false;
  cameraBtn.textContent = 'Start lip tracking';
}

async function loadFaceApiModels() {
  if (isFaceApiReady) return;
  const MODELS_URL = 'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights';
  await faceapi.nets.tinyFaceDetector.loadFromUri(MODELS_URL);
  await faceapi.nets.faceLandmark68Net.loadFromUri(MODELS_URL);
  isFaceApiReady = true;
}

function stopDetectionInterval() {
  if (detectionInterval) {
    clearInterval(detectionInterval);
    detectionInterval = null;
  }
}

async function detectFaces() {
  if (!video || !mouthCanvas) return;
  await new Promise(resolve => {
    if (video.readyState >= 2) resolve();
    else video.onloadedmetadata = () => resolve();
  });

  const displaySize = { width: video.videoWidth, height: video.videoHeight };
  mouthCanvas.width = video.videoWidth;
  mouthCanvas.height = video.videoHeight;

  stopDetectionInterval();
  detectionInterval = setInterval(async () => {
    if (!isCameraOn) return;
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    const ctx = mouthCanvas.getContext('2d');
    ctx.clearRect(0, 0, mouthCanvas.width, mouthCanvas.height);
    ctx.fillStyle = 'rgba(8, 24, 64, 0.75)';
    ctx.fillRect(0, 0, mouthCanvas.width, mouthCanvas.height);

    const pulse = (Math.sin(Date.now() / 220) + 1) / 2;
    const activeStroke = `rgba(126, 221, 255, ${0.7 + pulse * 0.3})`;
    const activeFill = `rgba(51, 166, 255, ${0.16 + pulse * 0.1})`;

    if (resizedDetections.length === 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.22)';
      ctx.font = '18px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Position your face in the camera frame', mouthCanvas.width / 2, mouthCanvas.height / 2);
      return;
    }

    resizedDetections.forEach(result => {
      const landmarks = result.landmarks;
      const mouth = landmarks.getMouth();
      const jaw = landmarks.getJawOutline();

      ctx.lineWidth = 4;
      ctx.strokeStyle = activeStroke;
      ctx.fillStyle = activeFill;
      ctx.lineJoin = 'round';

      ctx.beginPath();
      jaw.forEach((point, index) => {
        const x = (point.x / video.videoWidth) * mouthCanvas.width;
        const y = (point.y / video.videoHeight) * mouthCanvas.height;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      ctx.beginPath();
      mouth.forEach((point, index) => {
        const x = (point.x / video.videoWidth) * mouthCanvas.width;
        const y = (point.y / video.videoHeight) * mouthCanvas.height;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.closePath();
      ctx.stroke();
      ctx.fill();

      ctx.fillStyle = 'rgba(174, 233, 255, 0.95)';
      mouth.forEach(point => {
        const x = (point.x / video.videoWidth) * mouthCanvas.width;
        const y = (point.y / video.videoHeight) * mouthCanvas.height;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    });
  }, 100);
}

//speach
function setupSpeechRecognition() {
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-GB';
    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const result = (finalTranscript || interimTranscript).toLowerCase().trim();
      
      // Determine the current target word (whether from list or practicing a searched word)
      const targetWordElText = document.getElementById('target-word') ? document.getElementById('target-word').innerText : '';
      const target = (currentTargetWord && targetWordElText.includes(currentTargetWord.word)) 
                      ? currentTargetWord 
                      : words[currentWordIndex];

      transcript.innerHTML = `You said: "<strong>${result}</strong>" <span style="font-size: 0.8em; opacity: 0.7; animation: pulse 1s infinite;">(Listening...)</span><br>Target: <strong>${target.word}</strong> ${target.phonetic}`;
      transcriptBox.classList.remove('hidden');
      if (speechResultBar) {
        speechResultBar.classList.remove('hidden');
        speechResultBar.textContent = 'Listening for the correct word...';
        speechResultBar.style.color = 'var(--azure-200)';
      }

      if (finalTranscript) {
        transcript.innerHTML = `You said: "<strong>${finalTranscript.toLowerCase()}</strong>"<br>Target: <strong>${target.word}</strong> ${target.phonetic}`;
        
        // Check pronunciation
        const isCorrect = finalTranscript.toLowerCase().includes(target.word.toLowerCase()) || target.word.toLowerCase().includes(finalTranscript.toLowerCase());
        if (isCorrect) {
          feedbackMsg.textContent = '✅ Correct! Great pronunciation!';
          feedbackMsg.style.color = 'var(--success)';
          if (speechResultBar) {
            speechResultBar.classList.remove('hidden');
            speechResultBar.textContent = `Correct word: ${target.word}`;
            speechResultBar.style.color = 'var(--success)';
          }
        } else {
          feedbackMsg.textContent = `❌ Not quite. The correct word is "${target.word}"`;
          feedbackMsg.style.color = 'var(--danger)';
          if (speechResultBar) {
            speechResultBar.classList.remove('hidden');
            speechResultBar.textContent = `Correct word: ${target.word}`;
            speechResultBar.style.color = 'var(--danger)';
          }
        }
        
        // Auto-stop recording on final result
        toggleRecording();
      } else {
        if (speechResultBar) {
          speechResultBar.classList.add('hidden');
        }
        feedbackMsg.textContent = 'Listening...';
        feedbackMsg.style.color = 'var(--azure-400)';
      }
    };
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      isRecording = false;
      speechBtn.textContent = 'Start recording';
      speechBtn.classList.remove('recording');
      feedbackMsg.textContent = 'Speech recognition error. Please try again.';
      feedbackMsg.style.color = 'var(--danger)';
    };
    recognition.onend = () => {
      isRecording = false;
      speechBtn.textContent = 'Start recording';
      speechBtn.classList.remove('recording');
      if (feedbackMsg.textContent === 'Listening...') {
        feedbackMsg.textContent = '';
      }
      if (speechResultBar) {
        speechResultBar.classList.add('hidden');
      }
    };
  }
}

function toggleRecording() {
  if (!recognition) {
    const feedbackMsg = document.getElementById('feedback-msg');
    if (feedbackMsg) {
      feedbackMsg.textContent = '❌ Speech recognition is not supported in this browser or is blocked. Please try Chrome or Edge.';
      feedbackMsg.style.color = 'var(--danger)';
    }
    return;
  }
  
  if (isRecording) {
    recognition.stop();
    speechBtn.textContent = 'Start recording';
    speechBtn.classList.remove('recording');
    isRecording = false;
  } else {
    try {
      recognition.start();
      speechBtn.textContent = '⏹ Stop recording';
      speechBtn.classList.add('recording');
      isRecording = true;
    } catch (e) {
      console.error('Recording start error', e);
      const feedbackMsg = document.getElementById('feedback-msg');
      if (feedbackMsg) feedbackMsg.textContent = '❌ Error starting microphone. Check permissions.';
    }
  }
}


// Audio functions disabled - Text descriptions and phonetic guides provided instead
function getBritishVoice() {
  return null; // Audio disabled
}

function speakWord(word, onEndCallback = null) {
  // Audio disabled - using text descriptions and phonetic guides instead
  if (onEndCallback) onEndCallback();
}

function speakWordSlow(word) {
  // Audio disabled - using text descriptions instead
}

function updateTargetWord() {
  const target = (currentTargetWord) ? currentTargetWord : words[currentWordIndex];
  if (targetWord) {
    targetWord.innerHTML = `${target.word} <span style="font-size:0.8em;opacity:0.8;margin-left:0.5rem;">${target.phonetic}</span>`;
  }
}

// SPELLING PAGE

function updateSpellingWord() {
  const wordData = words[spellingWordIndex];
  if (spellingWordTitle) spellingWordTitle.textContent = wordData.word;
  if (spellingPhoneticDisplay) spellingPhoneticDisplay.textContent = wordData.phonetic;
  if (spellingInput) spellingInput.value = '';
  if (spellingFeedback) {
    spellingFeedback.textContent = '';
    spellingFeedback.className = 'spelling-feedback';
  }

  // Build letter breakdown
  if (spellingBreakdown) {
    const letters = wordData.word.split('');
    spellingBreakdown.innerHTML = `
      <p class="breakdown-title">🔤 Letter Breakdown</p>
      <div class="letter-breakdown">
        ${letters.map((letter, i) => `
          <div class="letter-box" style="animation-delay:${i * 0.05}s;">
            <span class="letter-char">${letter}</span>
            <span class="letter-sound">${letterSounds[letter.toLowerCase()] || ''}</span>
          </div>
        `).join('')}
      </div>
    `;
  }
}

// Letter sounds reference - no audio playback

function checkSpelling() {
  const input = spellingInput.value.trim().toLowerCase();
  const correct = words[spellingWordIndex].word;

  if (!input) return;

  if (input === correct) {
    spellingFeedback.textContent = '✅ Correct! Perfect spelling!';
    spellingFeedback.className = 'spelling-feedback correct';
  } else {
    // Show which letters are wrong
    let comparison = '';
    for (let i = 0; i < Math.max(input.length, correct.length); i++) {
      if (i < correct.length && i < input.length) {
        if (input[i] === correct[i]) {
          comparison += `<span style="color:var(--success);">${correct[i]}</span>`;
        } else {
          comparison += `<span style="color:var(--danger);text-decoration:underline;">${correct[i]}</span>`;
        }
      } else if (i < correct.length) {
        comparison += `<span style="color:var(--warning);">${correct[i]}</span>`;
      }
    }
    spellingFeedback.innerHTML = `❌ Incorrect. Correct spelling: <strong style="font-size:1.2em;letter-spacing:0.1em;">${comparison}</strong>`;
    spellingFeedback.className = 'spelling-feedback incorrect';
  }
}

// ============================
// TEST PAGE
// ============================
function startQuiz() {
  quizIndex = 0;
  quizScore = 0;
  quizTotal = testWords.length;
  quizAnswered = false;
  if (quizScoreSection) quizScoreSection.classList.add('hidden');
  loadQuizQuestion();
}

function loadQuizQuestion() {
  quizAnswered = false;
  const wordIdx = quizIndex % testWords.length;
  const word = testWords[wordIdx];

  if (quizText) quizText.textContent = `What is the phonetic transcription of "${word.word}"?`;

  // Generate options
  const options = [word.phonetic];
  const usedIndices = new Set([wordIdx]);
  while (options.length < 4) {
    const randomIdx = Math.floor(Math.random() * testWords.length);
    if (!usedIndices.has(randomIdx) && !options.includes(testWords[randomIdx].phonetic)) {
      options.push(testWords[randomIdx].phonetic);
      usedIndices.add(randomIdx);
    }
  }
  options.sort(() => Math.random() - 0.5);

  if (quizOptions) {
    quizOptions.innerHTML = options.map(opt =>
      `<button class="quiz-option btn" data-phonetic="${opt}">${opt}</button>`
    ).join('');

    document.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => selectQuizOption(btn));
    });
  }

  if (quizFeedback) {
    quizFeedback.textContent = '';
    quizFeedback.className = 'quiz-feedback';
  }
  if (nextQuestionBtn) nextQuestionBtn.classList.add('hidden');

  // Update progress
  updateQuizProgress();
}

function selectQuizOption(selectedBtn) {
  if (quizAnswered) return;
  quizAnswered = true;

  const wordIdx = quizIndex % testWords.length;
  const correct = testWords[wordIdx].phonetic;
  const selected = selectedBtn.dataset.phonetic;

  // Disable all options
  document.querySelectorAll('.quiz-option').forEach(btn => {
    btn.disabled = true;
    if (btn.dataset.phonetic === correct) {
      btn.classList.add('correct');
    }
  });

  if (selected === correct) {
    quizScore++;
    selectedBtn.classList.add('correct');
    quizFeedback.textContent = '✅ Correct! Well done!';
    quizFeedback.className = 'quiz-feedback correct';
  } else {
    selectedBtn.classList.add('wrong');
    quizFeedback.innerHTML = `❌ Wrong! The correct answer is: <strong>${correct}</strong>`;
    quizFeedback.className = 'quiz-feedback wrong';
  }

  // Show next button
  if (nextQuestionBtn) nextQuestionBtn.classList.remove('hidden');
}

function updateQuizProgress() {
  const percent = ((quizIndex) / quizTotal) * 100;
  if (progressFill) progressFill.style.width = `${Math.max(percent, 5)}%`;
  if (progressText) progressText.textContent = `Question ${quizIndex + 1} / ${quizTotal}`;
}

function showQuizScore() {
  if (quizScoreSection) {
    quizScoreSection.classList.remove('hidden');
    const percentage = Math.round((quizScore / quizTotal) * 100);
    let emoji = '🎉';
    if (percentage < 50) emoji = '📖';
    else if (percentage < 80) emoji = '👍';
    finalScore.innerHTML = `${emoji} ${quizScore} / ${quizTotal}<br><span style="font-size:0.5em;color:var(--celestial);">${percentage}% correct</span>`;
  }
  if (quizOptions) quizOptions.innerHTML = '';
  if (quizText) quizText.textContent = '';
  if (quizFeedback) {
    quizFeedback.textContent = '';
    quizFeedback.className = 'quiz-feedback';
  }
  if (nextQuestionBtn) nextQuestionBtn.classList.add('hidden');
  if (progressFill) progressFill.style.width = '100%';
  if (progressText) progressText.textContent = `Completed!`;
}

// ============================
// HOW TO SAY PAGE
// ============================
async function handleHowtoSearch() {
  const query = howtoSearchInput.value.trim().toLowerCase();
  if (query.length < 2) return;

  if (howtoResults) howtoResults.classList.add('hidden');
  if (howtoError) {
    howtoError.classList.remove('hidden');
    howtoError.innerHTML = '<span style="color:var(--azure-400);">🔍 Searching pronunciation guidelines...</span>';
  }

  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`);
    const data = await response.json();

    if (data && data[0]) {
      const wordData = data[0];
      const phonetic = wordData.phonetics?.find(p => p.text)?.text || wordData.phonetic || 'N/A';
      currentHowtoWord = query;

      if (howtoWord) howtoWord.textContent = query;
      if (howtoPhonetic) howtoPhonetic.textContent = phonetic;

      // Generate pronunciation guidelines
      const guidelines = generatePronunciationGuidelines(query, phonetic, wordData);
      if (howtoGuidelines) {
        howtoGuidelines.innerHTML = guidelines.map(g =>
          `<div class="guideline-item">${g}</div>`
        ).join('');
      }

      // Generate examples
      const examples = generateExamples(query, wordData);
      if (howtoExamples) {
        howtoExamples.innerHTML = examples.map(e =>
          `<div class="example-item">${e}</div>`
        ).join('');
      }

      // Generate tips
      const tips = generatePracticeTips(query, phonetic);
      if (howtoTips) {
        howtoTips.innerHTML = tips.map(t =>
          `<div class="tip-item">${t}</div>`
        ).join('');
      }

      if (howtoError) howtoError.classList.add('hidden');
      if (howtoResults) howtoResults.classList.remove('hidden');
    } else {
      if (howtoError) {
        howtoError.classList.remove('hidden');
        howtoError.innerHTML = '⚠️ Word not found. Please try another word.';
      }
    }
  } catch (err) {
    console.error('How to Say search error:', err);
    if (howtoError) {
      howtoError.classList.remove('hidden');
      howtoError.innerHTML = '⚠️ Error searching. Please try again.';
    }
  }
}

function generatePronunciationGuidelines(word, phonetic, wordData) {
  const guidelines = [];
  const syllables = syllabicateWord(word);
  guidelines.push(`<strong>Phonetic transcription:</strong> ${phonetic}`);
  guidelines.push(`<strong>Syllable breakdown:</strong> ${syllables} (${syllables.split('·').length} syllable${syllables.split('·').length > 1 ? 's' : ''})`);

  // Stress pattern
  if (word.length > 4) {
    guidelines.push(`<strong>Stress pattern:</strong> Emphasize the syllable with the ˈ mark in the phonetic: ${phonetic}`);
  }

  // Common sounds
  if (word.includes('th')) {
    guidelines.push(`<strong>Note:</strong> "th" can be voiced /ð/ (as in "the") or voiceless /θ/ (as in "think"). Place your tongue between your teeth.`);
  }
  if (word.includes('ough')) {
    guidelines.push(`<strong>Note:</strong> "ough" has many pronunciations in English. Listen carefully to this specific word.`);
  }
  if (word.includes('tion')) {
    guidelines.push(`<strong>Note:</strong> "-tion" is pronounced as /ʃən/ (shun).`);
  }
  if (word.includes('ing')) {
    guidelines.push(`<strong>Note:</strong> "-ing" ending is nasal: /ɪŋ/. Don't pronounce the final 'g'.`);
  }
  if (word.includes('ght')) {
    guidelines.push(`<strong>Note:</strong> "ght" — the 'gh' is silent, only pronounce the 't'.`);
  }

  // Part of speech info
  if (wordData.meanings) {
    const posTypes = wordData.meanings.map(m => m.partOfSpeech).join(', ');
    guidelines.push(`<strong>Used as:</strong> ${posTypes}`);
  }

  return guidelines;
}

function generateExamples(word, wordData) {
  const examples = [];

  if (wordData.meanings) {
    wordData.meanings.forEach(m => {
      if (m.definitions) {
        m.definitions.slice(0, 2).forEach(def => {
          if (def.example) {
            examples.push(`"${def.example}" — <em>(${m.partOfSpeech})</em>`);
          }
        });
      }
    });
  }

  // Fallback examples
  if (examples.length === 0) {
    examples.push(`"I need to practice my ${word}." — Use it in a sentence to reinforce pronunciation.`);
    examples.push(`"The ${word} is very important." — Repeat this sentence focusing on the target word.`);
  }

  return examples;
}

function generatePracticeTips(word, phonetic) {
  const tips = [];
  tips.push(`🎧 Listen to the word multiple times before trying to say it yourself.`);
  tips.push(`🪞 Watch your mouth in a mirror while pronouncing "${word}" — match the phonetic: ${phonetic}`);
  tips.push(`🔄 Practice saying the word slowly first, then speed up gradually.`);

  if (word.length > 6) {
    tips.push(`📝 Break the word into syllables and practice each part separately: ${syllabicateWord(word)}`);
  }

  tips.push(`🎤 Record yourself and compare with the reference audio.`);
  return tips;
}

// ============================
// Search Suggestions System
// ============================
function showSuggestions(inputEl, suggestionsEl, onSelect) {
  if (!suggestionsEl) return;
  const query = inputEl.value.trim().toLowerCase();
  if (query.length < 1) {
    hideSuggestions(suggestionsEl);
    return;
  }

  // Filter words that match the query
  const matches = words.filter(w =>
    w.word.toLowerCase().startsWith(query) ||
    w.word.toLowerCase().includes(query)
  ).slice(0, 8);

  if (matches.length === 0) {
    // Show a "search online" suggestion
    suggestionsEl.innerHTML = `
      <li class="suggestion-item" data-word="${query}">
        <span class="suggestion-word">🔍 Search "${query}" online</span>
        <span class="suggestion-phonetic">press Enter</span>
      </li>
    `;
    suggestionsEl.querySelector('.suggestion-item').addEventListener('click', () => onSelect(query));
    suggestionsEl.classList.remove('hidden');
    return;
  }

  // Sort: starts-with first, then includes
  matches.sort((a, b) => {
    const aStarts = a.word.toLowerCase().startsWith(query) ? 0 : 1;
    const bStarts = b.word.toLowerCase().startsWith(query) ? 0 : 1;
    return aStarts - bStarts;
  });

  suggestionsEl.innerHTML = matches.map(w => `
    <li class="suggestion-item" data-word="${w.word}">
      <span class="suggestion-word">${highlightMatch(w.word, query)}</span>
      <span class="suggestion-phonetic">${w.phonetic}</span>
    </li>
  `).join('');

  // Also add "search online" option at the end
  if (!matches.find(m => m.word.toLowerCase() === query)) {
    suggestionsEl.innerHTML += `
      <li class="suggestion-item" data-word="${query}" style="border-top:1px solid rgba(90,165,255,0.15);">
        <span class="suggestion-word">🔍 Search "${query}" online</span>
        <span class="suggestion-phonetic">dictionary API</span>
      </li>
    `;
  }

  suggestionsEl.querySelectorAll('.suggestion-item').forEach(item => {
    item.addEventListener('click', () => onSelect(item.dataset.word));
  });

  suggestionsEl.classList.remove('hidden');
}

function hideSuggestions(suggestionsEl) {
  if (suggestionsEl) suggestionsEl.classList.add('hidden');
}

function highlightMatch(word, query) {
  const idx = word.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return word;
  const before = word.slice(0, idx);
  const match = word.slice(idx, idx + query.length);
  const after = word.slice(idx + query.length);
  return `${before}<strong style="color:var(--azure-300);">${match}</strong>${after}`;
}

// ============================
// Start the app
// ============================
init();
