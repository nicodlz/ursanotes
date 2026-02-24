import type { Note } from "../schemas/index.js";

const now = Date.now();

export const welcomeNote: Note = {
  id: "00000000-0000-0000-0000-000000000001",
  title: "Welcome to Ursanotes",
  content: `# Welcome to Ursanotes 🔐

Your **end-to-end encrypted** markdown notes.

## Features

- ✨ Beautiful markdown editor with syntax highlighting
- 🔒 E2EE with your passkey (keys derived from PRF - no recovery key needed!)
- 📱 Offline-first - works without internet
- 🔄 Sync across devices with the same passkey

## Getting Started

1. Create a new note from the sidebar
2. Write your markdown content
3. See live preview on the right

---

*Happy writing!* 📝
`,
  folderId: null,
  tags: [],
  createdAt: now,
  updatedAt: now,
};

export const cvSoftwareEngineerEN: Note = {
  id: "00000000-0000-0000-0000-000000000010",
  title: "CV - Software Engineer (EN)",
  content: `# Nicolas TIMON

Software Engineer TypeScript | React | Fintech

8 years of experience, based in Portugal

linkedin.com/in/nicolas-timon
https://github.com/nicodlz

---

## Professional Experience

### Software Engineer | Darika Labs *(2025 - 2026)*

Developing infrastructure for a FX stablecoin platform enabling currency exchange.

- Building aggregation layer unifying multiple market makers into a single consistent pricing engine
- Architecting event-driven backend with Server-Sent Events for real-time price streaming
- Developing scalable APIs, data layer and UX oriented frontend

Tech: TypeScript, Hono, Prisma, SSE

### Software Engineer | Vencer.ai *(2025)*

Built Portuguese public procurement platform, streamlining tender discovery for SMEs.
Architected full-stack solution: TypeScript backend with Hono, PostgreSQL database, frontend with React.
Developed automated scraper with Playwright for Portuguese public tender aggregation.
Implemented AI-powered search and interactive chat interface for contract analysis.
Bootstrapped entire technical infrastructure and product.

Tech: TypeScript, React, Hono, PostgreSQL, Playwright, LLM integration

### Software Engineer | Rauva *(2025)*

Developed next-generation fintech infrastructure for European SMEs

- Architecting scalable REST APIs and microservices
- Implementing secure payment integrations (Swan, Sibs)
- Leading technical decisions for 8500+ active business customers

Tech: TypeScript, React, PostgreSQL with Sequelize, Netlify, lambdas

### Software Engineer | Bangr Labs *(2022 - 2024)*

DeFi mobile app democratizing DeFi access through account abstraction

- Led 3-person technical team, full product ownership from concept to production
- Built complete stack: Mobile app + backend + smart contracts
- Architected smart contract wallet system with transaction relay infrastructure
- Won 5 major hackathons with interoperability and UX solutions

Tech: React Native, TypeScript, Solidity, Next.js, Prisma, PostgreSQL, Ethers.js

### Software Engineer | Onepoint *(2017 - 2021)*

- Developed proofs-of-concept and technical prototypes
- Web frontend in HTML and JavaScript
- Python 3 backend APIs (Flask)
- SQL databases (MariaDB)

---

## Education

Université de Technologie de Compiègne *(2018 - 2022)*
Engineering Program, Computer Engineering Major

IUT de Villetaneuse, Université Paris 13 *(2016 - 2018)*
Two-year university diploma in Computer Science

---

## Awards

- Nuclear Bridge: 1st place at ETHCC Hack 2022 – Interoperability protocol for EVM blockchains
- Boomerang: Awarded by Hyperlane (1st prize) at ETHBerlin 2022 – Browser extension for blockchain interoperability automation
- EasySafe: Awarded by Safe at ETHLisbon 2022 – Simplified interface for Safe smart wallets
- DeFiPooler: Awarded by Axelar (1st prize) and Covalent at ETHDenver 2023 – Protocol pooling interoperability costs in DeFi

---

## Community Engagement

- Founded Hack'UTC: Student association promoting cybersecurity awareness and education
- Volunteer at ETHCC: Major Ethereum community conference
- Active participation in tech meetups: The Arch, DeFi France, Paris Blockchain Society

---

## Skills & Tech Stack

- Languages: TypeScript, JavaScript, Python, SQL
- Frameworks & Libraries: React, Hono, Prisma, Next.js, Flask, React Native
- Tools: PostgreSQL, AWS: IAM, lambdas, S3, Git, Playwright

---

References available upon request.
`,
  folderId: null,
  tags: ["cv"],
  createdAt: now,
  updatedAt: now,
};

