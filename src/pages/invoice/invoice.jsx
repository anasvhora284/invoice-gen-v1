import "./invoice.css";
import Logo from "../../assets/SplashScreenLogo.png";

const InvoiceHtml = ({ userData }) => {
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

  return (
    <>
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
            <td rowSpan="2" className="client-name">
              {userData.fullName}
            </td>
            <td className="AddressField">સાંસ્કૃતિક હોલ,</td>
          </tr>
          <tr>
            <td className="AddressField">પોલશન ડેરી રોડ, આણંદ</td>
          </tr>
          <tr>
            <td>
              Invoice Date: <strong>{formattedDate}</strong>
            </td>
            <td className="AddressField">ગુજરાત, 387130</td>
          </tr>
          <tr>
            <td>
              Invoice No: <strong>{getTimestampWithMilliseconds()}</strong>
            </td>
            <td>hello@useanvil.com</td>
          </tr>
        </tbody>
      </table>

      <table className="line-items-container">
        <thead>
          <tr>
            <th className="heading-quantity">Qty</th>
            <th className="heading-description">Description</th>
            <th className="heading-price">Price</th>
            <th className="heading-subtotal">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2</td>
            <td>Blue large widgets</td>
            <td className="right">$15.00</td>
            <td className="bold">$30.00</td>
          </tr>
          <tr>
            <td>4</td>
            <td>Green medium widgets</td>
            <td className="right">$10.00</td>
            <td className="bold">$40.00</td>
          </tr>
          <tr>
            <td>5</td>
            <td>Red small widgets with logo</td>
            <td className="right">$7.00</td>
            <td className="bold">$35.00</td>
          </tr>
        </tbody>
      </table>

      <table className="line-items-container has-bottom-border">
        <thead>
          <tr>
            <th>Payment Info</th>
            <th>Due By</th>
            <th>Total Due</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="payment-info">
              <div>
                Account No: <strong>123567744</strong>
              </div>
              <div>
                Routing No: <strong>120000547</strong>
              </div>
            </td>
            <td className="large">May 30th, 2024</td>
            <td className="large total">$105.00</td>
          </tr>
        </tbody>
      </table>

      <div className="footer">
        <div className="footer-info">
          <span>hello@useanvil.com</span> | <span>555 444 6666</span> |
          <span>useanvil.com</span>
        </div>
        <div className="footer-thanks">
          <img
            src="https://github.com/anvilco/html-pdf-invoice-template/raw/main/img/heart.png"
            alt="heart"
          />
          <span>Thank you!</span>
        </div>
      </div>
    </>
  );
};

export default InvoiceHtml;
