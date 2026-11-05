import { Suspense } from 'react';
import { PageHero } from '@/components/site/ui';
import { DeskForm } from './view';

export const metadata = { title: 'The People’s Help Desk', description: 'Ask Chief Barr. Dumo Lulu Briggs’s team a question or report a problem. Every case gets a reference and an answer within 5 working days.' };

export default function Desk() {
  return (
    <>
      <PageHero eyebrow="The People’s Help Desk" title="Ask. Report. Get an answer." lead="Ask Chief Barr. Dumo’s team a question or report a problem. Every case gets a reference number and an answer within 5 working days." />
      <Suspense fallback={<p className="muted narrow s-pad">Loading…</p>}>
        <DeskForm />
      </Suspense>
    </>
  );
}