export const cvSoftwareEngineerFR: Note = {
  id: "00000000-0000-0000-0000-000000000011",
  title: "CV - Ingénieur Logiciel (FR)",
  content: `# Nicolas TIMON

Ingénieur Logiciel TypeScript | React | Fintech

8 ans d'expérience, basé au Portugal

linkedin.com/in/nicolas-timon
https://github.com/nicodlz

---

## Expérience professionnelle

### Ingénieur Logiciel | Darika Labs *(2025 - 2026)*

Développement de l'infrastructure d'une plateforme de stablecoins FX permettant l'échange de devises.

- Conception d'une couche d'agrégation unifiant plusieurs market makers en un moteur de pricing cohérent
- Architecture événementielle avec Server-Sent Events pour le streaming de prix en temps réel
- Développement d'APIs scalables, de la couche data et du frontend orienté UX

Tech : TypeScript, Hono, Prisma, SSE

### Ingénieur Logiciel | Vencer.ai *(2025)*

Conception et développement d'une plateforme portugaise de marchés publics, facilitant la découverte d'appels d'offres pour les PME.
Architecture full-stack : backend TypeScript avec Hono, base PostgreSQL, frontend React.
Développement d'un scraper automatisé avec Playwright pour l'agrégation d'appels d'offres portugais.
Implémentation d'un moteur de recherche IA et d'une interface de chat pour l'analyse de contrats.
Développement de l'ensemble de l'infrastructure technique et du produit.

Tech : TypeScript, React, Hono, PostgreSQL, Playwright, intégration LLM

### Ingénieur Logiciel | Rauva *(2025)*

Développement d'infrastructure fintech pour les PME européennes

- Architecture d'APIs REST scalables et microservices
- Implémentation d'intégrations de paiement sécurisées (Swan, Sibs)
- Participation aux décisions techniques pour 8 500+ clients actifs

Tech : TypeScript, React, PostgreSQL avec Sequelize, Netlify, lambdas

### Ingénieur Logiciel | Bangr Labs *(2022 - 2024)*

Application mobile DeFi démocratisant l'accès à la finance décentralisée via l'account abstraction

- Direction d'une équipe technique de 3 personnes, responsabilité produit complète du concept à la production
- Développement du stack complet : application mobile + backend + smart contracts
- Architecture d'un système de wallet smart contract avec infrastructure de relai de transactions
- 5 hackathons majeurs remportés

Tech : React Native, TypeScript, Solidity, Next.js, Prisma, PostgreSQL, Ethers.js

### Ingénieur Logiciel | Onepoint *(2017 - 2021)*

- Développement de preuves de concept et prototypes
- Frontends web en HTML et JavaScript
- APIs backend en Python 3 (Flask)
- Bases de données SQL (MariaDB)

---

## Formation

Université de Technologie de Compiègne *(2018 - 2022)*
Diplôme d'ingénieur, spécialité Informatique

IUT de Villetaneuse, Université Paris 13 *(2016 - 2018)*
DUT Informatique

---

## Distinctions

- Nuclear Bridge : 1ère place ETHCC Hack 2022 – Protocole d'interopérabilité pour blockchains EVM
- Boomerang : Récompensé par Hyperlane (1er prix) à ETHBerlin 2022 – Extension navigateur pour l'automatisation de l'interopérabilité blockchain
- EasySafe : Récompensé par Safe à ETHLisbon 2022 – Interface simplifiée pour wallets Safe
- DeFiPooler : Récompensé par Axelar (1er prix) et Covalent à ETHDenver 2023 – Mutualisation des coûts d'interopérabilité DeFi

---

## Engagement communautaire

- Fondateur de Hack'UTC : association étudiante de sensibilisation à la cybersécurité
- Bénévole à ETHCC : conférence majeure de la communauté Ethereum
- Participation active à des meetups tech : The Arch, DeFi France, Paris Blockchain Society

---

## Compétences techniques

- Langages : TypeScript, JavaScript, Python, SQL
- Frameworks & Librairies : React, Hono, Prisma, Next.js, Flask, React Native
- Outils : PostgreSQL, AWS : IAM, lambdas, S3, Git, Playwright

---

Références disponibles sur demande.
`,
  folderId: null,
  tags: ["cv"],
  createdAt: now,
  updatedAt: now,
};

