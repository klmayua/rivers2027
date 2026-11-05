import { PageHero, Section } from '@/components/site/ui';
import { EventList } from './view';

export const metadata = { title: 'Live and town halls', description: 'Ask Chief Barr. Dumo Live every Sunday at 8pm, town halls across Rivers State and Rivers State, and diaspora town halls on video.' };

export default function Events() {
  return (
    <>
      <PageHero eyebrow="Events" title="Where to meet him, and when." lead="All town halls and ward walks are open to everyone and carry no gift or condition. Dates shown as proposed are confirmed a week ahead." />
      <Section>
        <EventList />
      </Section>
    </>
  );
}
