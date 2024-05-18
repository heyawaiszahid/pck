interface InvitationProps {
  companyName: string;
}

const DiscoveryFramework: React.FC<Readonly<InvitationProps>> = ({ companyName }) => (
  <div>
    <p>Dear Administrator,</p>
    <p>
      This is an automated notification to inform you that {companyName} has submitted the intake form for the Discovery
      Framework. Please log into your dashboard to review their submission.
    </p>
    <br />
    <p>
      Thank you,
      <br />
      <br />
      Pipeline Conversion Kit
      <br />
      <a href="https://pipelineconversionkit.com">www.pipelineconversionkit.com</a>
    </p>
  </div>
);

export default DiscoveryFramework;
