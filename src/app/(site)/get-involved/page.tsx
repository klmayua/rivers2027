import { Icon } from '@/components/brand';
import { PageHero } from '@/components/site/ui';
import { JoinForm } from '@/components/join';

export const metadata = { title: 'Get involved', description: 'Join Chief Barr. Dumo Lulu Briggs’s ground team as a supporter, a champion for your market or union, or a polling-unit agent.' };

const WAYS = [
  { icon: 'heart', t: 'Supporter', b: 'Get the facts for your ward, the week’s issue and the dates of town halls. Tell your family and friends.' },
  { icon: 'share', t: 'Champion', b: 'Carry one link to your market, church fellowship, union or alumni group. Your group sees its own running total. Nobody sees a name or an amount.' },
  { icon: 'shield', t: 'Polling-unit agent', b: 'Protect the vote on 6 March: be at your unit, photograph the result sheet and upload it. A ward coordinator approves every agent.' },
];

export default function GetInvolved() {
  return (
    <>
      <PageHero eyebrow="Get involved" title="This campaign is built ward by ward and unit by unit." lead="Tell us where you are and how you want to help. Your ward coordinator will welcome you." />
      <div className="wrap s-pad s-two">
        <div className="col gap14">
          {WAYS.map((w) => (
            <div className="s-act slim static" key={w.t}>
              <span className="ic"><Icon name={w.icon} size={22} /></span>
              <div><h3>{w.t}</h3><p>{w.b}</p></div>
            </div>
          ))}
        </div>
        <div className="card"><JoinForm /></div>
      </div>
    </>
  );
}
