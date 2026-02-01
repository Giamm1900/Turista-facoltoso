import { Route, Routes } from "react-router";
import "./index.css";
import {Layout} from "./components/layout/layout";
import Homepage from "./components/pages/homepage";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<Homepage />} />
        <Route element={""}>
          <Route path="cart" element={""} />
          <Route path="checkout/billing" element={"<CheckoutBilling />"} />
          <Route path="checkout/shipping" element={"<CheckoutShipping />"} />
        </Route>
        <Route path="thank-you" element={"<ThankYou />"} />
      </Route>
    </Routes>
  );
}

export default App;