export const cvBlockchainEN: Note = {
  id: "00000000-0000-0000-0000-000000000012",
  title: "CV - Blockchain Developer (EN)",
  content: `# Nicolas TIMON

Blockchain Developer Solidity | Technical Co-founder

8 years of experience, based in Portugal

linkedin.com/in/nicolas-timon
https://github.com/nicodlz

---

## Professional Experience

### Blockchain Developer | Darika Labs *(2025 - 2026)*

Developing infrastructure for a FX stablecoin platform enabling currency exchange.

- Building aggregation layer unifying multiple market makers into a single consistent pricing engine
- Architecting event-driven backend with Server-Sent Events for real-time price streaming
- Developing scalable APIs and UX oriented frontend

Tech: TypeScript, Hono, Prisma, SSE, stablecoins, FX

### Independent Blockchain Developer *(2024 - 2025)*

[TheGoat.bid](https://www.thegoat.bid): Decentralized, on-chain avatar generator and daily auction platform

- Solidity smart contract in production ($50,000+ volume)

Tech: Solidity, Hardhat, React, TypeScript

### Co-founder & Lead Developer | Bangr Labs *(2022 - 2024)*

Co-founded DeFi mobile app democratizing DeFi access through account abstraction

- Led 3-person technical team, full product ownership from concept to production
- Built complete stack: Mobile app + backend + smart contracts
- Architected smart contract wallet system with transaction relay infrastructure
- Won 5 major hackathons with interoperability and UX solutions

Tech: React Native, TypeScript, Solidity, Next.js, Prisma, PostgreSQL, Ethers.js

### Full-Stack Developer | Vencer.ai *(2025)*

Co-founded Portuguese public procurement platform, streamlining tender discovery for SMEs.
Architected full-stack solution: TypeScript backend with Hono, PostgreSQL database, frontend with React.
Developed automated scraper with Playwright for Portuguese public tender aggregation.
Implemented AI-powered search and interactive chat interface for contract analysis.

Tech: TypeScript, React, Hono, PostgreSQL, Playwright, LLM integration

### Blockchain Developer | Onepoint *(2017 - 2021)*

- Developed blockchain proofs-of-concept
- Solidity smart contracts on Ethereum
- Web frontend in HTML and JavaScript
- Python 3 backend APIs (Flask)
- SQL databases (MariaDB)

---

## Education

Université de Technologie de Compiègne *(2018 - 2022)*
Engineering Program, Computer Engineering Major

IUT de Villetaneuse, Université Paris 13 *(2016 - 2018)*
Two-year university diploma in Computer Science

---

## Projects & Awards

- [Moonolith.lol](https://moonolith.lol): Platform for pixel art expression, stored fully on Ethereum blockchain
- Nuclear Bridge: 1st place at ETHCC Hack 2022 – Interoperability protocol for EVM blockchains
- Boomerang: Awarded by Hyperlane (1st prize) at ETHBerlin 2022 – Browser extension for blockchain interoperability automation
- EasySafe: Awarded by Safe at ETHLisbon 2022 – Simplified interface for Safe smart wallets
- DeFiPooler: Awarded by Axelar (1st prize) and Covalent at ETHDenver 2023 – Protocol pooling interoperability costs in DeFi

---

## Volunteer Experience & Community Engagement

- Founder of Hack'UTC: Student association promoting cybersecurity awareness and education
- Volunteer at ETHCC: Major Ethereum community conference
- Active participation in blockchain meet-ups: The Arch, DeFi France, Paris Blockchain Society
- Speaker: Ethereum staking presentation for The Arch association
- Documenting startup journey on [YouTube](https://www.youtube.com/watch?v=JXPeKwhcacg)

---

## Skills & Tech Stack

- Blockchain: Solidity, Hardhat, Ethers.js, Smart Contracts, EVM, Account Abstraction, ERC-4337, DeFi, Stablecoins
- Languages: TypeScript, JavaScript, Python, SQL
- Frameworks & Libraries: React, React Native, Hono, Prisma, Next.js, Flask
- Tools: PostgreSQL, AWS: IAM, lambdas, S3, Git

---

References available upon request.
`,
  folderId: null,
  tags: ["cv"],
  createdAt: now,
  updatedAt: now,
};

