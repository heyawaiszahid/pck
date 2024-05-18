interface InvitationProps {
  firstName: string;
  companyName: string;
  href: string;
}

const Invitation: React.FC<Readonly<InvitationProps>> = ({ firstName, companyName, href }) => (
  <div>
    <p>Hi {firstName},</p>
    <p>
      You have been added to the {companyName} team. Click <a href={href}>here</a> to accept.
    </p>
    <br />
    <p>
      Best Regards,
      <br />
      <br />
      Pipeline Conversion Kit
      <br />
      <a href="https://pipelineconversionkit.com">www.pipelineconversionkit.com</a>
    </p>
  </div>
);

export default Invitation;
