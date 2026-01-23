import { Character, GlossaryItem, ItemType } from '../types';

export const CHARACTERS: Character[] = [
  { type: 'guy', src: "/assets/Young_man.png" },
  { type: 'gogo', src: "/assets/Gogo.png" },
  { type: 'child', src: "/assets/Small_boy.png" }
];

export const ITEMS: ItemType[] = ['Bread', 'Coke', 'Milk', 'Goslos', 'Eggs', 'Benny'];

export const PHRASES = {
  guy: [
    "Ekse my friend, shaya {item} there. I have half-tiger only.",
    "Hola! Gimme {item} there. Sharp.",
    "Heita. Shaya {item}, boss. I'm in a rush.",
    "Ekse, shaya {item}. I got a pinkie, you got change?",
    "Hola, shaya {item}. And a loose draw? No? Okay."
  ],
  child: [
    "Malume... mama said I must buy {item}. She gave me R20.",
    "My friend... can I have {item}? Please.",
    "Malume, here is the money for {item}.",
    "Malume... mama is asking for {item}. Quick please."
  ],
  gogo: [
    "Molo mntanami. Can I please have {item}.",
    "Sbali, I need {item}.",
    "Mntanami, give Gogo {item}. You are a good boy.",
    "Molo. I have a R50 here, give me {item}."
  ]
};

export const GLOSSARY: GlossaryItem[] = [
  { word: "Mntanami", meaning: "My child", context: "Used by elders (like Gogo) to address younger people with affection." },
  { word: "Malume", meaning: "Uncle", context: "Used by children to address any adult male respectfully." },
  { word: "Ekse", meaning: "Hey / Listen here", context: "A common slang greeting to grab attention." },
  { word: "Heita / Hola", meaning: "Hello", context: "Cool, informal greetings used by guys." },
  { word: "Shaya", meaning: "Hit / Give me", context: "Slang, e.g., 'Shaya bread' means 'Give me bread'." },
  { word: "Tiger", meaning: "R10 Note", context: "Common currency slang." },
  { word: "Half-Tiger", meaning: "R5 Coin", context: "Half of a tiger (R10)." },
  { word: "Pinkies", meaning: "R50 Note", context: "Refers to the pinkish color of the R50 note." },
  { word: "Sbali", meaning: "Brother-in-law / Friend", context: "Friendly term of endearment among peers or from elders." },
  { word: "Molo", meaning: "Hello", context: "Standard Xhosa/Zulu greeting." }
];