export const cvBlockchainFR: Note = {
  id: "00000000-0000-0000-0000-000000000013",
  title: "CV - Développeur Blockchain (FR)",
  content: `# Nicolas TIMON

Développeur Blockchain Solidity | Co-fondateur technique

8 ans d'expérience, basé au Portugal

linkedin.com/in/nicolas-timon
https://github.com/nicodlz

---

## Expérience professionnelle

### Développeur Blockchain | Darika Labs *(2025 - 2026)*

Développement de l'infrastructure d'une plateforme de stablecoins FX permettant l'échange de devises.

- Conception d'une couche d'agrégation unifiant plusieurs market makers en un moteur de pricing cohérent
- Architecture événementielle avec Server-Sent Events pour le streaming de prix en temps réel
- Développement d'APIs scalables et du frontend orienté UX

Tech : TypeScript, Hono, Prisma, SSE, stablecoins, FX

### Développeur Blockchain Indépendant *(2024 - 2025)*

[TheGoat.bid](https://www.thegoat.bid) : Générateur d'avatars on-chain décentralisé et plateforme d'enchères quotidiennes

- Smart contract Solidity en production (50 000$+ de volume)

Tech : Solidity, Hardhat, React, TypeScript

### Co-fondateur & Lead Developer | Bangr Labs *(2022 - 2024)*

Co-fondation d'une application mobile DeFi démocratisant l'accès à la finance décentralisée via l'account abstraction

- Direction d'une équipe technique de 3 personnes, responsabilité produit complète du concept à la production
- Développement du stack complet : application mobile + backend + smart contracts
- Architecture d'un système de wallet smart contract avec infrastructure de relai de transactions
- 5 hackathons majeurs remportés avec des solutions d'interopérabilité et d'UX

Tech : React Native, TypeScript, Solidity, Next.js, Prisma, PostgreSQL, Ethers.js

### Développeur Full-Stack | Vencer.ai *(2025)*

Co-fondation d'une plateforme portugaise de marchés publics facilitant la découverte d'appels d'offres pour les PME.
Architecture full-stack : backend TypeScript avec Hono, base PostgreSQL, frontend React.
Développement d'un scraper automatisé avec Playwright pour l'agrégation d'appels d'offres.
Implémentation d'un moteur de recherche IA et d'une interface de chat pour l'analyse de contrats.

Tech : TypeScript, React, Hono, PostgreSQL, Playwright, intégration LLM

### Développeur Blockchain | Onepoint *(2017 - 2021)*

- Développement de preuves de concept blockchain
- Smart contracts Solidity sur Ethereum
- Frontend web en HTML et JavaScript
- APIs backend en Python 3 (Flask)
- Bases de données SQL (MariaDB)

---

## Formation

Université de Technologie de Compiègne *(2018 - 2022)*
Diplôme d'ingénieur, spécialité Informatique

IUT de Villetaneuse, Université Paris 13 *(2016 - 2018)*
DUT Informatique

---

## Projets & Distinctions

- [Moonolith.lol](https://moonolith.lol) : Plateforme de pixel art stocké intégralement sur la blockchain Ethereum
- Nuclear Bridge : 1ère place ETHCC Hack 2022 – Protocole d'interopérabilité pour blockchains EVM
- Boomerang : Récompensé par Hyperlane (1er prix) à ETHBerlin 2022 – Extension navigateur pour l'automatisation de l'interopérabilité blockchain
- EasySafe : Récompensé par Safe à ETHLisbon 2022 – Interface simplifiée pour wallets Safe
- DeFiPooler : Récompensé par Axelar (1er prix) et Covalent à ETHDenver 2023 – Mutualisation des coûts d'interopérabilité DeFi

---

## Engagement communautaire

- Fondateur de Hack'UTC : association étudiante de sensibilisation à la cybersécurité
- Bénévole à ETHCC : conférence majeure de la communauté Ethereum
- Participation active à des meetups blockchain : The Arch, DeFi France, Paris Blockchain Society
- Speaker : présentation sur le staking Ethereum pour The Arch
- Documentation du parcours startup sur [YouTube](https://www.youtube.com/watch?v=JXPeKwhcacg)

---

## Compétences techniques

- Blockchain : Solidity, Hardhat, Ethers.js, Smart Contracts, EVM, Account Abstraction, ERC-4337, DeFi, Stablecoins
- Langages : TypeScript, JavaScript, Python, SQL
- Frameworks & Librairies : React, React Native, Hono, Prisma, Next.js, Flask
- Outils : PostgreSQL, AWS : IAM, lambdas, S3, Git

---

Références disponibles sur demande.
`,
  folderId: null,
  tags: ["cv"],
  createdAt: now,
  updatedAt: now,
};

export const defaultNotes: Note[] = [
  welcomeNote,
  cvSoftwareEngineerEN,
  cvSoftwareEngineerFR,
  cvBlockchainEN,
  cvBlockchainFR,
];
