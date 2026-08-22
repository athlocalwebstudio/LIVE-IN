"use client";

import styles from "@/app/privacyPolicy.module.css";

const PrivacyPolicy = () => {
  return (
    <section className={styles.privacySection}>
      <div className={styles.container}>
        <h1 className={styles.title}>Privacy Policy</h1>

        <p className={styles.updated}>
          <strong>Last updated: August 2026</strong>
        </p>

        <p className={styles.paragraph}>
          This Privacy Policy explains how Live In ("Live In", "we", "us", or
          "our") collects, uses, stores, and protects information when you
          visit our website, purchase or use our digital products, create an
          account, use our launcher, or otherwise interact with our Services.
        </p>

        <p className={styles.paragraph}>
          We respect your privacy and aim to collect only information that is
          reasonably necessary to operate our Services, process purchases,
          provide customer support, maintain security, and improve our
          products.
        </p>

        <p className={styles.paragraph}>
          By using our Services, you acknowledge that you have read and
          understood this Privacy Policy.
        </p>

        {/* 1 */}
        <h2 className={styles.heading}>1. Who We Are</h2>

        <p className={styles.paragraph}>
          Live In provides digital software, games, interactive entertainment
          products, and related services.
        </p>

        <p className={styles.paragraph}>
          For privacy-related questions, requests, or concerns, you can
          contact us at:
        </p>

        <p className={styles.paragraph}>
          <a
            href="mailto:athlocalwebstudio@gmail.com"
            className={styles.link}
          >
            athlocalwebstudio@gmail.com
          </a>
        </p>

        <p className={styles.paragraph}>
          The exact legal identity and address of the data controller may also
          be displayed through the applicable checkout or legal information
          associated with our payment provider.
        </p>

        {/* 2 */}
        <h2 className={styles.heading}>2. Information We Collect</h2>

        <p className={styles.paragraph}>
          The information we collect depends on how you interact with our
          Services.
        </p>

        <p className={styles.paragraph}>
          We may collect the following categories of information.
        </p>

        <h3 className={styles.subheading}>Account and Authentication Data</h3>

        <ul className={styles.list}>
          <li>Username or display name</li>
          <li>Third-party account identifier where applicable</li>
          <li>Authentication and session information</li>
          <li>Account creation and authentication timestamps</li>
          <li>Installation identifiers associated with the launcher</li>
        </ul>

        <p className={styles.paragraph}>
          Authentication secrets and session credentials are designed to be
          stored using security measures such as cryptographic hashing where
          appropriate. We do not intentionally store plaintext authentication
          secrets after they have been securely processed.
        </p>

        <h3 className={styles.subheading}>Purchase Information</h3>

        <p className={styles.paragraph}>
          When you purchase one of our products, information relating to the
          transaction may be made available to us by our payment provider.
          This may include:
        </p>

        <ul className={styles.list}>
          <li>Email address</li>
          <li>Product purchased</li>
          <li>Order or transaction identifier</li>
          <li>Subscription status where applicable</li>
          <li>Purchase date</li>
          <li>Relevant payment or transaction status</li>
        </ul>

        <p className={styles.paragraph}>
          We do not intentionally collect or store your full payment card
          number, card security code, or complete payment credentials on our
          own servers.
        </p>

        <h3 className={styles.subheading}>Technical Information</h3>

        <p className={styles.paragraph}>
          When you access our website or Services, certain technical
          information may be processed automatically, including:
        </p>

        <ul className={styles.list}>
          <li>IP address</li>
          <li>Browser type and version</li>
          <li>Operating system</li>
          <li>Device type</li>
          <li>Approximate location derived from IP address</li>
          <li>Pages or resources requested</li>
          <li>Date and time of requests</li>
          <li>Referring website or URL where available</li>
          <li>Basic diagnostic and security information</li>
        </ul>

        <h3 className={styles.subheading}>Support Information</h3>

        <p className={styles.paragraph}>
          If you contact us for support, we may receive information that you
          choose to provide, such as your email address, username, purchase
          information, technical details, screenshots, error messages, or
          descriptions of a problem.
        </p>

        {/* 3 */}
        <h2 className={styles.heading}>3. Information We Do Not Intentionally Collect</h2>

        <p className={styles.paragraph}>
          We do not intentionally request or collect sensitive personal
          information unless it is strictly necessary and there is an
          appropriate legal basis for doing so.
        </p>

        <p className={styles.paragraph}>
          Please do not send us passwords, payment-card numbers, government
          identification documents, or other highly sensitive information
          through ordinary support messages unless we specifically request it
          through an appropriate secure process.
        </p>

        {/* 4 */}
        <h2 className={styles.heading}>4. How We Use Your Information</h2>

        <p className={styles.paragraph}>
          We may use personal information for the following purposes:
        </p>

        <ul className={styles.list}>
          <li>Creating and managing user accounts</li>
          <li>Authenticating users</li>
          <li>Providing access to purchased products</li>
          <li>Managing licenses and entitlements</li>
          <li>Delivering software and digital products</li>
          <li>Processing and confirming purchases</li>
          <li>Managing subscriptions where applicable</li>
          <li>Providing customer and technical support</li>
          <li>Detecting fraud and unauthorized activity</li>
          <li>Protecting our systems and users</li>
          <li>Maintaining and improving our Services</li>
          <li>Diagnosing technical problems</li>
          <li>Communicating with you about your account or purchase</li>
          <li>Complying with applicable legal obligations</li>
          <li>Enforcing our Terms of Service</li>
        </ul>

        {/* 5 */}
        <h2 className={styles.heading}>5. Legal Bases for Processing</h2>

        <p className={styles.paragraph}>
          Where applicable data-protection law requires a legal basis for
          processing personal information, we may rely on one or more of the
          following legal bases:
        </p>

        <ul className={styles.list}>
          <li>
            <strong>Contract:</strong> processing necessary to provide products,
            accounts, purchases, licenses, or Services you request.
          </li>

          <li>
            <strong>Legitimate interests:</strong> processing necessary to
            operate, secure, improve, and protect our Services, prevent abuse,
            and provide support.
          </li>

          <li>
            <strong>Legal obligations:</strong> processing required to comply
            with applicable laws, accounting requirements, tax requirements,
            legal requests, or regulatory obligations.
          </li>

          <li>
            <strong>Consent:</strong> where we specifically ask for your
            consent for a particular processing activity.
          </li>
        </ul>

        {/* 6 */}
        <h2 className={styles.heading}>6. Payment Processing</h2>

        <p className={styles.paragraph}>
          Payments for our products may be processed by a third-party payment
          provider or Merchant of Record, such as Paddle, depending on the
          checkout configuration applicable to your purchase.
        </p>

        <p className={styles.paragraph}>
          The payment provider may independently collect and process
          information necessary to complete your transaction, prevent fraud,
          comply with financial regulations, calculate applicable taxes,
          provide invoices, and provide transaction-related support.
        </p>

        <p className={styles.paragraph}>
          We may receive limited transaction information from the payment
          provider, such as your email address, product purchased, order ID,
          subscription status, and transaction status.
        </p>

        <p className={styles.paragraph}>
          The payment provider's own privacy policy also applies to information
          that it processes directly.
        </p>

        <p className={styles.paragraph}>
          You should review the privacy policy and terms presented by the
          payment provider during checkout.
        </p>

        {/* 7 */}
        <h2 className={styles.heading}>7. Cookies and Similar Technologies</h2>

        <p className={styles.paragraph}>
          Our website may use cookies, local storage, session storage, or
          similar technologies where necessary to operate the Services.
        </p>

        <p className={styles.paragraph}>
          These technologies may be used to:
        </p>

        <ul className={styles.list}>
          <li>Maintain sessions</li>
          <li>Remember necessary preferences</li>
          <li>Maintain authentication state</li>
          <li>Protect against security threats</li>
          <li>Measure website performance</li>
          <li>Understand website usage where analytics are enabled</li>
        </ul>

        <p className={styles.paragraph}>
          Where legally required, non-essential cookies or similar technologies
          will only be used after obtaining the appropriate consent.
        </p>

        {/* 8 */}
        <h2 className={styles.heading}>8. Analytics</h2>

        <p className={styles.paragraph}>
          We may use analytics and performance tools to understand how visitors
          interact with our website and to identify technical problems.
        </p>

        <p className={styles.paragraph}>
          Depending on the tools enabled on the website, analytics providers
          may process information such as device information, approximate
          location, pages visited, browser information, and interaction data.
        </p>

        <p className={styles.paragraph}>
          Analytics services will only be enabled and configured in accordance
          with applicable privacy and cookie requirements.
        </p>

        {/* 9 */}
        <h2 className={styles.heading}>9. Third-Party Services</h2>

        <p className={styles.paragraph}>
          We rely on selected third-party service providers to operate parts
          of our Services.
        </p>

        <p className={styles.paragraph}>
          Depending on the Services you use, these providers may include:
        </p>

        <ul className={styles.list}>
          <li>Payment and Merchant of Record providers</li>
          <li>Cloud hosting providers</li>
          <li>Database and infrastructure providers</li>
          <li>Authentication providers</li>
          <li>Software delivery and storage providers</li>
          <li>Analytics providers</li>
          <li>Customer support providers</li>
          <li>Email and communication providers</li>
          <li>Security and fraud-prevention providers</li>
        </ul>

        <p className={styles.paragraph}>
          These providers may process information on our behalf or, depending
          on the service, as independent controllers of their own information.
        </p>

        {/* 10 */}
        <h2 className={styles.heading}>10. Third-Party Platforms</h2>

        <p className={styles.paragraph}>
          Some of our products may interact with third-party platforms,
          including streaming, gaming, publishing, authentication, or content
          platforms.
        </p>

        <p className={styles.paragraph}>
          Where you choose to use such integrations, information may be
          exchanged between the relevant systems as necessary to provide the
          requested functionality.
        </p>

        <p className={styles.paragraph}>
          Third-party platforms operate under their own privacy policies and
          terms. We are not responsible for the privacy practices of services
          that we do not control.
        </p>

        {/* 11 */}
        <h2 className={styles.heading}>11. Authentication and Launcher Data</h2>

        <p className={styles.paragraph}>
          Our launcher may use an authentication process that creates temporary
          login requests and session credentials.
        </p>

        <p className={styles.paragraph}>
          This may involve information such as an installation identifier,
          temporary authentication state, authentication timestamps, account
          identifiers, and session information.
        </p>

        <p className={styles.paragraph}>
          Temporary authentication requests may expire automatically after a
          defined period. Session information may also expire or be invalidated
          when appropriate for security purposes.
        </p>

        <p className={styles.paragraph}>
          Authentication credentials are used solely to authenticate access to
          the Services and should not be shared with other people.
        </p>

        {/* 12 */}
        <h2 className={styles.heading}>12. License and Entitlement Data</h2>

        <p className={styles.paragraph}>
          When you purchase a digital product, we may create or update an
          entitlement associated with your account.
        </p>

        <p className={styles.paragraph}>
          Entitlement information may include:
        </p>

        <ul className={styles.list}>
          <li>User or account identifier</li>
          <li>Product or game identifier</li>
          <li>Purchase source</li>
          <li>License status</li>
          <li>Expiration date where applicable</li>
          <li>Verification timestamp</li>
        </ul>

        <p className={styles.paragraph}>
          This information allows our systems and launcher to determine
          whether an account is entitled to access a purchased product.
        </p>

        {/* 13 */}
        <h2 className={styles.heading}>13. How Long We Keep Information</h2>

        <p className={styles.paragraph}>
          We retain personal information only for as long as reasonably
          necessary for the purposes described in this Privacy Policy,
          including providing Services, maintaining records, resolving
          disputes, preventing fraud, enforcing agreements, and complying with
          legal obligations.
        </p>

        <p className={styles.paragraph}>
          Different categories of information may therefore be retained for
          different periods.
        </p>

        <p className={styles.paragraph}>
          Temporary authentication data may be deleted or become invalid after
          its intended security period.
        </p>

        <p className={styles.paragraph}>
          Transaction and accounting information may need to be retained for
          longer periods where required by tax, accounting, legal, or financial
          regulations.
        </p>

        {/* 14 */}
        <h2 className={styles.heading}>14. Data Security</h2>

        <p className={styles.paragraph}>
          We use reasonable technical and organizational measures designed to
          protect personal information against unauthorized access, loss,
          misuse, alteration, or disclosure.
        </p>

        <p className={styles.paragraph}>
          Depending on the type of information, these measures may include
          encrypted connections, access controls, authentication mechanisms,
          cryptographic hashing, database security controls, and restricted
          server access.
        </p>

        <p className={styles.paragraph}>
          However, no online service can be guaranteed to be completely secure.
          You should also take reasonable steps to protect your own devices,
          passwords, and authentication credentials.
        </p>

        {/* 15 */}
        <h2 className={styles.heading}>15. Data Sharing</h2>

        <p className={styles.paragraph}>
          We do not sell your personal information as a commercial product.
        </p>

        <p className={styles.paragraph}>
          We may share or disclose information where reasonably necessary to:
        </p>

        <ul className={styles.list}>
          <li>Provide the Services</li>
          <li>Process purchases and payments</li>
          <li>Provide customer support</li>
          <li>Host and secure our infrastructure</li>
          <li>Prevent fraud and abuse</li>
          <li>Maintain software delivery systems</li>
          <li>Comply with legal obligations</li>
          <li>Respond to valid legal requests</li>
          <li>Protect our rights, users, or systems</li>
        </ul>

        <p className={styles.paragraph}>
          We may also disclose information where necessary in connection with
          a merger, acquisition, restructuring, sale of assets, or similar
          business transaction, subject to applicable law.
        </p>

        {/* 16 */}
        <h2 className={styles.heading}>16. International Data Transfers</h2>

        <p className={styles.paragraph}>
          Our service providers may operate in countries other than the
          country in which you live.
        </p>

        <p className={styles.paragraph}>
          As a result, personal information may be transferred to and processed
          in other countries.
        </p>

        <p className={styles.paragraph}>
          Where applicable law requires safeguards for international transfers,
          we will take reasonable steps to use appropriate transfer mechanisms
          and protections.
        </p>

        {/* 17 */}
        <h2 className={styles.heading}>17. Your Privacy Rights</h2>

        <p className={styles.paragraph}>
          Depending on where you live and the privacy laws applicable to you,
          you may have rights relating to your personal information.
        </p>

        <p className={styles.paragraph}>
          These may include the right to:
        </p>

        <ul className={styles.list}>
          <li>Request access to personal information we hold about you</li>
          <li>Request correction of inaccurate information</li>
          <li>Request deletion of certain information</li>
          <li>Request restriction of certain processing</li>
          <li>Object to certain processing</li>
          <li>Request portability of certain information</li>
          <li>Withdraw consent where processing relies on consent</li>
          <li>
            Lodge a complaint with the relevant data-protection authority
          </li>
        </ul>

        <p className={styles.paragraph}>
          These rights are not absolute and may be subject to legal
          limitations or exceptions.
        </p>

        {/* 18 */}
        <h2 className={styles.heading}>18. European Economic Area and GDPR</h2>

        <p className={styles.paragraph}>
          If you are located in the European Economic Area or another
          jurisdiction where the GDPR applies, you may have additional rights
          under applicable data-protection law.
        </p>

        <p className={styles.paragraph}>
          We aim to process personal information in accordance with applicable
          GDPR requirements, including principles relating to lawfulness,
          fairness, transparency, purpose limitation, data minimization,
          accuracy, storage limitation, integrity, and confidentiality.
        </p>

        <p className={styles.paragraph}>
          If you wish to exercise a privacy right, contact us using the email
          address provided below.
        </p>

        {/* 19 */}
        <h2 className={styles.heading}>19. Children's Privacy</h2>

        <p className={styles.paragraph}>
          Our Services are not intentionally directed toward children who are
          not legally permitted to use or purchase the relevant Services.
        </p>

        <p className={styles.paragraph}>
          We do not knowingly collect personal information from children for
          purposes that are prohibited by applicable law.
        </p>

        <p className={styles.paragraph}>
          If you believe that a child has provided personal information to us
          inappropriately, please contact us so that we can investigate and
          take appropriate action.
        </p>

        {/* 20 */}
        <h2 className={styles.heading}>20. Email Communications</h2>

        <p className={styles.paragraph}>
          We may contact you regarding purchases, account activity, security
          events, technical issues, important Service changes, or customer
          support requests.
        </p>

        <p className={styles.paragraph}>
          We will not use transactional communications as a substitute for
          marketing consent where applicable law requires separate consent.
        </p>

        {/* 21 */}
        <h2 className={styles.heading}>21. Fraud and Security Monitoring</h2>

        <p className={styles.paragraph}>
          We may process technical, account, and transaction information to
          detect suspicious activity, unauthorized access, fraudulent
          purchases, abuse of licenses, or attempts to compromise our systems.
        </p>

        <p className={styles.paragraph}>
          This may include analyzing authentication events, purchase status,
          account activity, IP information, and other security-related
          information reasonably necessary to protect our Services.
        </p>

        {/* 22 */}
        <h2 className={styles.heading}>22. Changes to This Privacy Policy</h2>

        <p className={styles.paragraph}>
          We may update this Privacy Policy when reasonably necessary to
          reflect changes to our Services, technology, third-party providers,
          legal requirements, or business practices.
        </p>

        <p className={styles.paragraph}>
          The latest version will always be published on this page together
          with its effective or updated date.
        </p>

        <p className={styles.paragraph}>
          Where applicable law requires additional notice or consent for a
          material change, we will provide that notice or obtain consent as
          required.
        </p>

        {/* 23 */}
        <h2 className={styles.heading}>23. Contact Us</h2>

        <p className={styles.paragraph}>
          If you have a question about this Privacy Policy or want to exercise
          a privacy right, contact us at:
        </p>

        <p className={styles.paragraph}>
          <a
            href="mailto:athlocalwebstudio@gmail.com"
            className={styles.link}
          >
            athlocalwebstudio@gmail.com
          </a>
        </p>

        <p className={styles.paragraph}>
          Please include enough information for us to understand and process
          your request. We may need to verify your identity before fulfilling
          certain requests in order to protect your information.
        </p>
      </div>
    </section>
  );
};

export default PrivacyPolicy;