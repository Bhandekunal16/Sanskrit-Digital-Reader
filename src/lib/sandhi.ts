import { devanagariToIast } from './transliteration';

export type SandhiType = 
  | 'svara'      // स्वरसन्धिः (Vowel sandhi)
  | 'vyanjana'   // व्यञ्जनसन्धिः (Consonant sandhi)
  | 'visarga'    // विसर्गसन्धिः (Visarga sandhi)
  | 'compound'   // समासान्त पद (Compound word)
  | 'none';

export interface SandhiAnalysisResult {
  surface: string;
  isCompound: boolean;
  possibleSplit: string[];
  sandhiType: SandhiType;
  sanskritTerm: string;
  ruleName: string;
  explanation: string;
  confidence: 'exact_dataset' | 'rule_based' | 'heuristic' | 'none';
}

// Curated verified Sandhi and Compound mappings from classical literature
const VERIFIED_SANDHI_DATASET: Record<string, { split: string[]; rule: string; type: SandhiType; term: string; explanation: string }> = {
  'सत्यमेव': {
    split: ['सत्यम्', 'एव'],
    rule: 'अनुस्वार/व्यञ्जन सन्धिः',
    type: 'vyanjana',
    term: 'व्यञ्जनसन्धिः',
    explanation: 'पद के अन्त में "म्" का स्वर "ए" से संयोग होकर "मे" बना।'
  },
  'सूर्योदयः': {
    split: ['सूर्य', 'उदयः'],
    rule: 'आद्गुणः (६.१.८७)',
    type: 'svara',
    term: 'गुणसन्धिः',
    explanation: 'अ/आ के पश्चात् उ/ऊ आने पर दोनों के स्थान पर "ओ" गुण एकादेश होता है।'
  },
  'विद्यार्थी': {
    split: ['विद्या', 'अर्थी'],
    rule: 'अकः सवर्णे दीर्घः (६.१.१०१)',
    type: 'svara',
    term: 'दीर्घसन्धिः',
    explanation: 'सवर्ण अच् के परे होने पर पूर्व और पर के स्थान पर दीर्घ एकादेश होता है।'
  },
  'हिमालयः': {
    split: ['हिम', 'आलयः'],
    rule: 'अकः सवर्णे दीर्घः (६.१.१०१)',
    type: 'svara',
    term: 'दीर्घसन्धिः',
    explanation: 'अ + आ मिलकर दीर्घ "आ" बनते हैं।'
  },
  'यद्यपि': {
    split: ['यदि', 'अपि'],
    rule: 'इको यणचि (६.१.७७)',
    type: 'svara',
    term: 'यण्सन्धिः',
    explanation: 'इक् (इ) वर्ण के आगे असमान स्वर (अ) आने पर "य्" यण् आदेश होता है।'
  },
  'इत्युक्तम्': {
    split: ['इति', 'उक्तम्'],
    rule: 'इको यणचि (६.१.७७)',
    type: 'svara',
    term: 'यण्सन्धिः',
    explanation: 'इति + उक्तम् -> इत्युक्तम् (इ + उ = यु)।'
  },
  'सद्गमय': {
    split: ['सत्', 'गमय'],
    rule: 'झलां जशोऽन्ते (८.२.३९)',
    type: 'vyanjana',
    term: 'जश्त्वसन्धिः',
    explanation: 'पदान्त झल् (त्) वर्ण के पश्चात् घोष वर्ण (ग्) आने पर तृतीय वर्ण (द्) जश् आदेश हुआ।'
  },
  'तमसो': {
    split: ['तमसः', 'मा'],
    rule: 'ससजुषो रुः / अतो रोरप्लुतादप्लुते (६.१.११३)',
    type: 'visarga',
    term: 'उत्त्वसन्धिः',
    explanation: 'हश् वर्ण परे होने पर विसर्ग का "ओ" में रूपान्तरण।'
  },
  'ज्योतिर्गमय': {
    split: ['ज्योतिः', 'गमय'],
    rule: 'रोऽसुपि / विसर्जनीयस्य रुः',
    type: 'visarga',
    term: 'रुत्वसन्धिः',
    explanation: 'विसर्ग से पूर्व अ/आ से भिन्न स्वर होने पर विसर्ग का "र्" (रेफ) आदेश हुआ।'
  },
  'मृत्योर्मा': {
    split: ['मृत्योः', 'मा'],
    rule: 'विसर्जनीयस्य रुः',
    type: 'visarga',
    term: 'रुत्वसन्धिः',
    explanation: 'मृत्योः + मा -> मृत्योर्मा (विसर्ग का रेफ "र्" बनकर परवर्ण "मा" पर आरूढ़ हुआ)।'
  },
  'विनयाद्': {
    split: ['विनयात्'],
    rule: 'झलां जशोऽन्ते (८.२.३९)',
    type: 'vyanjana',
    term: 'जश्त्वसन्धिः',
    explanation: 'पदान्त तकार का परवर्ती स्वर/घोष के कारण दकार में परिवर्तन।'
  },
  'पात्रत्वाद्': {
    split: ['पात्रत्वात्'],
    rule: 'झलां जशोऽन्ते (८.२.३९)',
    type: 'vyanjana',
    term: 'जश्त्वसन्धिः',
    explanation: 'पात्रत्वात् का पदान्त दकार रूप।'
  },
  'धनाद्': {
    split: ['धनात्'],
    rule: 'झलां जशोऽन्ते (८.२.३९)',
    type: 'vyanjana',
    term: 'जश्त्वसन्धिः',
    explanation: 'धनात् का जश्त्व सन्धि रूप।'
  },
  'कर्मण्येवाधिकारस्ते': {
    split: ['कर्मणि', 'एव', 'अधिकारः', 'ते'],
    rule: 'यण्सन्धिः + सवर्णदीर्घः + विसर्गसन्धिः',
    type: 'compound',
    term: 'संयुक्त पद (पदसमूहः)',
    explanation: 'कर्मणि + एव (यण्) = कर्मण्येव; कर्मण्येव + अधिकारः (दीर्घ) = कर्मण्येवाधिकारः; अधिकारः + ते (सत्व) = अधिकारस्ते।'
  },
  'वसुधैव': {
    split: ['वसुधा', 'एव'],
    rule: 'वृद्धिरेचि (६.१.८८)',
    type: 'svara',
    term: 'वृद्धिसन्धिः',
    explanation: 'आ + ए = ऐ (वृद्धि एकादेश)।'
  },
  'परमोदार': {
    split: ['परम', 'उदार'],
    rule: 'आद्गुणः (६.१.८७)',
    type: 'svara',
    term: 'गुणसन्धिः',
    explanation: 'अ + उ = ओ (गुण एकादेश)।'
  },
  'नरेशः': {
    split: ['नर', 'ईशः'],
    rule: 'आद्गुणः (६.१.८७)',
    type: 'svara',
    term: 'गुणसन्धिः',
    explanation: 'अ + ई = ए (गुण एकादेश)।'
  },
  'महर्षिः': {
    split: ['महा', 'ऋषिः'],
    rule: 'आद्गुणः (६.१.८७)',
    type: 'svara',
    term: 'गुणसन्धिः',
    explanation: 'आ + ऋ = अर् (गुण एकादेश)।'
  },
  'तथैव': {
    split: ['तथा', 'एव'],
    rule: 'वृद्धिरेचि (६.१.८८)',
    type: 'svara',
    term: 'वृद्धिसन्धिः',
    explanation: 'आ + ए = ऐ (वृद्धि एकादेश)।'
  },
  'प्रत्येकम्': {
    split: ['प्रति', 'एकम्'],
    rule: 'इको यणचि (६.१.७७)',
    type: 'svara',
    term: 'यण्सन्धिः',
    explanation: 'इ + ए = ये (यण् आदेश)।'
  },
  'स्वागतम्': {
    split: ['सु', 'आगतम्'],
    rule: 'इको यणचि (६.१.७७)',
    type: 'svara',
    term: 'यण्सन्धिः',
    explanation: 'उ + आ = वा (यण् आदेश)।'
  },
  'पवनः': {
    split: ['पो', 'अनः'],
    rule: 'एचोऽयवायावः (६.१.७८)',
    type: 'svara',
    term: 'अयादिसन्धिः',
    explanation: 'ओ + अ = अव् (अयादि आदेश)।'
  },
  'नयनम्': {
    split: ['ने', 'अनम्'],
    rule: 'एचोऽयवायावः (६.१.७८)',
    type: 'svara',
    term: 'अयादिसन्धिः',
    explanation: 'ए + अ = अय् (अयादि आदेश)।'
  },
  'पावकः': {
    split: ['पौ', 'अकः'],
    rule: 'एचोऽयवायावः (६.१.७८)',
    type: 'svara',
    term: 'अयादिसन्धिः',
    explanation: 'औ + अ = आव् (अयादि आदेश)।'
  },
  'गायत्री': {
    split: ['गै', 'अत्री'],
    rule: 'एचोऽयवायावः (६.१.७८)',
    type: 'svara',
    term: 'अयादिसन्धिः',
    explanation: 'ऐ + अ = आय् (अयादि आदेश)।'
  },
  'जगदीशः': {
    split: ['जगत्', 'ईशः'],
    rule: 'झलां जशोऽन्ते (८.२.३९)',
    type: 'vyanjana',
    term: 'जश्त्वसन्धिः',
    explanation: 'त् + ई = दी (जश्त्व आदेश)।'
  },
  'सज्जनः': {
    split: ['सत्', 'जनः'],
    rule: 'स्तोः श्चुना श्चुः (८.४.४०)',
    type: 'vyanjana',
    term: 'श्चुत्वसन्धिः',
    explanation: 'त् + ज् = ज्ज् (श्चुत्व आदेश)।'
  },
  'उज्ज्वलः': {
    split: ['उत्', 'ज्वलः'],
    rule: 'स्तोः श्चुना श्चुः (८.४.४०)',
    type: 'vyanjana',
    term: 'श्चुत्वसन्धिः',
    explanation: 'त् + ज् = ज्ज् (श्चुत्व आदेश)।'
  },
  'तल्लीनः': {
    split: ['तत्', 'लीनः'],
    rule: 'तोर्लि (८.४.६०)',
    type: 'vyanjana',
    term: 'परसवर्णसन्धिः (लत्व)',
    explanation: 'त् + ल् = ल्ल (तवर्ग के परे लकार होने पर परसवर्ण लकार)।'
  },
  'नमस्ते': {
    split: ['नमः', 'ते'],
    rule: 'विसर्जनीयस्य सः (८.३.३४)',
    type: 'visarga',
    term: 'सत्वसन्धिः',
    explanation: 'खर् (त्) परे होने पर विसर्ग का "स्" (दन्त्य सकार) आदेश हुआ।'
  },
  'कश्चित्': {
    split: ['कः', 'चित्'],
    rule: 'विसर्जनीयस्य सः / श्चुत्वम्',
    type: 'visarga',
    term: 'सत्व/श्चुत्वसन्धिः',
    explanation: 'च् परे होने पर विसर्ग का "श्" (तालव्य शकार) आदेश हुआ।'
  },
  'धनुष्टङ्कारः': {
    split: ['धनुः', 'टङ्कारः'],
    rule: 'विसर्जनीयस्य सः / ष्टुत्वम्',
    type: 'visarga',
    term: 'सत्व/ष्टुत्वसन्धिः',
    explanation: 'ट् परे होने पर विसर्ग का "ष्" (मूर्धन्य षकार) आदेश हुआ।'
  },
  'सोऽपि': {
    split: ['सः', 'अपि'],
    rule: 'अतो रोरप्लुतादप्लुते (६.१.११३) / एङः पदान्तादति (६.१.१०९)',
    type: 'visarga',
    term: 'पूर्वरूपसन्धिः',
    explanation: 'सः + अपि -> सो + अपि -> सोऽपि (अवग्रह चिह्न "ऽ" ह्रस्व अकार का सूचक है)।'
  }
};

