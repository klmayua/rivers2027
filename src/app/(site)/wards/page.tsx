import { PageHero, Section } from '@/components/site/ui';
import { WardList } from './view';

export const metadata = { title: 'Find your ward', description: 'Twenty-six wards across Rivers State and Rivers State, each with a page for the week’s issue.' };

export default function Wards() {
  return (
    <>
      <PageHero eyebrow="Your ward" title="Find your ward." lead="Twenty-six wards across Rivers State and Rivers State. Each has its own page for this week’s issue, with the facts and a way to ask Chief Barr. Dumo." />
      <Section>
        <WardList />
      </Section>
    </>
  );
}
