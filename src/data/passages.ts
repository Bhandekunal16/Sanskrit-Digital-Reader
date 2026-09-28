export interface PassageWordToken {
  word: string;
  iast: string;
  meaning: string;
  meaningHindi?: string;
  meaningMarathi?: string;
  root?: string;
  rootIast?: string;
  grammar: string;
  partOfSpeech: string;
  sandhiSplit?: string;
  isPunctuation?: boolean;
}

export interface SanskritPassage {
  id: string;
  title: string;
  source: string;
  category: 'wisdom' | 'philosophy' | 'invocation' | 'vedic';
  meter: string;
  lines: string[];
  tokens: PassageWordToken[][]; // per line tokens
  translation: string;
  translationHindi: string;
  translationMarathi: string;
  anvaya: string; // Prose word order
  explanation: string;
}

export const SANSKRIT_PASSAGES: SanskritPassage[] = [
  {
    id: 'vidya-subhashita',
    title: 'On the Fruits of Learning (विद्या-सुभाषितम्)',
    source: 'Hitopadeśa (हितोपदेशः) / Nītiśatakam',
    category: 'wisdom',
    meter: 'Anuṣṭubh (अनुष्टुभ् - 8 syllables per pāda)',
    lines: [
      'विद्या ददाति विनयं विनयाद् याति पात्रताम् ।',
      'पात्रत्वाद् धनमाप्नोति धनाद् धर्मं ततः सुखम् ॥'
    ],
    tokens: [
      [
        { word: 'विद्या', iast: 'vidyā', meaning: 'True knowledge / learning', meaningHindi: 'विद्या, यथार्थ ज्ञान', meaningMarathi: 'विद्या, खरे ज्ञान', root: 'विद्', rootIast: 'vid', grammar: 'Feminine noun, Nom. Sg.', partOfSpeech: 'Noun' },
        { word: 'ददाति', iast: 'dadāti', meaning: 'Gives / bestows', meaningHindi: 'प्रदान करती है', meaningMarathi: 'देते / प्रदान करते', root: 'दा', rootIast: 'dā', grammar: 'Verb, Lat (Present), 3rd Sg. Parasmaipada', partOfSpeech: 'Verb' },
        { word: 'विनयम्', iast: 'vinayam', meaning: 'Humility / discipline', meaningHindi: 'विनय, नम्रता, शिष्टाचार', meaningMarathi: 'नम्रता, लीनता, शिस्त', root: 'नी', rootIast: 'nī', grammar: 'Masculine noun, Acc. Sg.', partOfSpeech: 'Noun' },
        { word: 'विनयात्', iast: 'vinayāt', meaning: 'From humility / discipline', meaningHindi: 'विनय से / नम्रता से', meaningMarathi: 'विनयामुळे / नम्रतेतून', root: 'नी', rootIast: 'nī', grammar: 'Masculine noun, Abl. Sg.', partOfSpeech: 'Noun', sandhiSplit: 'विनयाद् → विनयात्' },
        { word: 'याति', iast: 'yāti', meaning: 'Goes to / attains', meaningHindi: 'प्राप्त करता है / जाता है', meaningMarathi: 'मिळवतो / प्राप्त करतो', root: 'या', rootIast: 'yā', grammar: 'Verb, Lat (Present), 3rd Sg.', partOfSpeech: 'Verb' },
        { word: 'पात्रताम्', iast: 'pātratām', meaning: 'Worthiness / fitness', meaningHindi: 'योग्यता, पात्रता', meaningMarathi: 'पात्रता, योग्यता', root: 'पा', rootIast: 'pā', grammar: 'Feminine noun, Acc. Sg.', partOfSpeech: 'Noun' },
        { word: '।', iast: '|', meaning: '', grammar: '', partOfSpeech: '', isPunctuation: true }
      ],
      [
        { word: 'पात्रत्वात्', iast: 'pātratvāt', meaning: 'From worthiness / capacity', meaningHindi: 'पात्रता (योग्यता) से', meaningMarathi: 'पात्रतेमुळे / क्षमतेतून', root: 'पा', rootIast: 'pā', grammar: 'Neuter abstract noun, Abl. Sg.', partOfSpeech: 'Noun', sandhiSplit: 'पात्रत्वाद् → पात्रत्वात्' },
        { word: 'धनम्', iast: 'dhanam', meaning: 'Wealth / resources', meaningHindi: 'धन, संपत्ति', meaningMarathi: 'धन, संपत्ती', root: 'धन्', rootIast: 'dhan', grammar: 'Neuter noun, Acc. Sg.', partOfSpeech: 'Noun', sandhiSplit: 'धनमाप्नोति → धनम् + आप्नोति' },
        { word: 'आप्नोति', iast: 'āpnoti', meaning: 'Attains / gains', meaningHindi: 'प्राप्त करता है', meaningMarathi: 'मिळवतो / संपादन करतो', root: 'आप्', rootIast: 'āp', grammar: 'Verb, Lat (Present), 3rd Sg.', partOfSpeech: 'Verb' },
        { word: 'धनात्', iast: 'dhanāt', meaning: 'From wealth', meaningHindi: 'धन से', meaningMarathi: 'धनातून / पैशाने', root: 'धन्', rootIast: 'dhan', grammar: 'Neuter noun, Abl. Sg.', partOfSpeech: 'Noun', sandhiSplit: 'धनाद् → धनात्' },
        { word: 'धर्मम्', iast: 'dharmam', meaning: 'Righteousness / duty', meaningHindi: 'धर्म, सत्कर्म, कर्तव्य', meaningMarathi: 'धर्म, सत्कृत्य, कर्तव्य', root: 'धृ', rootIast: 'dhṛ', grammar: 'Masculine noun, Acc. Sg.', partOfSpeech: 'Noun' },
        { word: 'ततः', iast: 'tataḥ', meaning: 'Thereafter / from that', meaningHindi: 'उसके बाद / उससे', meaningMarathi: 'त्यानंतर / त्यातून', root: '—', grammar: 'Indeclinable / Avyaya', partOfSpeech: 'Indeclinable' },
        { word: 'सुखम्', iast: 'sukham', meaning: 'True happiness / peace', meaningHindi: 'सच्चा सुख और शांति', meaningMarathi: 'खरे सुख आणि समाधान', root: 'ख', rootIast: 'kha', grammar: 'Neuter noun, Acc./Nom. Sg.', partOfSpeech: 'Noun' },
        { word: '॥', iast: '||', meaning: '', grammar: '', partOfSpeech: '', isPunctuation: true }
      ]
    ],
    translation: 'Knowledge bestows humility. From humility, one gains worthiness. From worthiness, one acquires wealth. From wealth, one performs righteous duty (dharma), and from that arises true, enduring happiness.',
    translationHindi: 'विद्या विनय प्रदान करती है, विनय से मनुष्य पात्रता (योग्यता) प्राप्त करता है, योग्यता से धन प्राप्त होता है, धन से धर्म का आचरण होता है और धर्म से सच्चा सुख मिलता है।',
    translationMarathi: 'विद्या विनय देते, विनयामुळे मनुष्य पात्रता प्राप्त करतो, पात्रतेमुळे धन मिळते, धनातून धर्माचे आचरण होते आणि त्यातून चिरंतन सुख मिळते.',
    anvaya: 'विद्या विनयं ददाति। विनयात् पात्रतां याति। पात्रत्वात् धनम् आप्नोति। धनात् धर्मम् (आप्नोति), ततः सुखम् (भवति)।',
    explanation: 'A classic didactic Sanskrit verse illustrating the progressive chain of personal development where true education begins with ethical discipline and culminates in genuine happiness.'
  },
  {
    id: 'gita-karma',
    title: 'The Doctrine of Selfless Action (कर्मण्येवाधिकारस्ते)',
    source: 'Bhagavad Gītā 2.47 (श्रीमद्भगवद्गीता)',
    category: 'philosophy',
    meter: 'Anuṣṭubh (अनुष्टुभ् - 32 syllables total in 4 quarters)',
    lines: [
      'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।',
      'मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥'
    ],
    tokens: [
      [
        { word: 'कर्मणि', iast: 'karmaṇi', meaning: 'In action / duty alone', meaningHindi: 'केवल कर्तव्य कर्म करने में', meaningMarathi: 'केवळ आपले विहित कर्म करण्यात', root: 'कृ', rootIast: 'kṛ', grammar: 'Neuter noun, Loc. Sg. (सप्तमी विभक्ति)', partOfSpeech: 'Noun', sandhiSplit: 'कर्मणि + एव + अधिकारः + ते' },
        { word: 'एव', iast: 'eva', meaning: 'Only / indeed', meaningHindi: 'ही', meaningMarathi: 'च / फक्त', root: '—', grammar: 'Indeclinable emphatic particle', partOfSpeech: 'Indeclinable' },
        { word: 'अधिकारः', iast: 'adhikāraḥ', meaning: 'Right / jurisdiction / prerogative', meaningHindi: 'अधिकार है', meaningMarathi: 'अधिकार आहे', root: 'कृ', rootIast: 'kṛ', grammar: 'Masculine noun, Nom. Sg.', partOfSpeech: 'Noun' },
        { word: 'ते', iast: 'te', meaning: 'Your / to you', meaningHindi: 'तुम्हारा', meaningMarathi: 'तुझा', root: 'युष्मद्', rootIast: 'yuṣmad', grammar: '2nd Person Pronoun, Gen./Dat. Sg.', partOfSpeech: 'Pronoun' },
        { word: 'मा', iast: 'mā', meaning: 'Never / do not', meaningHindi: 'मत / कभी नहीं', meaningMarathi: 'कधीही नाही / नको', root: '—', grammar: 'Prohibitive particle (निषेधार्थक अव्यय)', partOfSpeech: 'Indeclinable' },
        { word: 'फलेषु', iast: 'phaleṣu', meaning: 'In the fruits / outcomes', meaningHindi: 'फलों में', meaningMarathi: 'फळांमध्ये', root: 'फल्', rootIast: 'phal', grammar: 'Neuter noun, Loc. Pl. (सप्तमी बहुवचन)', partOfSpeech: 'Noun' },
        { word: 'कदाचन', iast: 'kadācana', meaning: 'At any time / ever', meaningHindi: 'कभी भी', meaningMarathi: 'कधीही', root: '—', grammar: 'Indeclinable particle', partOfSpeech: 'Indeclinable' },
        { word: '।', iast: '|', meaning: '', grammar: '', partOfSpeech: '', isPunctuation: true }
      ],
      [
        { word: 'मा', iast: 'mā', meaning: 'Let not / do not', meaningHindi: 'मत', meaningMarathi: 'नको', root: '—', grammar: 'Prohibitive particle', partOfSpeech: 'Indeclinable' },
        { word: 'कर्मफलहेतुः', iast: 'karma-phala-hetuḥ', meaning: 'Motivated by fruit of actions', meaningHindi: 'कर्मफल का हेतु / कारण', meaningMarathi: 'कर्मफळाचा हेतू ठेवणारा', root: 'कृ + फल् + हि', grammar: 'Bahuvrīhi compound, Nom. Sg.', partOfSpeech: 'Compound Noun', sandhiSplit: 'कर्मफलहेतुः + भूः + मा' },
        { word: 'भूः', iast: 'bhūḥ', meaning: 'Become / be', meaningHindi: 'बनो', meaningMarathi: 'होऊ नकोस', root: 'भू', rootIast: 'bhū', grammar: 'Verb, Aorist injunctive (लुङ्), 2nd Sg.', partOfSpeech: 'Verb' },
        { word: 'मा', iast: 'mā', meaning: 'Let not / do not', meaningHindi: 'मत', meaningMarathi: 'नसावी', root: '—', grammar: 'Prohibitive particle', partOfSpeech: 'Indeclinable' },
        { word: 'ते', iast: 'te', meaning: 'Your', meaningHindi: 'तुम्हारी', meaningMarathi: 'तुझी', root: 'युष्मद्', grammar: '2nd Person Pronoun, Gen. Sg.', partOfSpeech: 'Pronoun' },
        { word: 'सङ्गः', iast: 'saṅgaḥ', meaning: 'Attachment / clinging', meaningHindi: 'आसक्ति, लगाव', meaningMarathi: 'आसक्ती, ओढ', root: 'सञ्ज्', rootIast: 'sañj', grammar: 'Masculine noun, Nom. Sg.', partOfSpeech: 'Noun', sandhiSplit: 'सङ्गः + अस्तु' },
        { word: 'अस्तु', iast: 'astu', meaning: 'Let there be', meaningHindi: 'हो', meaningMarathi: 'असावी', root: 'अस्', rootIast: 'as', grammar: 'Verb, Lot (Imperative), 3rd Sg.', partOfSpeech: 'Verb' },
        { word: 'अकर्मणि', iast: 'akarmaṇi', meaning: 'In inaction / passivity', meaningHindi: 'अकर्म में (कर्म न करने में)', meaningMarathi: 'अकर्मण्यतेमध्ये (निष्क्रियतेत)', root: 'कृ', rootIast: 'kṛ', grammar: 'Neuter noun, Loc. Sg. with negative prefix a-', partOfSpeech: 'Noun' },
        { word: '॥', iast: '||', meaning: '', grammar: '', partOfSpeech: '', isPunctuation: true }
      ]
    ],
    translation: 'You have a right only to perform your duty, but never to the fruits of action. Do not let the fruits of action be your motive, nor should your attachment be to inaction.',
    translationHindi: 'तुम्हारा अधिकार केवल कर्म करने में है, उसके फलों में कभी नहीं। तुम कर्मफल के कारण मत बनो और तुम्हारी आसक्ति अकर्म (निष्क्रियता) में भी न हो।',
    translationMarathi: 'तुझा केवळ कर्म करण्यावर अधिकार आहे, फळांवर कधीही नाही. कर्मफळाचा हेतू तू ठेवू नकोस आणि अकर्मण्यतेत (निष्क्रियतेत) तुझी आसक्ती नसावी.',
    anvaya: 'कर्मणि एव ते अधिकारः (अस्तु), फलेषु कदाचन मा (अस्तु)। त्वं कर्मफलहेतुः मा भूः, अकर्मणि ते सङ्गः मा अस्तु।',
    explanation: 'The philosophical core of Karma Yoga in the Bhagavad Gītā, counseling focused intentional action unencumbered by anxiety regarding future outcomes.'
  },
  {
    id: 'shanti-mantra',
    title: 'Peace Invocation of Knowledge (सह नाववतु)',
    source: 'Taittirīya Upaniṣad / Kaṭha Upaniṣad (शान्तिपाठः)',
    category: 'invocation',
    meter: 'Vedic Free Flow (शान्ति मन्त्रः)',
    lines: [
      'ॐ सह नाववतु । सह नौ भुनक्तु । सह वीर्यं करवावहै ।',
      'तेजस्वि नावधीतमस्तु मा विद्विषावहै ॥ ॐ शान्तिः शान्तिः शान्तिः ॥'
    ],
    tokens: [
      [
        { word: 'ॐ', iast: 'oṃ', meaning: 'Pranava (primordial sacred sound)', meaningHindi: 'प्रणव ॐ', meaningMarathi: 'प्रणव ॐ', root: 'अव', rootIast: 'av', grammar: 'Sacred syllable / avyaya', partOfSpeech: 'Indeclinable' },
        { word: 'सह', iast: 'saha', meaning: 'Together / jointly', meaningHindi: 'साथ-साथ', meaningMarathi: 'एकत्र / सोबत', root: '—', grammar: 'Indeclinable preposition', partOfSpeech: 'Indeclinable' },
        { word: 'नौ', iast: 'nau', meaning: 'Both of us (teacher and student)', meaningHindi: 'हम दोनों (गुरु-शिष्य) की', meaningMarathi: 'आम्हा दोघांचे (गुरु-शिष्य)', root: 'अस्मद्', rootIast: 'asmad', grammar: '1st Person Pronoun, Dual Acc./Gen.', partOfSpeech: 'Pronoun', sandhiSplit: 'नौ + अवतु → नाववतु' },
        { word: 'अवतु', iast: 'avatu', meaning: 'May He protect', meaningHindi: 'रक्षा करें', meaningMarathi: 'रक्षण करावे', root: 'अव्', rootIast: 'av', grammar: 'Verb, Lot (Imperative), 3rd Sg.', partOfSpeech: 'Verb' },
        { word: '।', iast: '|', meaning: '', grammar: '', partOfSpeech: '', isPunctuation: true },
        { word: 'सह', iast: 'saha', meaning: 'Together', meaningHindi: 'साथ मिलकर', meaningMarathi: 'एकत्र', root: '—', grammar: 'Indeclinable', partOfSpeech: 'Indeclinable' },
        { word: 'नौ', iast: 'nau', meaning: 'Both of us', meaningHindi: 'हम दोनों का', meaningMarathi: 'आम्हा दोघांचे', root: 'अस्मद्', grammar: '1st Person Pronoun, Dual Acc.', partOfSpeech: 'Pronoun' },
        { word: 'भुनक्तु', iast: 'bhunaktu', meaning: 'May He nourish / sustain', meaningHindi: 'पोषण करें / पालन करें', meaningMarathi: 'पोषण करावे', root: 'भुज्', rootIast: 'bhuj', grammar: 'Verb, Lot (Imperative), 3rd Sg. Parasmaipada', partOfSpeech: 'Verb' },
        { word: '।', iast: '|', meaning: '', grammar: '', partOfSpeech: '', isPunctuation: true },
        { word: 'सह', iast: 'saha', meaning: 'Together', meaningHindi: 'साथ-साथ', meaningMarathi: 'मिळून', root: '—', grammar: 'Indeclinable', partOfSpeech: 'Indeclinable' },
        { word: 'वीर्यम्', iast: 'vīryam', meaning: 'Great vigor / spiritual capacity', meaningHindi: 'सामर्थ्य, पराक्रम', meaningMarathi: 'सामर्थ्य, तेज, शक्ती', root: 'वीर्', rootIast: 'vīr', grammar: 'Neuter noun, Acc. Sg.', partOfSpeech: 'Noun' },
        { word: 'करवावहै', iast: 'karavāvahai', meaning: 'May we both generate / accomplish', meaningHindi: 'हम दोनों प्राप्त करें', meaningMarathi: 'आम्ही दोघे संपादन करू या', root: 'कृ', rootIast: 'kṛ', grammar: 'Verb, Lot (Imperative), 1st Dual Ātmanepada', partOfSpeech: 'Verb' },
        { word: '।', iast: '|', meaning: '', grammar: '', partOfSpeech: '', isPunctuation: true }
      ],
      [
        { word: 'तेजस्वि', iast: 'tejasvi', meaning: 'Luminous / brilliant / potent', meaningHindi: 'तेजस्वी, प्रकाशमय', meaningMarathi: 'तेजस्वी, प्रकाशमान', root: 'तिज्', rootIast: 'tij', grammar: 'Neuter adjective, Nom. Sg.', partOfSpeech: 'Adjective' },
        { word: 'नौ', iast: 'nau', meaning: 'Of both of us', meaningHindi: 'हम दोनों का', meaningMarathi: 'आम्हा दोघांचे', root: 'अस्मद्', grammar: '1st Person Pronoun, Dual Gen.', partOfSpeech: 'Pronoun', sandhiSplit: 'नौ + अधीतम् → नावधीतम्' },
        { word: 'अधीतम्', iast: 'adhītam', meaning: 'Study / learned wisdom', meaningHindi: 'अध्ययन किया हुआ ज्ञान', meaningMarathi: 'अभ्यासलेले ज्ञान', root: 'इ (अधि-इ)', rootIast: 'adhi-i', grammar: 'Past passive participle, Nom. Sg.', partOfSpeech: 'Noun' },
        { word: 'अस्तु', iast: 'astu', meaning: 'May it be', meaningHindi: 'हो', meaningMarathi: 'होवो', root: 'अस्', rootIast: 'as', grammar: 'Verb, Lot (Imperative), 3rd Sg.', partOfSpeech: 'Verb', sandhiSplit: 'अधीतम् + अस्तु → अधीतमस्तु' },
        { word: 'मा', iast: 'mā', meaning: 'Let not / never', meaningHindi: 'न', meaningMarathi: 'नको', root: '—', grammar: 'Prohibitive particle', partOfSpeech: 'Indeclinable' },
        { word: 'विद्विषावहै', iast: 'vidviṣāvahai', meaning: 'May we two harbor animosity or disagreement', meaningHindi: 'हम आपस में द्वेष करें', meaningMarathi: 'आमच्यात परस्पर द्वेष निर्माण होवो', root: 'द्विष् (वि-द्विष्)', rootIast: 'vi-dviṣ', grammar: 'Verb, Lot (Imperative), 1st Dual Ātmanepada', partOfSpeech: 'Verb' },
        { word: '॥', iast: '||', meaning: '', grammar: '', partOfSpeech: '', isPunctuation: true },
        { word: 'ॐ', iast: 'oṃ', meaning: 'Om', meaningHindi: 'ॐ', meaningMarathi: 'ॐ', root: '—', grammar: 'Sacred syllable', partOfSpeech: 'Indeclinable' },
        { word: 'शान्तिः', iast: 'śāntiḥ', meaning: 'Peace', meaningHindi: 'शांति', meaningMarathi: 'शांतता', root: 'शम्', rootIast: 'śam', grammar: 'Feminine noun, Nom. Sg.', partOfSpeech: 'Noun' },
        { word: 'शान्तिः', iast: 'śāntiḥ', meaning: 'Peace', meaningHindi: 'शांति', meaningMarathi: 'शांतता', root: 'शम्', rootIast: 'śam', grammar: 'Feminine noun, Nom. Sg.', partOfSpeech: 'Noun' },
        { word: 'शान्तिः', iast: 'śāntiḥ', meaning: 'Peace', meaningHindi: 'शांति', meaningMarathi: 'शांतता', root: 'शम्', rootIast: 'śam', grammar: 'Feminine noun, Nom. Sg.', partOfSpeech: 'Noun' },
        { word: '॥', iast: '||', meaning: '', grammar: '', partOfSpeech: '', isPunctuation: true }
      ]
    ],
    translation: 'Om, may He protect both of us (teacher and student) together. May He nourish both of us together. May we generate strength and vigor together. May our learning be radiant and filled with light. May there be no animosity between us. Om Peace, Peace, Peace.',
    translationHindi: 'हे परमात्मा, हम दोनों (गुरु और शिष्य) की साथ-साथ रक्षा करें। हम दोनों का साथ-साथ पोषण करें। हम साथ मिलकर महान सामर्थ्य प्राप्त करें। हमारा अध्ययन प्रकाशमय और तेजस्वी हो तथा हम परस्पर द्वेष न करें। ॐ शान्ति, शान्ति, शान्ति।',
    translationMarathi: 'हे परमेश्वरा, आपण आम्हा दोघांचेही (गुरु व शिष्य) एकत्र रक्षण करावे. आमचे एकत्र पोषण करावे. आम्ही दोघे मिळून मोठे सामर्थ्य संपादन करू या. आमचा अभ्यास तेजस्वी होवो आणि आमच्यात कधीही द्वेष निर्माण न होवो. ॐ शांतता, शांतता, शांतता.',
    anvaya: 'सः नौ सह अवतु। सः नौ सह भुनक्तु। आवां सह वीर्यं करवावहै। नौ अधीतं तेजस्वि अस्तु। आवां मा विद्विषावहै। ॐ शान्तिः शान्तिः शान्तिः।',
    explanation: 'Traditional Vedic invocation chanted prior to scholarly study in the guru-śiṣya tradition, fostering communal harmony and deep collective receptivity.'
  }
];
