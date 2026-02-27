import { Route, Routes } from "react-router";
import "./index.css";
import { Layout } from "./components/layout/layout";
import Reservation from "./components/pages/Reservation";
import Residences from "./components/pages/Residences";
import Users from "./components/pages/Users";
import Hosts from "./components/pages/Hosts";
import FeedbackList from "./components/pages/FeedbackList";
import RentProvider from "./components/context/rent-provider";
import HomepageCloude from "./components/pages/HomepageCloude";

function App() {
  return (
    <RentProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomepageCloude />} />
          <Route path="prenotazioni" element={<Reservation />} />
          <Route path="abitazioni" element={<Residences />} />
          <Route path="utenti" element={<Users />} />
          <Route path="hosts" element={<Hosts />} />
          <Route path="feedbacks" element={<FeedbackList />} />
        </Route>
      </Routes>
    </RentProvider>
  );
}

export default App;
