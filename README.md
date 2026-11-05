# Rivers 2027 campaign site

Next.js campaign information site adapted for Chief Barr. Dumo Lulu Briggs, NDC governorship candidate for Rivers State. The reference interface and design language are retained.

## Data used

- `src/data/rivers-geography.json`: Rivers State hierarchy extracted from the supplied NG2027 INEC-derived geography source: 23 LGAs, 319 wards, 6,866 polling units. Polling-unit names and codes are included.
- `src/data/rivers-presidential-2023.json`: Rivers State summary extracted from the supplied 2023 presidential result dataset.
- `src/data/campaign.ts` and `src/data/agenda.ts`: election date from INEC’s published 2027 timetable and candidate statements attributed to a Premium Times report published 6 October 2026.
- The supplied geography source does not include registered-voter counts. The app does not infer those counts from polling-unit totals.

## Open campaign materials

The candidate-approved biography, formal manifesto, implementation costings, event calendar, campaign budget and current registered-voter totals have not been supplied. Related pages mark those materials as pending. Any preview activity figures remain illustrative.

## Run

Requires Node.js 20.9 or newer. Run `npm ci`, then `npm run dev`. Available project commands include `npm run typecheck`, `npm run lint` and `npm run build`.
