import "./invoice.css";

const InvoiceHtml = () => {
  return (
    <>
      <div className="page-container actual-receipt">
        Page
        <span className="page"></span>
        of
        <span className="pages"></span>
      </div>

      <div className="logo-container">
        <img
          style={{ height: "18px" }}
          src="https://app.useanvil.com/img/email-logo-black.png"
          alt="Anvil Logo"
        />
      </div>

      <table className="invoice-info-container">
        <tbody>
          <tr>
            <td rowSpan="2" className="client-name">
              Client Name
            </td>
            <td>Anvil Co</td>
          </tr>
          <tr>
            <td>123 Main Street</td>
          </tr>
          <tr>
            <td>
              Invoice Date: <strong>May 24th, 2024</strong>
            </td>
            <td>San Francisco CA, 94103</td>
          </tr>
          <tr>
            <td>
              Invoice No: <strong>12345</strong>
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
