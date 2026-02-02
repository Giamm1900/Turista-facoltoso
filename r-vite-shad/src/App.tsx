import { Route, Routes } from "react-router";
import "./index.css";
import {Layout} from "./components/layout/layout";
import Homepage from "./components/pages/homepage";
import Reservation from "./components/pages/reservation-list-form";
import Residences from "./components/pages/Residences";
import Users from "./components/pages/Users";
import Hosts from "./components/pages/Hosts";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<Homepage />} />
        <Route path="prenotazioni" element={<Reservation/>} />
        <Route path="abitazioni" element={<Residences/>}/>
        <Route path="utenti" element={<Users/>}/>
        <Route path="hosts" element={<Hosts/>}/>
      </Route>
    </Routes>
  );
}

export default App;
