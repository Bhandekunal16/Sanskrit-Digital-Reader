export interface SanskritTranslationEntry {
  id: string;
  sanskrit: string;
  iast: string;
  hindi: string;
  marathi: string;
  english: string;
  type: 'word' | 'phrase' | 'sentence';
  category?: string;
  context?: string;
}

export const SANSKRIT_TRANSLATIONS: SanskritTranslationEntry[] = [
  // 1. Fundamental Words
  {
    id: 'dharmah',
    sanskrit: 'धर्मः',
    iast: 'dharmaḥ',
    hindi: 'धर्म, कर्तव्य, सदाचार, नैतिक व्यवस्था, स्वाभाविक गुण',
    marathi: 'धर्म, कर्तव्य, सदाचार, नीतीमत्ता, नैतिक व्यवस्था',
    english: 'Dharma, righteousness, duty, moral order, intrinsic nature',
    type: 'word',
    category: 'Ethics & Philosophy'
  },
  {
    id: 'samskrtam',
    sanskrit: 'संस्कृतम्',
    iast: 'saṃskṛtam',
    hindi: 'संस्कृत; परिष्कृत, शुद्ध, संस्कारित, सुगठित भाषा',
    marathi: 'संस्कृत; परिष्कृत, शुद्ध, संस्कारित भाषा',
    english: 'Sanskrit; refined, perfected, polished, consecrated speech',
    type: 'word',
    category: 'Language'
  },
  {
    id: 'jnanam',
    sanskrit: 'ज्ञानम्',
    iast: 'jñānam',
    hindi: 'ज्ञान, विद्या, बोध, विवेक, आत्मज्ञान',
    marathi: 'ज्ञान, विद्या, समज, विवेक, आत्मज्ञान',
    english: 'Knowledge, wisdom, cognition, realization',
    type: 'word',
    category: 'Epistemology'
  },
  {
    id: 'satyam',
    sanskrit: 'सत्यम्',
    iast: 'satyam',
    hindi: 'सत्य, सच, यथार्थ, वास्तविकता',
    marathi: 'सत्य, खरे, यथार्थ, वास्तव',
    english: 'Truth, reality, existence, fact',
    type: 'word',
    category: 'Ethics & Philosophy'
  },
  {
    id: 'ahimsa',
    sanskrit: 'अहिंसा',
    iast: 'ahiṃsā',
    hindi: 'अहिंसा, किसी भी जीव को कष्ट न पहुँचाना, करुणा',
    marathi: 'अहिंसा, कोणत्याही जीवाला इजा न करणे, भूतदया',
    english: 'Non-violence, non-injury, compassionate harmlessness',
    type: 'word',
    category: 'Ethics & Philosophy'
  },
  {
    id: 'santih',
    sanskrit: 'शान्तिः',
    iast: 'śāntiḥ',
    hindi: 'शान्ति, मानसिक स्थिरता, उपशम, अमन',
    marathi: 'शांतता, मानसिक स्थैर्य, उपशम, समाधान',
    english: 'Peace, tranquility, calm, cessation of suffering',
    type: 'word',
    category: 'Spirituality'
  },
  {
    id: 'vidya',
    sanskrit: 'विद्या',
    iast: 'vidyā',
    hindi: 'विद्या, ज्ञान, शिक्षा, अध्ययन, विद्या-कला',
    marathi: 'विद्या, ज्ञान, शिक्षण, अभ्यास',
    english: 'Knowledge, learning, science, education, wisdom',
    type: 'word',
    category: 'Education'
  },
  {
    id: 'vinayam',
    sanskrit: 'विनयम्',
    iast: 'vinayam',
    hindi: 'विनय, नम्रता, शिष्टाचार, सदाचार',
    marathi: 'नम्रता, विनय, शिष्टाचार, लीनता',
    english: 'Humility, discipline, modesty, good conduct',
    type: 'word',
    category: 'Virtue'
  },
  {
    id: 'guruh',
    sanskrit: 'गुरुः',
    iast: 'guruḥ',
    hindi: 'गुरु, शिक्षक, मार्गदर्शक, वंदनीय आचार्य',
    marathi: 'गुरु, शिक्षक, मार्गदर्शक, आदरणीय व्यक्ती',
    english: 'Guru, teacher, spiritual guide, mentor',
    type: 'word',
    category: 'Tradition'
  },
  {
    id: 'karma',
    sanskrit: 'कर्म',
    iast: 'karma',
    hindi: 'कर्म, कार्य, क्रिया, कर्तव्य-कर्म',
    marathi: 'कर्म, कार्य, कृती, कर्तव्य',
    english: 'Action, deed, duty, moral work',
    type: 'word',
    category: 'Philosophy'
  },
  {
    id: 'sukham',
    sanskrit: 'सुखम्',
    iast: 'sukham',
    hindi: 'सुख, आनंद, प्रसन्नता, कल्याण',
    marathi: 'सुख, आनंद, समाधान, प्रसन्नता',
    english: 'Happiness, joy, pleasure, well-being, ease',
    type: 'word',
    category: 'Well-being'
  },
  {
    id: 'dhanam',
    sanskrit: 'धनम्',
    iast: 'dhanam',
    hindi: 'धन, संपत्ति, द्रव्य, संपदा',
    marathi: 'धन, संपत्ती, पैसा, द्रव्य',
    english: 'Wealth, treasure, riches, property',
    type: 'word',
    category: 'Society'
  },
  {
    id: 'gacchati',
    sanskrit: 'गच्छति',
    iast: 'gacchati',
    hindi: 'जाता है / जाती है / जाता',
    marathi: 'जातो / जाते / निघतो',
    english: 'Goes, moves, walks, departs',
    type: 'word',
    category: 'Verbs'
  },
  {
    id: 'dadati',
    sanskrit: 'ददाति',
    iast: 'dadāti',
    hindi: 'देता है / प्रदान करता है',
    marathi: 'देतो / देते / प्रदान करतो',
    english: 'Gives, bestows, grants',
    type: 'word',
    category: 'Verbs'
  },
  {
    id: 'bhavati',
    sanskrit: 'भवति',
    iast: 'bhavati',
    hindi: 'होता है / बनता है',
    marathi: 'होतो / होते / बनते',
    english: 'Is, becomes, exists, happens',
    type: 'word',
    category: 'Verbs'
  },
  {
    id: 'karoti',
    sanskrit: 'करोति',
    iast: 'karoti',
    hindi: 'करता है / करती है',
    marathi: 'करतो / करते / करतो आहे',
    english: 'Does, performs, acts, makes',
    type: 'word',
    category: 'Verbs'
  },
  {
    id: 'pathati',
    sanskrit: 'पठति',
    iast: 'paṭhati',
    hindi: 'पढ़ता है / अध्ययन करता है',
    marathi: 'वाचतो / वाचते / शिकतो',
    english: 'Reads, studies, recites',
    type: 'word',
    category: 'Verbs'
  },
  {
    id: 'ramah',
    sanskrit: 'रामः',
    iast: 'rāmaḥ',
    hindi: 'श्रीराम; आनंद देने वाले, मर्यादा पुरुषोत्तम',
    marathi: 'श्रीराम; आनंद देणारा, मर्यादा पुरुषोत्तम',
    english: 'Rama; delightful, radiant embodiment of righteousness',
    type: 'word',
    category: 'Proper Noun'
  },
  {
    id: 'krishna',
    sanskrit: 'कृष्णः',
    iast: 'kṛṣṇaḥ',
    hindi: 'श्रीकृष्ण; सबको आकर्षित करने वाले, परम चेतना',
    marathi: 'श्रीकृष्ण; सर्वांना आकर्षित करणारा, परम चेतना',
    english: 'Krishna; all-attractive, supreme consciousness',
    type: 'word',
    category: 'Proper Noun'
  },
  {
    id: 'yogah',
    sanskrit: 'योगः',
    iast: 'yogaḥ',
    hindi: 'योग; समाधि, चित्त-शुद्धि, आत्मा और परमात्मा का मिलन',
    marathi: 'योग; समाधी, चित्तशुद्धी, एकाग्रता, आत्मसाक्षात्कार',
    english: 'Yoga; union, integration, disciplined meditation, equanimity',
    type: 'word',
    category: 'Yoga'
  },
  {
    id: 'namaste',
    sanskrit: 'नमस्ते',
    iast: 'namaste',
    hindi: 'आपको नमस्कार, आपके भीतर की दिव्यता को प्रणाम',
    marathi: 'तुम्हाला नमस्कार, तुमच्यातील ईश्वराला वंदन',
    english: 'Salutations to you, respectful greetings to the divine within you',
    type: 'word',
    category: 'Greetings'
  },

  // 2. Famous Classical Sentences & Sayings
  {
    id: 'satyameva-jayate',
    sanskrit: 'सत्यमेव जयते।',
    iast: 'satyameva jayate.',
    hindi: 'सत्य की ही सदा विजय होती है, असत्य की नहीं।',
    marathi: 'सत्याचाच नेहमी विजय होतो, असत्याचा नाही.',
    english: 'Truth alone triumphs, not falsehood.',
    type: 'sentence',
    category: 'Upaniṣad (Muṇḍaka 3.1.6)',
    context: 'The national motto of India from the Muṇḍaka Upaniṣad.'
  },
  {
    id: 'dharmo-rakshati',
    sanskrit: 'धर्मो रक्षति रक्षितः।',
    iast: 'dharmo rakṣati rakṣitaḥ.',
    hindi: 'जो धर्म की रक्षा करता है, धर्म उसकी रक्षा करता है।',
    marathi: 'जो धर्माचे रक्षण करतो, त्याचे धर्म रक्षण करतो.',
    english: 'Dharma protects those who protect and uphold it.',
    type: 'sentence',
    category: 'Manusmṛti (8.15)',
    context: 'A timeless maxim illustrating the reciprocal nature of moral duty.'
  },
  {
    id: 'vidya-dadati-short',
    sanskrit: 'विद्या ददाति विनयम्।',
    iast: 'vidyā dadāti vinayam.',
    hindi: 'विद्या मनुष्य को विनय और नम्रता प्रदान करती है।',
    marathi: 'विद्या मनुष्याला नम्रता आणि लीनता देते.',
    english: 'Knowledge bestows humility and noble discipline.',
    type: 'phrase',
    category: 'Hitopadeśa',
    context: 'Foundational Sanskrit didactic proverb on the purpose of true education.'
  },
  {
    id: 'vidya-dadati-full',
    sanskrit: 'विद्या ददाति विनयं विनयाद् याति पात्रताम् । पात्रत्वाद् धनमाप्नोति धनाद् धर्मं ततः सुखम् ॥',
    iast: 'vidyā dadāti vinayaṃ vinayād yāti pātratām | pātratvād dhanamāpnoti dhanād dharmaṃ tataḥ sukham ||',
    hindi: 'विद्या विनय प्रदान करती है, विनय से मनुष्य योग्यता प्राप्त करता है, योग्यता से धन प्राप्त होता है, धन से धर्म का आचरण होता है और धर्म से सच्चा सुख मिलता है।',
    marathi: 'विद्या विनय देते, विनयामुळे मनुष्य पात्रता प्राप्त करतो, पात्रतेमुळे धन मिळते, धनातून धर्माचे आचरण होते आणि त्यातून चिरंतन सुख मिळते.',
    english: 'Knowledge gives humility; from humility one attains worthiness; from worthiness one acquires wealth; from wealth one performs righteous duty (dharma), and from that arises true happiness.',
    type: 'sentence',
    category: 'Hitopadeśa (Subhāṣitam)',
    context: 'The progressive ethical and psychological chain of human flourishing.'
  },
  {
    id: 'gita-karma-short',
    sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।',
    iast: 'karmaṇyevādhikāraste mā phaleṣu kadācana.',
    hindi: 'तुम्हारा केवल कर्म करने में ही अधिकार है, कर्म के फलों में कभी नहीं।',
    marathi: 'तुझा केवळ कर्म करण्यावरच अधिकार आहे, फळावर कधीही नाही.',
    english: 'You have a right only to perform your prescribed duty, never to the fruits of action.',
    type: 'sentence',
    category: 'Bhagavad Gītā (2.47)',
    context: 'The fundamental thesis of Karma Yoga from the Bhagavad Gītā.'
  },
  {
    id: 'gita-karma-full',
    sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन । मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥',
    iast: 'karmaṇyevādhikāraste mā phaleṣu kadācana | mā karmaphalaheturbhūrmā te saṅgo\'stvakarmaṇi ||',
    hindi: 'तुम्हारा अधिकार केवल कर्म करने में है, उसके फलों में कभी नहीं। तुम कर्मफल के कारण मत बनो और तुम्हारी आसक्ति अकर्म (निष्क्रियता) में भी न हो।',
    marathi: 'तुझा केवळ कर्म करण्यावर अधिकार आहे, फळांवर कधीही नाही. कर्मफळाचा हेतू तू ठेवू नकोस आणि अकर्मण्यतेत (निष्क्रियतेत) तुझी आसक्ती नसावी.',
    english: 'You have a right only to perform your duty, but never to the fruits of action. Do not let the fruit of action be your motive, nor let your attachment be to inaction.',
    type: 'sentence',
    category: 'Bhagavad Gītā (2.47)',
    context: 'The complete two-line verse on selfless focused action.'
  },
  {
    id: 'vasudhaiva-kutumbakam',
    sanskrit: 'वसुधैव कुटुम्बकम्।',
    iast: 'vasudhaiva kuṭumbakam.',
    hindi: 'संपूर्ण पृथ्वी ही एक परिवार है।',
    marathi: 'संपूर्ण पृथ्वी हेच एक कुटुंब आहे.',
    english: 'The whole earth is truly one single family.',
    type: 'phrase',
    category: 'Mahā Upaniṣad (6.71)',
    context: 'Universal humanistic philosophy transcending parochial boundaries.'
  },
  {
    id: 'sarve-bhavantu-sukhinah',
    sanskrit: 'सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः । सर्वे भद्राणि पश्यन्तु मा कश्चिद् दुःखभाग्भवेत् ॥',
    iast: 'sarve bhavantu sukhinaḥ sarve santu nirāmayāḥ | sarve bhadrāṇi paśyantu mā kaścid duḥkhabhāgbhavet ||',
    hindi: 'सभी सुखी हों, सभी रोगमुक्त और स्वस्थ हों, सभी का कल्याण हो और कोई भी दुःख का भागी न बने।',
    marathi: 'सर्व प्राणी सुखी होवोत, सर्व निरोगी राहोत, सर्वांचे कल्याण होवो आणि कोणाच्याही वाट्याला दुःख येऊ नये.',
    english: 'May all beings be happy; may all be free from illness; may all perceive what is auspicious; may no one suffer sorrow.',
    type: 'sentence',
    category: 'Bṛhadāraṇyaka Upaniṣad / Universal Prayer',
    context: 'The timeless Vedic blessing for global well-being and universal peace.'
  },
  {
    id: 'saha-navavatu',
    sanskrit: 'ॐ सह नाववतु । सह नौ भुनक्तु । सह वीर्यं करवावहै । तेजस्वि नावधीतमस्तु मा विद्विषावहै ॥ ॐ शान्तिः शान्तिः शान्तिः ॥',
    iast: 'oṃ saha nāvavatu | saha nau bhunaktu | saha vīryaṃ karavāvahai | tejasvi nāvadhītamastu mā vidviṣāvahai || oṃ śāntiḥ śāntiḥ śāntiḥ ||',
    hindi: 'हे ईश्वर, हम दोनों (गुरु और शिष्य) की साथ-साथ रक्षा करें। हम दोनों का साथ-साथ पोषण करें। हम साथ मिलकर महान सामर्थ्य प्राप्त करें। हमारा अध्ययन प्रकाशमय और तेजस्वी हो तथा हम परस्पर द्वेष न करें। ॐ शान्ति, शान्ति, शान्ति।',
    marathi: 'हे परमेश्वरा, आपण आम्हा दोघांचेही (गुरु व शिष्य) एकत्र रक्षण करावे. आमचे एकत्र पोषण करावे. आम्ही दोघे मिळून मोठे सामर्थ्य संपादन करू या. आमचा अभ्यास तेजस्वी होवो आणि आमच्यात कधीही द्वेष निर्माण न होवो. ॐ शांतता, शांतता, शांतता.',
    english: 'Om, may the Divine protect us both together. May He nourish us together. May we work together with great energy. May our study be luminous and potent. May there be no animosity between us. Om Peace, Peace, Peace.',
    type: 'sentence',
    category: 'Taittirīya Upaniṣad (Śāntipāṭha)',
    context: 'Vedic invocation recited prior to philosophical study.'
  },
  {
    id: 'ahimsa-paramo-dharmah',
    sanskrit: 'अहिंसा परमो धर्मः।',
    iast: 'ahiṃsā paramo dharmaḥ.',
    hindi: 'अहिंसा ही परम धर्म (सर्वोच्च कर्तव्य) है।',
    marathi: 'अहिंसा हाच श्रेष्ठ धर्म (परम कर्तव्य) आहे.',
    english: 'Non-violence is the supreme virtue and highest duty.',
    type: 'phrase',
    category: 'Mahābhārata (Anuśāsana Parva)',
    context: 'Foundational ethical injunction of Indic philosophy.'
  },
  {
    id: 'satyam-shivam-sundaram',
    sanskrit: 'सत्यं शिवं सुन्दरम्।',
    iast: 'satyaṃ śivaṃ sundaram.',
    hindi: 'सत्य ही कल्याणकारी और सत्य ही परम सुंदर है।',
    marathi: 'सत्य हेच कल्याणकारी आणि सत्य हेच सुंदर आहे.',
    english: 'Truth is auspicious benevolence, and truth is supreme beauty.',
    type: 'phrase',
    category: 'Classical Maxim',
    context: 'The triad of Indian aesthetics and metaphysical philosophy.'
  },
  {
    id: 'asato-ma-full',
    sanskrit: 'असतो मा सद्गमय ।\nतमसो मा ज्योतिर्गमय ।\nमृत्योर्मा अमृतं गमय ॥',
    iast: 'asato mā sadgamaya | tamaso mā jyotirgamaya | mṛtyormā amṛtaṃ gamaya ||',
    hindi: 'मुझे असत्य से सत्य की ओर ले चलो।\nमुझे अंधकार से प्रकाश की ओर ले चलो।\nमुझे मृत्यु से अमरता की ओर ले चलो।',
    marathi: 'मला असत्याकडून सत्याकडे ने.\nमला अंधाराकडून प्रकाशाकडे ने.\nमला मृत्यूकडून अमरत्वाकडे ने.',
    english: 'Lead me from falsehood to truth.\nLead me from darkness to light.\nLead me from death to immortality.',
    type: 'sentence',
    category: 'Bṛhadāraṇyaka Upaniṣad (1.3.28)',
    context: 'Pāvamāna Mantra from the Bṛhadāraṇyaka Upaniṣad.'
  },
  {
    id: 'asato-ma-line1',
    sanskrit: 'असतो मा सद्गमय',
    iast: 'asato mā sadgamaya',
    hindi: 'मुझे असत्य से सत्य की ओर ले चलो',
    marathi: 'मला असत्याकडून सत्याकडे ने',
    english: 'Lead me from falsehood to truth',
    type: 'phrase',
    category: 'Upaniṣad'
  },
  {
    id: 'tamaso-ma-line2',
    sanskrit: 'तमसो मा ज्योतिर्गमय',
    iast: 'tamaso mā jyotirgamaya',
    hindi: 'मुझे अंधकार से प्रकाश की ओर ले चलो',
    marathi: 'मला अंधाराकडून प्रकाशाकडे ने',
    english: 'Lead me from darkness to light',
    type: 'phrase',
    category: 'Upaniṣad'
  },
  {
    id: 'mrtyorma-line3',
    sanskrit: 'मृत्योर्मा अमृतं गमय',
    iast: 'mṛtyormā amṛtaṃ gamaya',
    hindi: 'मुझे मृत्यु से अमरता की ओर ले चलो',
    marathi: 'मला मृत्यूकडून अमरत्वाकडे ने',
    english: 'Lead me from death to immortality',
    type: 'phrase',
    category: 'Upaniṣad'
  }
];
