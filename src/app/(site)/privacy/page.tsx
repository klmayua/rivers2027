import Link from 'next/link';
import { PageHero, Section } from '@/components/site/ui';

export const metadata = { title: 'Privacy', description: 'What the Chief Barr. Dumo Lulu Briggs campaign collects, why, and how to ask for it to be removed.' };

export default function Privacy() {
  return (
    <>
      <PageHero eyebrow="Privacy" title="What we collect, and why." lead="Political opinion is sensitive personal data. We ask for as little as we can and say what it is for." />
      <Section narrow>
        <div className="s-prose">
          <h3>What we ask for</h3>
          <p>A name, a phone number or email, your ward, and the choices you tick: SMS updates, a WhatsApp group, the Youth Academy, or a gift receipt. The Help Desk asks for a question and, if you wish, your name and ward.</p>
          <h3>What we do with it</h3>
          <p>Only what you ticked. Messages carry a reply-STOP opt-out. We do not sell your details, and a gift or a registration is never tied to how you vote.</p>
          <h3>Gifts</h3>
          <p>Payment processing, campaign account details, receipts and applicable legal limits require campaign and counsel confirmation before launch. The current prototype should not be used to collect contributions.</p>
          <h3>The chat</h3>
          <p>Ogami is an AI assistant. Please do not type card numbers, passwords or other private details into it. Questions it cannot answer go to the Help Desk.</p>
          <h3>On this preview</h3>
          <p>This preview build keeps everything you enter in your own browser only. Nothing is sent to a campaign server. Clearing your browser’s site data removes it.</p>
          <h3>Your rights</h3>
          <p>You can ask to see, correct or delete your details through the <Link href="/help-desk?topic=Something%20else">Help Desk</Link>. The campaign’s data-protection contact will be published here before the live launch.</p>
        </div>
      </Section>
    </>
  );
}
