/**
 * Centralized Sanskrit Phonological Data Model (उच्चारण-स्थानम्)
 * Serves as the Single Source of Truth for phonemes, articulation places,
 * transliteration tables, and word phonological decomposition.
 */

export type PhonologicalGroup =
  | 'guttural'
  | 'palatal'
  | 'retroflex'
  | 'dental'
  | 'labial'
  | 'palato-guttural'
  | 'labio-guttural'
  | 'dentolabial'
  | 'nasal-modifier';

export type PhonemeType =
  | 'vowel'
  | 'consonant'
  | 'semivowel'
  | 'sibilant'
  | 'aspirate'
  | 'modifier';

export interface SanskritPhoneme {
  devanagari: string;
  iast: string;
  group: PhonologicalGroup;
  placeOfArticulation: string;
  sanskritName: string;
  sanskritTerm: string;
  type: PhonemeType;
  manner?: string;
  matraDevanagari?: string;
  organ: string;
  description: string;
}

export interface PhonologicalGroupData {
  id: PhonologicalGroup;
  englishName: string;
  sanskritName: string;
  sanskritTerm: string;
  organ: string;
  description: string;
  phonemes: SanskritPhoneme[];
}

export const SANSKRIT_PHONEMES: SanskritPhoneme[] = [
  // --- 1. GUTTURAL (कण्ठ्य - Kaṇṭhya) ---
  {
    devanagari: 'अ',
    iast: 'a',
    group: 'guttural',
    placeOfArticulation: 'Guttural / Throat',
    sanskritName: 'कण्ठ्य',
    sanskritTerm: 'कण्ठ्य (Kaṇṭhya)',
    type: 'vowel',
    manner: 'Short Open Vowel (ह्रस्व स्वर)',
    organ: 'Throat & Vocal cords (कण्ठ)',
    description: 'The fundamental short vowel produced in the throat with open vocal tract. Inherent in all un-virāma consonants.'
  },
  {
    devanagari: 'आ',
    matraDevanagari: 'ा',
    iast: 'ā',
    group: 'guttural',
    placeOfArticulation: 'Guttural / Throat',
    sanskritName: 'कण्ठ्य',
    sanskritTerm: 'कण्ठ्य (Kaṇṭhya)',
    type: 'vowel',
    manner: 'Long Open Vowel (दीर्घ स्वर)',
    organ: 'Throat (कण्ठ)',
    description: 'The long guttural vowel, sustained for two mātrā durations in the throat.'
  },
  {
    devanagari: 'क',
    iast: 'ka',
    group: 'guttural',
    placeOfArticulation: 'Guttural / Velar',
    sanskritName: 'कण्ठ्य',
    sanskritTerm: 'कण्ठ्य स्पर्श (Kaṇṭhya Sparśa)',
    type: 'consonant',
    manner: 'Unvoiced Unaspirated Stop (अघोष अल्पप्राण)',
    organ: 'Root of tongue touching soft palate (जिह्वामूल)',
    description: 'First consonant of the Sanskrit varṇamālā; unvoiced velar stop articulated at the soft palate.'
  },
  {
    devanagari: 'ख',
    iast: 'kha',
    group: 'guttural',
    placeOfArticulation: 'Guttural / Velar',
    sanskritName: 'कण्ठ्य',
    sanskritTerm: 'कण्ठ्य स्पर्श (Kaṇṭhya Sparśa)',
    type: 'consonant',
    manner: 'Unvoiced Aspirated Stop (अघोष महाप्राण)',
    organ: 'Root of tongue touching soft palate with breath aspiration (जिह्वामूल)',
    description: 'Aspirated voiceless velar plosive with pronounced breath release.'
  },
  {
    devanagari: 'ग',
    iast: 'ga',
    group: 'guttural',
    placeOfArticulation: 'Guttural / Velar',
    sanskritName: 'कण्ठ्य',
    sanskritTerm: 'कण्ठ्य स्पर्श (Kaṇṭhya Sparśa)',
    type: 'consonant',
    manner: 'Voiced Unaspirated Stop (घोष अल्पप्राण)',
    organ: 'Back of tongue on soft palate with vocal fold vibration (कण्ठ)',
    description: 'Voiced velar stop produced with vibrating vocal cords.'
  },
  {
    devanagari: 'घ',
    iast: 'gha',
    group: 'guttural',
    placeOfArticulation: 'Guttural / Velar',
    sanskritName: 'कण्ठ्य',
    sanskritTerm: 'कण्ठ्य स्पर्श (Kaṇṭhya Sparśa)',
    type: 'consonant',
    manner: 'Voiced Aspirated Stop (घोष महाप्राण)',
    organ: 'Back of tongue on soft palate with breathy voice (कण्ठ)',
    description: 'Voiced aspirated velar stop characterized by strong resonant breath.'
  },
  {
    devanagari: 'ङ',
    iast: 'ṅa',
    group: 'guttural',
    placeOfArticulation: 'Guttural-Nasal',
    sanskritName: 'कण्ठ्य-नासिक्य',
    sanskritTerm: 'कण्ठ्य नासिक्य (Kaṇṭhya Nāsikya)',
    type: 'consonant',
    manner: 'Velar Nasal (नासिक्य)',
    organ: 'Soft palate and nasal cavity (कण्ठ एवं नासिका)',
    description: 'Velar nasal stop articulated at the soft palate with acoustic resonance redirected into the nasal passage.'
  },
  {
    devanagari: 'ह',
    iast: 'ha',
    group: 'guttural',
    placeOfArticulation: 'Guttural / Glottal',
    sanskritName: 'कण्ठ्य',
    sanskritTerm: 'कण्ठ्य ऊष्मन् (Kaṇṭhya Ūṣman)',
    type: 'aspirate',
    manner: 'Voiced Glottal Fricative (घोष ऊष्मन्)',
    organ: 'Throat & Glottis (कण्ठ)',
    description: 'Aspirated fricative generated directly within the vocal throat cavity.'
  },
  {
    devanagari: 'ः',
    iast: 'ḥ',
    group: 'guttural',
    placeOfArticulation: 'Guttural / Visarga',
    sanskritName: 'कण्ठ्य',
    sanskritTerm: 'विसर्ग (Visarga)',
    type: 'modifier',
    manner: 'Voiceless Glottal Aspiration (अघोष विसर्जन)',
    organ: 'Throat (कण्ठ)',
    description: 'Post-vocalic unvoiced breath echo modifying preceding vowels.'
  },

  // --- 2. PALATAL (तालव्य - Tālavya) ---
  {
    devanagari: 'इ',
    matraDevanagari: 'ि',
    iast: 'i',
    group: 'palatal',
    placeOfArticulation: 'Palatal / Hard Palate',
    sanskritName: 'तालव्य',
    sanskritTerm: 'तालव्य (Tālavya)',
    type: 'vowel',
    manner: 'Short Close Front Vowel (ह्रस्व स्वर)',
    organ: 'Hard palate (तालु)',
    description: 'Short palatal vowel produced by raising the middle of the tongue toward the hard palate.'
  },
  {
    devanagari: 'ई',
    matraDevanagari: 'ी',
    iast: 'ī',
    group: 'palatal',
    placeOfArticulation: 'Palatal / Hard Palate',
    sanskritName: 'तालव्य',
    sanskritTerm: 'तालव्य (Tālavya)',
    type: 'vowel',
    manner: 'Long Close Front Vowel (दीर्घ स्वर)',
    organ: 'Hard palate (तालु)',
    description: 'Long palatal vowel held for two mātrā beats against the hard palate.'
  },
  {
    devanagari: 'च',
    iast: 'ca',
    group: 'palatal',
    placeOfArticulation: 'Palatal',
    sanskritName: 'तालव्य',
    sanskritTerm: 'तालव्य स्पर्श (Tālavya Sparśa)',
    type: 'consonant',
    manner: 'Unvoiced Unaspirated Stop (अघोष अल्पप्राण)',
    organ: 'Middle of tongue on hard palate (तालु)',
    description: 'Voiceless palatal affricate stop formed by flat contact against the hard roof of mouth.'
  },
  {
    devanagari: 'छ',
    iast: 'cha',
    group: 'palatal',
    placeOfArticulation: 'Palatal',
    sanskritName: 'तालव्य',
    sanskritTerm: 'तालव्य स्पर्श (Tālavya Sparśa)',
    type: 'consonant',
    manner: 'Unvoiced Aspirated Stop (अघोष महाप्राण)',
    organ: 'Middle of tongue on hard palate with breath (तालु)',
    description: 'Aspirated voiceless palatal stop with audible breath expulsion.'
  },
  {
    devanagari: 'ज',
    iast: 'ja',
    group: 'palatal',
    placeOfArticulation: 'Palatal',
    sanskritName: 'तालव्य',
    sanskritTerm: 'तालव्य स्पर्श (Tālavya Sparśa)',
    type: 'consonant',
    manner: 'Voiced Unaspirated Stop (घोष अल्पप्राण)',
    organ: 'Middle of tongue on hard palate (तालु)',
    description: 'Voiced palatal stop with vocal resonance.'
  },
  {
    devanagari: 'झ',
    iast: 'jha',
    group: 'palatal',
    placeOfArticulation: 'Palatal',
    sanskritName: 'तालव्य',
    sanskritTerm: 'तालव्य स्पर्श (Tālavya Sparśa)',
    type: 'consonant',
    manner: 'Voiced Aspirated Stop (घोष महाप्राण)',
    organ: 'Middle of tongue on hard palate with breath (तालु)',
    description: 'Voiced aspirated palatal consonant with resonant aspiration.'
  },
  {
    devanagari: 'ञ',
    iast: 'ña',
    group: 'palatal',
    placeOfArticulation: 'Palatal-Nasal',
    sanskritName: 'तालव्य-नासिक्य',
    sanskritTerm: 'तालव्य नासिक्य (Tālavya Nāsikya)',
    type: 'consonant',
    manner: 'Palatal Nasal (नासिक्य)',
    organ: 'Hard palate and nasal cavity (तालु एवं नासिका)',
    description: 'Palatal nasal consonant articulated before palatal plosives (as in jñāna, pañca).'
  },
  {
    devanagari: 'य',
    iast: 'ya',
    group: 'palatal',
    placeOfArticulation: 'Palatal',
    sanskritName: 'तालव्य',
    sanskritTerm: 'तालव्य अन्तस्थ (Tālavya Antastha)',
    type: 'semivowel',
    manner: 'Palatal Approximant / Semivowel (अन्तस्थ)',
    organ: 'Hard palate (तालु)',
    description: 'Palatal semivowel corresponding to vowel i/ī.'
  },
  {
    devanagari: 'श',
    iast: 'śa',
    group: 'palatal',
    placeOfArticulation: 'Palatal',
    sanskritName: 'तालव्य',
    sanskritTerm: 'तालव्य ऊष्मन् (Tālavya Ūṣman)',
    type: 'sibilant',
    manner: 'Voiceless Palatal Sibilant (अघोष तालव्य शकार)',
    organ: 'Hard palate (तालु)',
    description: 'Soft palatal sibilant produced with tongue blade against the hard palate (as in śānti, śiva).'
  },

  // --- 3. RETROFLEX (मूर्धन्य - Mūrdhanya) ---
  {
    devanagari: 'ऋ',
    matraDevanagari: 'ृ',
    iast: 'ṛ',
    group: 'retroflex',
    placeOfArticulation: 'Retroflex / Coronal',
    sanskritName: 'मूर्धन्य',
    sanskritTerm: 'मूर्धन्य स्वर (Mūrdhanya Svara)',
    type: 'vowel',
    manner: 'Vocalic Retroflex Vowel (ह्रस्व मूर्धन्य स्वर)',
    organ: 'Roof of mouth / Dome of palate (मूर्धा)',
    description: 'Syllabic retroflex vowel formed with curled tongue tip toward the roof of the palate (as in kṛṣṇa, ṛṣi).'
  },
  {
    devanagari: 'ॠ',
    matraDevanagari: 'ॄ',
    iast: 'ṝ',
    group: 'retroflex',
    placeOfArticulation: 'Retroflex / Coronal',
    sanskritName: 'मूर्धन्य',
    sanskritTerm: 'मूर्धन्य स्वर (Mūrdhanya Svara)',
    type: 'vowel',
    manner: 'Long Vocalic Retroflex Vowel (दीर्घ मूर्धन्य स्वर)',
    organ: 'Roof of mouth (मूर्धा)',
    description: 'Long version of vocalic ṛ, sustained for two mātrā durations in nominal declensions.'
  },
  {
    devanagari: 'ट',
    iast: 'ṭa',
    group: 'retroflex',
    placeOfArticulation: 'Retroflex',
    sanskritName: 'मूर्धन्य',
    sanskritTerm: 'मूर्धन्य स्पर्श (Mūrdhanya Sparśa)',
    type: 'consonant',
    manner: 'Unvoiced Unaspirated Retroflex Stop (अघोष अल्पप्राण)',
    organ: 'Tongue tip curled back touching roof of palate (मूर्धा)',
    description: 'Voiceless coronal retroflex plosive articulated by curling tongue upward against palate roof.'
  },
  {
    devanagari: 'ठ',
    iast: 'ṭha',
    group: 'retroflex',
    placeOfArticulation: 'Retroflex',
    sanskritName: 'मूर्धन्य',
    sanskritTerm: 'मूर्धन्य स्पर्श (Mūrdhanya Sparśa)',
    type: 'consonant',
    manner: 'Unvoiced Aspirated Retroflex Stop (अघोष महाप्राण)',
    organ: 'Curled tongue tip on roof of palate with breath (मूर्धा)',
    description: 'Aspirated voiceless retroflex plosive.'
  },
  {
    devanagari: 'ड',
    iast: 'ḍa',
    group: 'retroflex',
    placeOfArticulation: 'Retroflex',
    sanskritName: 'मूर्धन्य',
    sanskritTerm: 'मूर्धन्य स्पर्श (Mūrdhanya Sparśa)',
    type: 'consonant',
    manner: 'Voiced Unaspirated Retroflex Stop (घोष अल्पप्राण)',
    organ: 'Curled tongue tip on roof of palate (मूर्धा)',
    description: 'Voiced retroflex plosive.'
  },
  {
    devanagari: 'ढ',
    iast: 'ḍha',
    group: 'retroflex',
    placeOfArticulation: 'Retroflex',
    sanskritName: 'मूर्धन्य',
    sanskritTerm: 'मूर्धन्य स्पर्श (Mūrdhanya Sparśa)',
    type: 'consonant',
    manner: 'Voiced Aspirated Retroflex Stop (घोष महाप्राण)',
    organ: 'Curled tongue tip on roof of palate with breath (मूर्धा)',
    description: 'Voiced aspirated retroflex stop.'
  },
  {
    devanagari: 'ण',
    iast: 'ṇa',
    group: 'retroflex',
    placeOfArticulation: 'Retroflex-Nasal',
    sanskritName: 'मूर्धन्य-नासिक्य',
    sanskritTerm: 'मूर्धन्य नासिक्य (Mūrdhanya Nāsikya)',
    type: 'consonant',
    manner: 'Retroflex Nasal (नासिक्य)',
    organ: 'Roof of palate and nasal cavity (मूर्धा एवं नासिका)',
    description: 'Coronal retroflex nasal consonant (frequently derived via Pāṇinian ṇa-tva rule after r/ṣ).'
  },
  {
    devanagari: 'र',
    iast: 'ra',
    group: 'retroflex',
    placeOfArticulation: 'Retroflex / Alveolar',
    sanskritName: 'मूर्धन्य',
    sanskritTerm: 'मूर्धन्य अन्तस्थ (Mūrdhanya Antastha)',
    type: 'semivowel',
    manner: 'Alveolar/Retroflex Rhotic Tap (अन्तस्थ)',
    organ: 'Roof of mouth (मूर्धा)',
    description: 'Rhotic coronal liquid consonant corresponding to vocalic ṛ.'
  },
  {
    devanagari: 'ष',
    iast: 'ṣa',
    group: 'retroflex',
    placeOfArticulation: 'Retroflex',
    sanskritName: 'मूर्धन्य',
    sanskritTerm: 'मूर्धन्य ऊष्मन् (Mūrdhanya Ūṣman)',
    type: 'sibilant',
    manner: 'Voiceless Retroflex Sibilant (अघोष मूर्धन्य षकार)',
    organ: 'Curled tongue on roof of mouth (मूर्धा)',
    description: 'Deep coronal retroflex sibilant (as in viṣṇu, bhāṣā).'
  },

  // --- 4. DENTAL (दन्त्य - Dantya) ---
  {
    devanagari: 'ऌ',
    matraDevanagari: 'ॢ',
    iast: 'ḷ',
    group: 'dental',
    placeOfArticulation: 'Dental',
    sanskritName: 'दन्त्य',
    sanskritTerm: 'दन्त्य स्वर (Dantya Svara)',
    type: 'vowel',
    manner: 'Vocalic Dental Vowel (ह्रस्व दन्त्य स्वर)',
    organ: 'Upper teeth (दन्त)',
    description: 'Syllabic dental liquid vowel recognized in Pāṇinian Śivasūtras (e.g. kḷpta).'
  },
  {
    devanagari: 'ॡ',
    matraDevanagari: 'ॣ',
    iast: 'ḹ',
    group: 'dental',
    placeOfArticulation: 'Dental',
    sanskritName: 'दन्त्य',
    sanskritTerm: 'दन्त्य स्वर (Dantya Svara)',
    type: 'vowel',
    manner: 'Long Vocalic Dental Vowel (दीर्घ दन्त्य स्वर)',
    organ: 'Upper teeth (दन्त)',
    description: 'Theoretical long syllabic dental vowel included in traditional phonological symmetry.'
  },
  {
    devanagari: 'त',
    iast: 'ta',
    group: 'dental',
    placeOfArticulation: 'Dental',
    sanskritName: 'दन्त्य',
    sanskritTerm: 'दन्त्य स्पर्श (Dantya Sparśa)',
    type: 'consonant',
    manner: 'Unvoiced Unaspirated Dental Stop (अघोष अल्पप्राण)',
    organ: 'Tip of tongue touching back of upper teeth (दन्त)',
    description: 'Voiceless pure dental stop articulated at the upper incisors.'
  },
  {
    devanagari: 'थ',
    iast: 'tha',
    group: 'dental',
    placeOfArticulation: 'Dental',
    sanskritName: 'दन्त्य',
    sanskritTerm: 'दन्त्य स्पर्श (Dantya Sparśa)',
    type: 'consonant',
    manner: 'Unvoiced Aspirated Dental Stop (अघोष महाप्राण)',
    organ: 'Tip of tongue on upper teeth with breath (दन्त)',
    description: 'Aspirated voiceless dental stop.'
  },
  {
    devanagari: 'द',
    iast: 'da',
    group: 'dental',
    placeOfArticulation: 'Dental',
    sanskritName: 'दन्त्य',
    sanskritTerm: 'दन्त्य स्पर्श (Dantya Sparśa)',
    type: 'consonant',
    manner: 'Voiced Unaspirated Dental Stop (घोष अल्पप्राण)',
    organ: 'Tip of tongue on upper teeth (दन्त)',
    description: 'Voiced pure dental stop.'
  },
  {
    devanagari: 'ध',
    iast: 'dha',
    group: 'dental',
    placeOfArticulation: 'Dental',
    sanskritName: 'दन्त्य',
    sanskritTerm: 'दन्त्य स्पर्श (Dantya Sparśa)',
    type: 'consonant',
    manner: 'Voiced Aspirated Dental Stop (घोष महाप्राण)',
    organ: 'Tip of tongue on upper teeth with breath (दन्त)',
    description: 'Voiced aspirated dental stop (as in dharma, dhana).'
  },
  {
    devanagari: 'न',
    iast: 'na',
    group: 'dental',
    placeOfArticulation: 'Dental-Nasal',
    sanskritName: 'दन्त्य-नासिक्य',
    sanskritTerm: 'दन्त्य नासिक्य (Dantya Nāsikya)',
    type: 'consonant',
    manner: 'Dental Nasal (नासिक्य)',
    organ: 'Upper teeth and nasal cavity (दन्त एवं नासिका)',
    description: 'Pure dental nasal consonant.'
  },
  {
    devanagari: 'ल',
    iast: 'la',
    group: 'dental',
    placeOfArticulation: 'Dental',
    sanskritName: 'दन्त्य',
    sanskritTerm: 'दन्त्य अन्तस्थ (Dantya Antastha)',
    type: 'semivowel',
    manner: 'Dental Lateral Approximant (अन्तस्थ)',
    organ: 'Upper teeth (दन्त)',
    description: 'Dental lateral liquid semivowel.'
  },
  {
    devanagari: 'स',
    iast: 'sa',
    group: 'dental',
    placeOfArticulation: 'Dental',
    sanskritName: 'दन्त्य',
    sanskritTerm: 'दन्त्य ऊष्मन् (Dantya Ūṣman)',
    type: 'sibilant',
    manner: 'Voiceless Dental Sibilant (अघोष दन्त्य सकार)',
    organ: 'Upper teeth (दन्त)',
    description: 'Pure dental sibilant (as in satya, saṃskṛtam).'
  },

  // --- 5. LABIAL (ओष्ठ्य - Oṣṭhya) ---
  {
    devanagari: 'उ',
    matraDevanagari: 'ु',
    iast: 'u',
    group: 'labial',
    placeOfArticulation: 'Labial / Lips',
    sanskritName: 'ओष्ठ्य',
    sanskritTerm: 'ओष्ठ्य स्वर (Oṣṭhya Svara)',
    type: 'vowel',
    manner: 'Short Close Back Rounded Vowel (ह्रस्व ओष्ठ्य स्वर)',
    organ: 'Lips (ओष्ठ)',
    description: 'Short rounded vowel produced with pursed lips.'
  },
  {
    devanagari: 'ऊ',
    matraDevanagari: 'ू',
    iast: 'ū',
    group: 'labial',
    placeOfArticulation: 'Labial / Lips',
    sanskritName: 'ओष्ठ्य',
    sanskritTerm: 'ओष्ठ्य स्वर (Oṣṭhya Svara)',
    type: 'vowel',
    manner: 'Long Close Back Rounded Vowel (दीर्घ ओष्ठ्य स्वर)',
    organ: 'Lips (ओष्ठ)',
    description: 'Long rounded labial vowel sustained for two mātrās.'
  },
  {
    devanagari: 'प',
    iast: 'pa',
    group: 'labial',
    placeOfArticulation: 'Labial',
    sanskritName: 'ओष्ठ्य',
    sanskritTerm: 'ओष्ठ्य स्पर्श (Oṣṭhya Sparśa)',
    type: 'consonant',
    manner: 'Unvoiced Unaspirated Bilabial Stop (अघोष अल्पप्राण)',
    organ: 'Upper and lower lips meeting (ओष्ठ)',
    description: 'Voiceless bilabial plosive.'
  },
  {
    devanagari: 'फ',
    iast: 'pha',
    group: 'labial',
    placeOfArticulation: 'Labial',
    sanskritName: 'ओष्ठ्य',
    sanskritTerm: 'ओष्ठ्य स्पर्श (Oṣṭhya Sparśa)',
    type: 'consonant',
    manner: 'Unvoiced Aspirated Bilabial Stop (अघोष महाप्राण)',
    organ: 'Lips with breath aspiration (ओष्ठ)',
    description: 'Aspirated voiceless bilabial stop (distinct from fricative f).'
  },
  {
    devanagari: 'ब',
    iast: 'ba',
    group: 'labial',
    placeOfArticulation: 'Labial',
    sanskritName: 'ओष्ठ्य',
    sanskritTerm: 'ओष्ठ्य स्पर्श (Oṣṭhya Sparśa)',
    type: 'consonant',
    manner: 'Voiced Unaspirated Bilabial Stop (घोष अल्पप्राण)',
    organ: 'Lips meeting with vocal cord vibration (ओष्ठ)',
    description: 'Voiced bilabial plosive stop.'
  },
  {
    devanagari: 'भ',
    iast: 'bha',
    group: 'labial',
    placeOfArticulation: 'Labial',
    sanskritName: 'ओष्ठ्य',
    sanskritTerm: 'ओष्ठ्य स्पर्श (Oṣṭhya Sparśa)',
    type: 'consonant',
    manner: 'Voiced Aspirated Bilabial Stop (घोष महाप्राण)',
    organ: 'Lips with breath and vocal resonance (ओष्ठ)',
    description: 'Voiced aspirated bilabial stop (as in bhavati, bhakti).'
  },
  {
    devanagari: 'म',
    iast: 'ma',
    group: 'labial',
    placeOfArticulation: 'Labial-Nasal',
    sanskritName: 'ओष्ठ्य-नासिक्य',
    sanskritTerm: 'ओष्ठ्य नासिक्य (Oṣṭhya Nāsikya)',
    type: 'consonant',
    manner: 'Bilabial Nasal (नासिक्य)',
    organ: 'Lips and nasal cavity (ओष्ठ एवं नासिका)',
    description: 'Bilabial nasal consonant (as in mukha, manas).'
  },
  {
    devanagari: 'व',
    iast: 'va',
    group: 'dentolabial',
    placeOfArticulation: 'Dentolabial',
    sanskritName: 'दन्तोष्ठ्य',
    sanskritTerm: 'दन्तोष्ठ्य (Dantoṣṭhya)',
    type: 'semivowel',
    manner: 'Dentolabial Approximant (अन्तस्थ)',
    organ: 'Upper teeth on lower lip (दन्त एवं ओष्ठ)',
    description: 'Dentolabial semivowel corresponding to u/ū.'
  },

  // --- 6. DIPHTHONGS & COMPOSITE VOWELS ---
  {
    devanagari: 'ए',
    matraDevanagari: 'े',
    iast: 'e',
    group: 'palato-guttural',
    placeOfArticulation: 'Palato-Guttural',
    sanskritName: 'कण्ठतालव्य',
    sanskritTerm: 'कण्ठतालव्य स्वर (Kaṇṭhatālavya)',
    type: 'vowel',
    manner: 'Diphthong / Guṇa Vowel (a + i)',
    organ: 'Throat and hard palate (कण्ठ एवं तालु)',
    description: 'Complex vowel formed by combining guttural a and palatal i.'
  },
  {
    devanagari: 'ऐ',
    matraDevanagari: 'ै',
    iast: 'ai',
    group: 'palato-guttural',
    placeOfArticulation: 'Palato-Guttural',
    sanskritName: 'कण्ठतालव्य',
    sanskritTerm: 'कण्ठतालव्य वृद्धि स्वर (Kaṇṭhatālavya Vṛddhi)',
    type: 'vowel',
    manner: 'Long Diphthong / Vṛddhi (ā + i)',
    organ: 'Throat and hard palate (कण्ठ एवं तालु)',
    description: 'Vṛddhi vowel formed with wide throat and palatal glide.'
  },
  {
    devanagari: 'ओ',
    matraDevanagari: 'ो',
    iast: 'o',
    group: 'labio-guttural',
    placeOfArticulation: 'Labio-Guttural',
    sanskritName: 'कण्ठोष्ठ्य',
    sanskritTerm: 'कण्ठोष्ठ्य स्वर (Kaṇṭhoṣṭhya)',
    type: 'vowel',
    manner: 'Diphthong / Guṇa Vowel (a + u)',
    organ: 'Throat and lips (कण्ठ एवं ओष्ठ)',
    description: 'Complex vowel formed by combining guttural a and labial u (as in yoga, om).'
  },
  {
    devanagari: 'औ',
    matraDevanagari: 'ौ',
    iast: 'au',
    group: 'labio-guttural',
    placeOfArticulation: 'Labio-Guttural',
    sanskritName: 'कण्ठोष्ठ्य',
    sanskritTerm: 'कण्ठोष्ठ्य वृद्धि स्वर (Kaṇṭhoṣṭhya Vṛddhi)',
    type: 'vowel',
    manner: 'Long Diphthong / Vṛddhi (ā + u)',
    organ: 'Throat and lips (कण्ठ एवं ओष्ठ)',
    description: 'Vṛddhi vowel combining guttural throat origin with rounded lip finish.'
  },

  // --- 7. SPECIAL MODIFIERS ---
  {
    devanagari: 'ं',
    iast: 'ṃ',
    group: 'nasal-modifier',
    placeOfArticulation: 'Pure Nasal / Anusvāra',
    sanskritName: 'नासिक्य',
    sanskritTerm: 'अनुस्वार (Anusvāra)',
    type: 'modifier',
    manner: 'Pure Nasal Resonance (नासिक्य स्वरान्ते)',
    organ: 'Nose / Nasal cavity (नासिका)',
    description: 'Pure post-vocalic nasal sound (as in saṃskṛtam, jñānam).'
  },
  {
    devanagari: 'ँ',
    iast: 'm̐',
    group: 'nasal-modifier',
    placeOfArticulation: 'Nasalized Vowel / Candrabindu',
    sanskritName: 'अनुनासिक',
    sanskritTerm: 'अनुनासिक (Anunāsika)',
    type: 'modifier',
    manner: 'Nasalization of Preceding Vowel',
    organ: 'Mouth and Nose (मुखनासिकावचनोऽनुनासिकः)',
    description: 'Nasalization pronounced simultaneously through mouth and nose.'
  },
  {
    devanagari: 'ऽ',
    iast: "'",
    group: 'guttural',
    placeOfArticulation: 'Elision Marker',
    sanskritName: 'अवग्रह',
    sanskritTerm: 'अवग्रह (Avagraha)',
    type: 'modifier',
    manner: 'Prosodic pause / Elision marker',
    organ: 'Throat (कण्ठ)',
    description: 'Indicates the elision of short initial a following e or o due to pūrvarūpa Sandhi.'
  }
];