/**
 * Performs comprehensive Sandhi and compound segmentation on a Sanskrit token.
 * 1. Checks verified classical dataset
 * 2. Applies Pāṇinian rule heuristics (Svara, Vyanjana, Visarga)
 * 3. Returns structured analysis with grammar rule and confidence
 */
export function analyzeSandhi(token: string): SandhiAnalysisResult {
  const clean = token.replace(/[।॥.,;!?:()\[\]\-\s]/g, '').trim();
  if (!clean) {
    return {
      surface: token,
      isCompound: false,
      possibleSplit: [],
      sandhiType: 'none',
      sanskritTerm: 'अविभक्तम्',
      ruleName: 'None',
      explanation: 'No Sanskrit characters to analyze.',
      confidence: 'none'
    };
  }

  // 1. Direct dataset lookup
  const exactMatch = VERIFIED_SANDHI_DATASET[clean];
  if (exactMatch) {
    return {
      surface: clean,
      isCompound: exactMatch.split.length > 1,
      possibleSplit: exactMatch.split,
      sandhiType: exactMatch.type,
      sanskritTerm: exactMatch.term,
      ruleName: exactMatch.rule,
      explanation: exactMatch.explanation,
      confidence: 'exact_dataset'
    };
  }

  // Check normalized form (e.g. removing trailing visarga/anusvara)
  const normClean = clean.replace(/[ःम्]$/, '');
  const normMatch = VERIFIED_SANDHI_DATASET[normClean];
  if (normMatch) {
    return {
      surface: clean,
      isCompound: normMatch.split.length > 1,
      possibleSplit: normMatch.split,
      sandhiType: normMatch.type,
      sanskritTerm: normMatch.term,
      ruleName: normMatch.rule,
      explanation: normMatch.explanation,
      confidence: 'exact_dataset'
    };
  }

  // 2. Rule-Based Heuristic Detection

  // Heuristic A: Avagraha (पूर्वरूप सन्धिः e.g. ऽपि, ऽहम्)
  if (clean.includes('ऽ')) {
    const parts = clean.split('ऽ');
    if (parts.length === 2 && parts[0].length >= 1) {
      return {
        surface: clean,
        isCompound: true,
        possibleSplit: [parts[0], 'अ' + parts[1]],
        sandhiType: 'svara',
        sanskritTerm: 'पूर्वरूपसन्धिः',
        ruleName: 'एङः पदान्तादति (६.१.१०९)',
        explanation: 'पदान्त एङ् (ए, ओ) के पश्चात् ह्रस्व अकार आने पर अकार का पूर्वरूप एकादेश हुआ (अवग्रह "ऽ" द्वारा दर्शित)।',
        confidence: 'rule_based'
      };
    }
  }

  // Heuristic B: Vṛddhi sandhi ending in 'ै' (e.g. तथैव, सदैव, अत्रैव)
  if (clean.endsWith('ैव') && clean.length > 2) {
    const base = clean.slice(0, -2);
    return {
      surface: clean,
      isCompound: true,
      possibleSplit: [base + 'ा', 'एव'],
      sandhiType: 'svara',
      sanskritTerm: 'वृद्धिसन्धिः',
      ruleName: 'वृद्धिरेचि (६.१.८८)',
      explanation: 'अ/आ के आगे ए/ऐ आने पर "ऐ" वृद्धि एकादेश होता है।',
      confidence: 'rule_based'
    };
  }

  // Heuristic C: Vyanjana sandhi with 'द्' (e.g. सद्-, तद्-, यद्-)
  if (clean.startsWith('सद्') && clean.length > 3) {
    const rest = clean.slice(3);
    return {
      surface: clean,
      isCompound: true,
      possibleSplit: ['सत्', rest],
      sandhiType: 'vyanjana',
      sanskritTerm: 'जश्त्वसन्धिः',
      ruleName: 'झलां जशोऽन्ते (८.२.३९)',
      explanation: 'पदान्त तकार (त्) का घोष वर्ण के योग से दकार (द्) में परिवर्तन।',
      confidence: 'rule_based'
    };
  }

  // Heuristic D: Visarga 'र्' insertion (e.g. ज्योतिर्गमय, पुनर्-)
  if (clean.includes('र्ग') || clean.includes('र्म') || clean.includes('र्व') || clean.includes('र्भ')) {
    const rephMatch = clean.match(/^(.+?)(र्[गमवभ].*)$/);
    if (rephMatch && rephMatch[1].length >= 2) {
      const part1 = rephMatch[1] + 'ः';
      const part2 = rephMatch[2].replace(/^र्/, '');
      return {
        surface: clean,
        isCompound: true,
        possibleSplit: [part1, part2],
        sandhiType: 'visarga',
        sanskritTerm: 'रुत्वसन्धिः',
        ruleName: 'रोऽसुपि / विसर्जनीयस्य रुः',
        explanation: 'विसर्ग का घोष वर्णों के परे होने पर "र्" (रेफ) आदेश हुआ।',
        confidence: 'rule_based'
      };
    }
  }

  // Heuristic E: Schutva double consonant (e.g. 'ज्ज्व', 'च्च', 'ज्ज्')
  if (clean.includes('ज्ज') || clean.includes('च्च')) {
    const splitIndex = clean.indexOf('ज्ज') !== -1 ? clean.indexOf('ज्ज') : clean.indexOf('च्च');
    const firstPart = clean.slice(0, splitIndex) + 'त्';
    const secondPart = clean.slice(splitIndex + 1);
    return {
      surface: clean,
      isCompound: true,
      possibleSplit: [firstPart, secondPart],
      sandhiType: 'vyanjana',
      sanskritTerm: 'श्चुत्वसन्धिः',
      ruleName: 'स्तोः श्चुना श्चुः (८.४.४०)',
      explanation: 'सकार या तवर्ग का शकार या चवर्ग के साथ योग होने पर श्चुत्व (तकार का चकार/जकार में परिवर्तन) हुआ।',
      confidence: 'heuristic'
    };
  }

  // Default: Non-sandhi or elementary unsegmented token
  return {
    surface: clean,
    isCompound: false,
    possibleSplit: [clean],
    sandhiType: 'none',
    sanskritTerm: 'अविभक्तम् (मूल पदम्)',
    ruleName: 'पदम्',
    explanation: 'यह पद संधि-रहित अथवा एकल प्रातिपदिक रूप प्रतीत होता है।',
    confidence: 'heuristic'
  };
}
