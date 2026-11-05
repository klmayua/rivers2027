import { OgamiPanel } from '@/components/ogami-chat';
import { PageHero } from '@/components/site/ui';

export const metadata = { title: 'Ask Ogami', description: 'Ask the campaign anything. Ogami is an AI assistant that answers from Chief Barr. Dumo Lulu Briggs’s published Contract and Agenda, and sends the rest to the People’s Help Desk.' };

export default function Ask() {
  return (
    <>
      <PageHero eyebrow="Ask the campaign" title="Ask anything. Get a straight answer, or a person." lead="Ogami is the campaign’s digital front desk, an AI assistant. It knows the Contract and the Agenda, your ward and the next town hall, and passes everything else to the People’s Help Desk." />
      <div className="wrap s-pad">
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <OgamiPanel height="min(680px, calc(100dvh - 190px))" />
        </div>
      </div>
    </>
  );
}
