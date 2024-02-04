import "./invoice.css";
import Logo from "../../assets/SplashScreenLogo.png";
import HeartIcon from "../../assets/HeartIcon.png";

const InvoiceHtml = ({ userData, generatorData }) => {
  const date = userData.currentDate;
  const formattedDate =
    date.toString().slice(8, 11) +
    date.toString().slice(4, 7) +
    date.toString().slice(10, 15);

  function getTimestampWithMilliseconds() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const milliseconds = String(now.getMilliseconds()).padStart(3, "0");

    const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}${milliseconds}`;

    return timestamp;
  }

  const paymentDescription = {
    subscriptionFee: "ઉમેદવારી ફી ના",
    groupWeddingFee: "સમુહ લગ્ન ફી",
    forCasteDinner: "જમણવારના",
    forHappyMarriage: "લગ્ન ખુશાલીના",
    councilFees: "સભાસદ ફી",
    education: "એજ્યુકેશન",
    donation: "ડોનેશન",
    other: "અન્ય",
  };

  function numberWithCommas(x) {
    return x.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  }

  return (
    <div style={{ fontFamily: "Times New Roman" }}>
      <div className="page-container actual-receipt">
        Page
        <span className="page"></span>
        of
        <span className="pages"></span>
      </div>

      <div
        className="logo-container"
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img style={{ height: "80px" }} src={Logo} alt="Anvil Logo" />
      </div>
      <div className="HeadingTextDiv">
        <span className="HeadingText">
          ચરોતર સુન્ની વ્હોરા સુધારક મંડળ (68 અટક)
        </span>
      </div>

      <table className="invoice-info-container">
        <tbody>
          <tr>
            <td className="client-name">{userData.fullName}</td>
            <td className="AddressField">વહોરા કોમ્યુનીટીહોલ, રહીમાનગર - ૩,</td>
          </tr>
          <tr>
            <td>
              {userData.mobileNumber}, {userData.city}
            </td>
            <td className="AddressField">
              મન્નત રેસિડેન્સી પહેલાં સલાટીયા રોડ,
            </td>
          </tr>
          <tr>
            <td>
              Invoice Date: <strong>{formattedDate}</strong>
            </td>
            <td className="AddressField">આણંદ, ગુજરાત, 387130</td>
          </tr>
          <tr>
            <td>
              Invoice No: <strong>{getTimestampWithMilliseconds()}</strong>
            </td>
            <td>+91 94996 50790</td>
          </tr>
        </tbody>
      </table>

      <table className="line-items-container">
        <thead>
          <tr>
            <th className="heading-quantity">Sr.</th>
            <th className="heading-description">Payment Description</th>
            <th className="heading-price">Amount</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(userData.amountDetails).map(
            ([description, amount], index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{paymentDescription[description]}</td>
                <td className="right">
                  {amount > 0 ? `${numberWithCommas(amount)}/-` : `--`}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>

      <table className="line-items-container has-bottom-border">
        <thead>
          <tr>
            <th>Payment Menthod</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="payment-info">
              <div>
                <strong>{userData.paymentMethod}</strong>
              </div>
            </td>
            <td className="large total">
              <strong>
                {userData.totalAmount > 0
                  ? `${numberWithCommas(userData.totalAmount)}/-`
                  : `--`}
              </strong>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="footer">
        <div className="footer-info">
          <span>
            Note: Thank you for your support! This is computerized generated
            Receipt!
          </span>
        </div>
        <div className="footer-thanks">
          <span>Thank you!</span>
          <img src={HeartIcon} alt="heart" />
        </div>
        <div className="footer-thanks generator-data">
          <span>Generated by:</span>
          <span>{generatorData.generatorName || "--"}</span>
          {generatorData.generatorMobile ? (
            <span>{`(${generatorData.generatorMobile})`}</span>
          ) : (
            "--"
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceHtml;