export const PHONOLOGICAL_GROUPS: PhonologicalGroupData[] = [
  {
    id: 'guttural',
    englishName: 'Guttural (Velar)',
    sanskritName: 'कण्ठ्य',
    sanskritTerm: 'कण्ठ्य (Kaṇṭhya)',
    organ: 'Throat / Soft Palate (कण्ठ)',
    description: 'Sounds produced at the root of the tongue touching the soft palate or deep within the throat.',
    phonemes: SANSKRIT_PHONEMES.filter(p => p.group === 'guttural')
  },
  {
    id: 'palatal',
    englishName: 'Palatal',
    sanskritName: 'तालव्य',
    sanskritTerm: 'तालव्य (Tālavya)',
    organ: 'Hard Palate (तालु)',
    description: 'Sounds produced by raising the middle blade of the tongue flat against the hard palate.',
    phonemes: SANSKRIT_PHONEMES.filter(p => p.group === 'palatal')
  },
  {
    id: 'retroflex',
    englishName: 'Retroflex (Cerebral)',
    sanskritName: 'मूर्धन्य',
    sanskritTerm: 'मूर्धन्य (Mūrdhanya)',
    organ: 'Roof of Mouth / Palatal Dome (मूर्धा)',
    description: 'Sounds produced by curling the tip of the tongue upwards and backwards against the roof of the palate.',
    phonemes: SANSKRIT_PHONEMES.filter(p => p.group === 'retroflex')
  },
  {
    id: 'dental',
    englishName: 'Dental',
    sanskritName: 'दन्त्य',
    sanskritTerm: 'दन्त्य (Dantya)',
    organ: 'Upper Teeth (दन्त)',
    description: 'Sounds produced by touching the tip of the tongue firmly against the back of the upper incisors.',
    phonemes: SANSKRIT_PHONEMES.filter(p => p.group === 'dental')
  },
  {
    id: 'labial',
    englishName: 'Labial',
    sanskritName: 'ओष्ठ्य',
    sanskritTerm: 'ओष्ठ्य (Oṣṭhya)',
    organ: 'Lips (ओष्ठ)',
    description: 'Sounds produced by the contact or rounding of the upper and lower lips.',
    phonemes: SANSKRIT_PHONEMES.filter(p => p.group === 'labial' || p.group === 'dentolabial')
  }
];
