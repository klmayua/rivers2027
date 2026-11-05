import { PageHero, Section } from '@/components/site/ui';
import { NewsList } from './view';

export const metadata = { title: 'News and statements', description: 'From the campaign trail, the press and the community. Each item names its source.' };

export default function News() {
  return (
    <>
      <PageHero eyebrow="News and statements" title="From the trail." lead="Visits, speeches and press releases. Each item names its source." />
      <Section narrow>
        <NewsList />
      </Section>
    </>
  );
}
