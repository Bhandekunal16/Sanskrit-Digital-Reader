# Interactive Sanskrit Passage Reader

The **Sanskrit Vani** passage reader at `/reader` provides an interactive, tokenized learning canvas for classical Sanskrit literature.

---

## 📜 Educational Purpose

Classical Sanskrit verse (*kāvya* and *śāstra*) employs complex poetic meters, extensive Sandhi concatenation, and flexible poetic word order. The Reader decomposes these verses into interactive units that illuminate:
1. **Word-Level Grammar**: Case (*Vibhakti*), Gender (*Liṅga*), Number (*Vacana*), Root (*Dhātu*), and Tense (*Lakāra*).
2. **Sandhi Resolution (*Padaccheda*)**: Shows how concatenated words separate into their uncombined forms.
3. **Prose Reconstruction (*Anvaya*)**: Reconstructs verses into standard Subject-Object-Verb syntactic word order.
4. **Multilingual Translations**: Allows switching between Hindi, Marathi, and English translations.

---

## 📚 Passage Library

Curated classical verses included in `src/data/passages.ts`:

1. **The Chain of Learning (*Hitopadeśa*)**:
   - `विद्या ददाति विनयं विनयाद् याति पात्रताम्।`
   - Demonstrates ablative causality and noun inflection.
2. **Doctrine of Selfless Action (*Bhagavad Gītā 2.47*)**:
   - `कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।`
   - Demonstrates locative case (*saptamī*), genitive pronouns, and imperative negation.
3. **Peace Invocation of Teacher and Student (*Taittirīya Upaniṣad*)**:
   - `ॐ सह नाववतु। सह नौ भुनक्तु।`
   - Demonstrates dual pronouns (*nau*), Vedic benedictions, and imperative verb forms.

---

## 🧩 Reader Component Architecture

- `SanskritReader.tsx`: Main reader view managing passage selection, active language state, and token selection.
- Word tokens are rendered as clickable buttons that open an inspection drawer showing root, morphology, and multilingual glosses.
