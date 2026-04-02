# Managerial Economics Exam Trainer

Nederlandstalige Next.js exam trainer voor `Managerial Economics`, opgebouwd rond oude tentamenthema's en exam-style oefenvragen.

## Installeren

```bash
npm install
```

## Starten

```bash
npm run dev
```

Open daarna `http://localhost:3000`.

## Wat zit erin

- oefenen per onderwerp
- willekeurige examenvraag
- mini-toets generator met localStorage-opslag
- volledig tentamen oefenen
- dashboard met zwakke onderwerpen
- formule- en conceptoverzicht

## Waar leeft de content?

- Vragen: [data/questions.ts](/Users/tomvandermost/Desktop/The Future /Nyenrode/Blok 2/FOR/Webapp oefenen/data/questions.ts)
- Formules: [data/formulas.ts](/Users/tomvandermost/Desktop/The Future /Nyenrode/Blok 2/FOR/Webapp oefenen/data/formulas.ts)
- Onderwerpen: [data/topics.ts](/Users/tomvandermost/Desktop/The Future /Nyenrode/Blok 2/FOR/Webapp oefenen/data/topics.ts)
- Types: [types/index.ts](/Users/tomvandermost/Desktop/The Future /Nyenrode/Blok 2/FOR/Webapp oefenen/types/index.ts)

## Meer vragen toevoegen

1. Voeg een nieuw `PracticeQuestion` object toe in [data/questions.ts](/Users/tomvandermost/Desktop/The Future /Nyenrode/Blok 2/FOR/Webapp oefenen/data/questions.ts).
2. Gebruik een unieke `id`.
3. Kies een bestaand `topic`, `difficulty` en `type`.
4. Vul altijd `hints`, `steps`, `finalAnswer`, `explanation` en `commonMistakes` in zodat de app volledige uitwerking kan tonen.
5. Voeg eventueel `hasDiagram: true` toe als een eenvoudige SVG-visual nuttig is.

## Interactieve grafiekoefeningen toevoegen

1. Maak een nieuw oefenobject aan in [data/graph-exercises.ts](/Users/tomvandermost/Desktop/The Future /Nyenrode/Blok 2/FOR/Webapp oefenen/data/graph-exercises.ts).
2. Definieer daar de `regions`, `lines`, `texts` en `prompts`.
3. Koppel de oefening aan een vraag via `interactiveGraphExercise` in [data/questions.ts](/Users/tomvandermost/Desktop/The Future /Nyenrode/Blok 2/FOR/Webapp oefenen/data/questions.ts).
4. Gebruik in elke prompt:
   - `questionText` in het Nederlands
   - `correctRegions` als array van regioletters
   - `definitionNL` voor de economische definitie in het Nederlands, met de English term expliciet genoemd
   - `explanationNL` voor de Nederlandse toelichting

## Opmerking

Voortgang, markeringen en mini-toetsstatus worden alleen lokaal in de browser opgeslagen. Er is geen backend of database nodig.
